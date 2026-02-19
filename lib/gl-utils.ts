/**
 * Minimal WebGL2 utilities for the hero effect.
 */

export function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${log}`);
  }
  return shader;
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertSrc: string,
  fragSrc: string
): WebGLProgram {
  const vert = createShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  const program = gl.createProgram()!;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${log}`);
  }
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  return program;
}

export function createFullscreenQuad(gl: WebGL2RenderingContext): {
  vao: WebGLVertexArrayObject;
  draw: () => void;
} {
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);

  const buf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  // Two triangles covering clip space
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  return {
    vao,
    draw: () => {
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
  };
}

export function createTexture(
  gl: WebGL2RenderingContext,
  options?: {
    wrap?: number;
    filter?: number;
    internalFormat?: number;
    format?: number;
    type?: number;
    width?: number;
    height?: number;
    data?: ArrayBufferView | null;
  }
): WebGLTexture {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);

  const wrap = options?.wrap ?? gl.CLAMP_TO_EDGE;
  const filter = options?.filter ?? gl.LINEAR;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);

  if (options?.width && options?.height) {
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      options.internalFormat ?? gl.RGBA8,
      options.width,
      options.height,
      0,
      options.format ?? gl.RGBA,
      options.type ?? gl.UNSIGNED_BYTE,
      options.data ?? null
    );
  }

  return tex;
}

export interface FBO {
  framebuffer: WebGLFramebuffer;
  texture: WebGLTexture;
  width: number;
  height: number;
}

export function createFBO(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  internalFormat: number = gl.RGBA16F,
  format: number = gl.RGBA,
  type: number = gl.HALF_FLOAT
): FBO {
  const texture = createTexture(gl, {
    width,
    height,
    internalFormat,
    format,
    type,
    filter: gl.LINEAR,
  });

  const framebuffer = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return { framebuffer, texture, width, height };
}

export interface DoubleFBO {
  read: FBO;
  write: FBO;
  swap: () => void;
}

export function createDoubleFBO(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  internalFormat?: number,
  format?: number,
  type?: number
): DoubleFBO {
  let read = createFBO(gl, width, height, internalFormat, format, type);
  let write = createFBO(gl, width, height, internalFormat, format, type);
  return {
    get read() {
      return read;
    },
    get write() {
      return write;
    },
    swap() {
      const temp = read;
      read = write;
      write = temp;
    },
  };
}

export function setUniforms(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  uniforms: Record<string, number | number[] | Float32Array>
) {
  for (const [name, value] of Object.entries(uniforms)) {
    const loc = gl.getUniformLocation(program, name);
    if (loc === null) continue;
    if (typeof value === "number") {
      gl.uniform1f(loc, value);
    } else if (value.length === 2) {
      gl.uniform2fv(loc, value);
    } else if (value.length === 3) {
      gl.uniform3fv(loc, value);
    } else if (value.length === 4) {
      gl.uniform4fv(loc, value);
    }
  }
}

export function setUniformInt(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  value: number
) {
  const loc = gl.getUniformLocation(program, name);
  if (loc !== null) gl.uniform1i(loc, value);
}
