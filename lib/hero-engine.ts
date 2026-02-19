/**
 * HeroEngine: WebGL2 multi-pass renderer for full-screen ASCII effect.
 *
 * Pipeline per frame:
 *  1. Fluid sim: splat → advect velocity → curl → vorticity → divergence → pressure solve → gradient subtract → advect dye
 *  2. Layer A: subtle background scene → FBO
 *  3. Layer B: full-screen ASCII post-process (samples Layer A + fluid density + color wheel) → FBO
 *  4. Composite: blend Layer A + B → screen
 */

import {
  createProgram,
  createFullscreenQuad,
  createDoubleFBO,
  createFBO,
  setUniforms,
  setUniformInt,
  createTexture,
  type DoubleFBO,
  type FBO,
} from "./gl-utils";
import {
  FULLSCREEN_VERT,
  SPLAT_FRAG,
  ADVECT_FRAG,
  DIVERGENCE_FRAG,
  PRESSURE_FRAG,
  GRADIENT_SUBTRACT_FRAG,
  CURL_FRAG,
  VORTICITY_FRAG,
  BACKGROUND_FRAG,
  ASCII_FRAG,
  COMPOSITE_FRAG,
} from "./shaders";
import { createGlyphAtlas } from "./glyph-atlas";

export interface HeroEngineConfig {
  canvas: HTMLCanvasElement;
  colorWheelUrl: string;
  glyphSet?: string;
  charSize?: number;
  theme?: number;
  reducedMotion?: boolean;
  quality?: "low" | "medium" | "high";
}

interface PointerState {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  velocity: number;
  dx: number;
  dy: number;
}

const SIM_RES: Record<string, number> = {
  low: 64,
  medium: 128,
  high: 256,
};

const PRESSURE_ITERATIONS = 8;
const CURL_STRENGTH = 0.3;
const VELOCITY_DISSIPATION = 0.97;
const DENSITY_DISSIPATION = 0.985;
const SPLAT_RADIUS = 0.012;
const SPLAT_FORCE = 6.0;

export class HeroEngine {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private quad: ReturnType<typeof createFullscreenQuad>;

  // Programs
  private splatProg!: WebGLProgram;
  private advectProg!: WebGLProgram;
  private divergenceProg!: WebGLProgram;
  private pressureProg!: WebGLProgram;
  private gradSubProg!: WebGLProgram;
  private curlProg!: WebGLProgram;
  private vorticityProg!: WebGLProgram;
  private bgProg!: WebGLProgram;
  private asciiProg!: WebGLProgram;
  private compositeProg!: WebGLProgram;

  // FBOs
  private velocityFBO!: DoubleFBO;
  private dyeFBO!: DoubleFBO;
  private divergenceFBO!: FBO;
  private pressureFBO!: DoubleFBO;
  private curlFBO!: FBO;
  private layerAFBO!: FBO;
  private layerBFBO!: FBO;

  // Textures
  private colorWheelTexture!: WebGLTexture;
  private glyphAtlas!: { texture: WebGLTexture; count: number };

  // State
  private pointer: PointerState = {
    x: 0.5,
    y: 0.5,
    prevX: 0.5,
    prevY: 0.5,
    velocity: 0,
    dx: 0,
    dy: 0,
  };
  private firstPointer = true;
  private time = 0;
  private lastTime = 0;
  private rafId = 0;
  private running = false;
  private config: Required<
    Pick<
      HeroEngineConfig,
      "charSize" | "theme" | "reducedMotion" | "quality" | "glyphSet"
    >
  >;
  private simRes: number;
  private dpr: number;
  private splatQueue: Array<{ x: number; y: number; dx: number; dy: number }> = [];

  constructor(config: HeroEngineConfig) {
    this.canvas = config.canvas;
    this.config = {
      charSize: config.charSize ?? 9,
      theme: config.theme ?? 1,
      reducedMotion: config.reducedMotion ?? false,
      quality: config.quality ?? "medium",
      glyphSet: config.glyphSet ?? " .-:;=+*#%@VMWA&$",
    };
    this.simRes = SIM_RES[this.config.quality];
    this.dpr = Math.min(window.devicePixelRatio, 2);

    const gl = this.canvas.getContext("webgl2", {
      alpha: false,
      premultipliedAlpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });

    if (!gl) throw new Error("WebGL2 not supported");
    this.gl = gl;

    gl.getExtension("EXT_color_buffer_float");

    this.quad = createFullscreenQuad(gl);
    this.initPrograms();
    this.initFBOs();
    this.initTextures(config);
  }

  private initPrograms() {
    const gl = this.gl;
    this.splatProg = createProgram(gl, FULLSCREEN_VERT, SPLAT_FRAG);
    this.advectProg = createProgram(gl, FULLSCREEN_VERT, ADVECT_FRAG);
    this.divergenceProg = createProgram(gl, FULLSCREEN_VERT, DIVERGENCE_FRAG);
    this.pressureProg = createProgram(gl, FULLSCREEN_VERT, PRESSURE_FRAG);
    this.gradSubProg = createProgram(gl, FULLSCREEN_VERT, GRADIENT_SUBTRACT_FRAG);
    this.curlProg = createProgram(gl, FULLSCREEN_VERT, CURL_FRAG);
    this.vorticityProg = createProgram(gl, FULLSCREEN_VERT, VORTICITY_FRAG);
    this.bgProg = createProgram(gl, FULLSCREEN_VERT, BACKGROUND_FRAG);
    this.asciiProg = createProgram(gl, FULLSCREEN_VERT, ASCII_FRAG);
    this.compositeProg = createProgram(gl, FULLSCREEN_VERT, COMPOSITE_FRAG);
  }

  private initFBOs() {
    const gl = this.gl;
    const sim = this.simRes;

    this.velocityFBO = createDoubleFBO(gl, sim, sim, gl.RG16F, gl.RG, gl.HALF_FLOAT);
    this.dyeFBO = createDoubleFBO(gl, sim, sim, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT);
    this.divergenceFBO = createFBO(gl, sim, sim, gl.R16F, gl.RED, gl.HALF_FLOAT);
    this.pressureFBO = createDoubleFBO(gl, sim, sim, gl.R16F, gl.RED, gl.HALF_FLOAT);
    this.curlFBO = createFBO(gl, sim, sim, gl.R16F, gl.RED, gl.HALF_FLOAT);

    this.resizeRenderFBOs();
  }

  private resizeRenderFBOs() {
    const gl = this.gl;
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (this.layerAFBO) {
      gl.deleteFramebuffer(this.layerAFBO.framebuffer);
      gl.deleteTexture(this.layerAFBO.texture);
    }
    if (this.layerBFBO) {
      gl.deleteFramebuffer(this.layerBFBO.framebuffer);
      gl.deleteTexture(this.layerBFBO.texture);
    }

    this.layerAFBO = createFBO(gl, w, h, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT);
    this.layerBFBO = createFBO(gl, w, h, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);
  }

  private initTextures(config: HeroEngineConfig) {
    const gl = this.gl;

    this.glyphAtlas = createGlyphAtlas(gl, this.config.glyphSet);

    // Color wheel texture (loaded async)
    this.colorWheelTexture = createTexture(gl, {
      filter: gl.LINEAR,
      wrap: gl.REPEAT,
    });
    // Initialize with 1x1 white
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 255])
    );
    this.loadColorWheel(config.colorWheelUrl);
  }

  private loadColorWheel(url: string) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const gl = this.gl;
      gl.bindTexture(gl.TEXTURE_2D, this.colorWheelTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    };
    img.src = url;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.floor(rect.width * this.dpr);
    const h = Math.floor(rect.height * this.dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.resizeRenderFBOs();
    }
  }

  updatePointer(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = 1.0 - (clientY - rect.top) / rect.height;

    if (this.firstPointer) {
      this.firstPointer = false;
      this.pointer.prevX = x;
      this.pointer.prevY = y;
      this.pointer.x = x;
      this.pointer.y = y;
      return;
    }

    const dx = x - this.pointer.x;
    const dy = y - this.pointer.y;

    this.pointer.prevX = this.pointer.x;
    this.pointer.prevY = this.pointer.y;
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.dx = dx;
    this.pointer.dy = dy;
    this.pointer.velocity = Math.min(
      Math.sqrt(dx ** 2 + dy ** 2) * 50,
      5.0
    );

    // Queue splat for next frame
    if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
      this.splatQueue.push({ x, y, dx: SPLAT_FORCE * dx, dy: -SPLAT_FORCE * dy });
    }
  }

  clearPointer() {
    this.pointer.velocity = 0;
    this.pointer.dx = 0;
    this.pointer.dy = 0;
  }

  // ─── Simulation passes ───

  private splat(
    target: DoubleFBO,
    x: number,
    y: number,
    color: [number, number, number],
    radius: number
  ) {
    const gl = this.gl;
    gl.useProgram(this.splatProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.write.framebuffer);
    gl.viewport(0, 0, target.write.width, target.write.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, target.read.texture);
    setUniformInt(gl, this.splatProg, "uTarget", 0);

    setUniforms(gl, this.splatProg, {
      uPoint: [x, y],
      uColor: color,
      uRadius: radius,
      uAspect: this.canvas.width / this.canvas.height,
    });

    this.quad.draw();
    target.swap();
  }

  private advect(
    velocity: DoubleFBO,
    source: DoubleFBO,
    dt: number,
    dissipation: number
  ) {
    const gl = this.gl;
    gl.useProgram(this.advectProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, source.write.framebuffer);
    gl.viewport(0, 0, source.write.width, source.write.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
    setUniformInt(gl, this.advectProg, "uVelocity", 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, source.read.texture);
    setUniformInt(gl, this.advectProg, "uSource", 1);

    setUniforms(gl, this.advectProg, {
      uDt: dt,
      uDissipation: dissipation,
      uTexelSize: [1.0 / source.read.width, 1.0 / source.read.height],
    });

    this.quad.draw();
    source.swap();
  }

  private computeCurl() {
    const gl = this.gl;
    gl.useProgram(this.curlProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.curlFBO.framebuffer);
    gl.viewport(0, 0, this.curlFBO.width, this.curlFBO.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.velocityFBO.read.texture);
    setUniformInt(gl, this.curlProg, "uVelocity", 0);

    setUniforms(gl, this.curlProg, {
      uTexelSize: [
        1.0 / this.velocityFBO.read.width,
        1.0 / this.velocityFBO.read.height,
      ],
    });

    this.quad.draw();
  }

  private applyVorticity(dt: number) {
    const gl = this.gl;
    gl.useProgram(this.vorticityProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.velocityFBO.write.framebuffer);
    gl.viewport(0, 0, this.velocityFBO.write.width, this.velocityFBO.write.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.velocityFBO.read.texture);
    setUniformInt(gl, this.vorticityProg, "uVelocity", 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.curlFBO.texture);
    setUniformInt(gl, this.vorticityProg, "uCurl", 1);

    setUniforms(gl, this.vorticityProg, {
      uCurlStrength: CURL_STRENGTH,
      uDt: dt,
      uTexelSize: [
        1.0 / this.velocityFBO.read.width,
        1.0 / this.velocityFBO.read.height,
      ],
    });

    this.quad.draw();
    this.velocityFBO.swap();
  }

  private computeDivergence() {
    const gl = this.gl;
    gl.useProgram(this.divergenceProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.divergenceFBO.framebuffer);
    gl.viewport(0, 0, this.divergenceFBO.width, this.divergenceFBO.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.velocityFBO.read.texture);
    setUniformInt(gl, this.divergenceProg, "uVelocity", 0);

    setUniforms(gl, this.divergenceProg, {
      uTexelSize: [
        1.0 / this.velocityFBO.read.width,
        1.0 / this.velocityFBO.read.height,
      ],
    });

    this.quad.draw();
  }

  private solvePressure() {
    const gl = this.gl;
    gl.useProgram(this.pressureProg);

    // Clear pressure with dissipation
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pressureFBO.read.framebuffer);
    gl.viewport(0, 0, this.pressureFBO.read.width, this.pressureFBO.read.height);

    // Use the clear program to apply pressure dissipation
    // Simple clear to scaled value
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.pressureFBO.write.framebuffer);
      gl.viewport(0, 0, this.pressureFBO.write.width, this.pressureFBO.write.height);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.pressureFBO.read.texture);
      setUniformInt(gl, this.pressureProg, "uPressure", 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.divergenceFBO.texture);
      setUniformInt(gl, this.pressureProg, "uDivergence", 1);

      setUniforms(gl, this.pressureProg, {
        uTexelSize: [
          1.0 / this.pressureFBO.read.width,
          1.0 / this.pressureFBO.read.height,
        ],
      });

      this.quad.draw();
      this.pressureFBO.swap();
    }
  }

  private gradientSubtract() {
    const gl = this.gl;
    gl.useProgram(this.gradSubProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.velocityFBO.write.framebuffer);
    gl.viewport(0, 0, this.velocityFBO.write.width, this.velocityFBO.write.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.pressureFBO.read.texture);
    setUniformInt(gl, this.gradSubProg, "uPressure", 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.velocityFBO.read.texture);
    setUniformInt(gl, this.gradSubProg, "uVelocity", 1);

    setUniforms(gl, this.gradSubProg, {
      uTexelSize: [
        1.0 / this.velocityFBO.read.width,
        1.0 / this.velocityFBO.read.height,
      ],
    });

    this.quad.draw();
    this.velocityFBO.swap();
  }

  private stepFluid(dt: number) {
    if (this.config.reducedMotion) return;

    // Process queued splats from mouse movement
    for (const s of this.splatQueue) {
      // Splat velocity
      this.splat(
        this.velocityFBO,
        s.x,
        s.y,
        [s.dx, s.dy, 0],
        SPLAT_RADIUS
      );

      // Splat dye color - strong values for vivid color wheel activation
      this.splat(
        this.dyeFBO,
        s.x,
        s.y,
        [
          Math.abs(s.dx) * 8 + 3.0,
          Math.abs(s.dy) * 8 + 4.0,
          Math.abs(s.dx + s.dy) * 6 + 5.0,
        ],
        SPLAT_RADIUS * 3
      );
    }
    this.splatQueue.length = 0;

    // Advect velocity
    this.advect(this.velocityFBO, this.velocityFBO, dt, VELOCITY_DISSIPATION);

    // Curl → vorticity confinement
    this.computeCurl();
    this.applyVorticity(dt);

    // Divergence → pressure → gradient subtract
    this.computeDivergence();
    this.solvePressure();
    this.gradientSubtract();

    // Advect dye
    this.advect(this.velocityFBO, this.dyeFBO, dt, DENSITY_DISSIPATION);
  }

  // ─── Render passes ───

  private renderLayerA() {
    const gl = this.gl;
    gl.useProgram(this.bgProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.layerAFBO.framebuffer);
    gl.viewport(0, 0, this.layerAFBO.width, this.layerAFBO.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.dyeFBO.read.texture);
    setUniformInt(gl, this.bgProg, "uFlowColor", 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.velocityFBO.read.texture);
    setUniformInt(gl, this.bgProg, "uFlowVelocity", 1);

    setUniforms(gl, this.bgProg, {
      uMouse: [this.pointer.x, this.pointer.y],
      uTime: this.time,
      uResolution: [this.canvas.width, this.canvas.height],
      uReducedMotion: this.config.reducedMotion ? 1.0 : 0.0,
      uTheme: this.config.theme,
    });

    this.quad.draw();
  }

  private renderLayerB() {
    const gl = this.gl;
    gl.useProgram(this.asciiProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.layerBFBO.framebuffer);
    gl.viewport(0, 0, this.layerBFBO.width, this.layerBFBO.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.layerAFBO.texture);
    setUniformInt(gl, this.asciiProg, "uScene", 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.glyphAtlas.texture);
    setUniformInt(gl, this.asciiProg, "uGlyphAtlas", 1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.dyeFBO.read.texture);
    setUniformInt(gl, this.asciiProg, "uFluidDensity", 2);

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.colorWheelTexture);
    setUniformInt(gl, this.asciiProg, "uColorWheel", 3);

    setUniforms(gl, this.asciiProg, {
      uTime: this.time,
      uResolution: [this.canvas.width, this.canvas.height],
      uCharSize: this.config.charSize * this.dpr,
      uCharLength: this.glyphAtlas.count,
      uTheme: this.config.theme,
    });

    this.quad.draw();
  }

  private composite() {
    const gl = this.gl;
    gl.useProgram(this.compositeProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.layerAFBO.texture);
    setUniformInt(gl, this.compositeProg, "uLayerA", 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.layerBFBO.texture);
    setUniformInt(gl, this.compositeProg, "uLayerB", 1);

    setUniforms(gl, this.compositeProg, {
      uTheme: this.config.theme,
    });

    this.quad.draw();
  }

  // ─── Main loop ───

  private frame = (now: number) => {
    if (!this.running) return;

    const dt = Math.min((now - this.lastTime) / 1000, 0.033);
    this.lastTime = now;
    this.time += dt;

    this.pointer.velocity *= 0.92;
    this.pointer.dx *= 0.92;
    this.pointer.dy *= 0.92;

    this.resize();
    this.stepFluid(dt);
    this.renderLayerA();
    this.renderLayerB();
    this.composite();

    this.rafId = requestAnimationFrame(this.frame);
  };

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  setTheme(theme: number) {
    this.config.theme = theme;
  }

  setReducedMotion(reduced: boolean) {
    this.config.reducedMotion = reduced;
  }

  setCharSize(size: number) {
    this.config.charSize = size;
  }

  destroy() {
    this.stop();

    const gl = this.gl;
    gl.deleteTexture(this.colorWheelTexture);
    gl.deleteTexture(this.glyphAtlas.texture);

    gl.deleteFramebuffer(this.layerAFBO.framebuffer);
    gl.deleteTexture(this.layerAFBO.texture);
    gl.deleteFramebuffer(this.layerBFBO.framebuffer);
    gl.deleteTexture(this.layerBFBO.texture);

    gl.deleteProgram(this.splatProg);
    gl.deleteProgram(this.advectProg);
    gl.deleteProgram(this.divergenceProg);
    gl.deleteProgram(this.pressureProg);
    gl.deleteProgram(this.gradSubProg);
    gl.deleteProgram(this.curlProg);
    gl.deleteProgram(this.vorticityProg);
    gl.deleteProgram(this.bgProg);
    gl.deleteProgram(this.asciiProg);
    gl.deleteProgram(this.compositeProg);
  }
}
