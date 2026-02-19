/**
 * GLSL shaders for the two-layer hero effect.
 */

// Shared fullscreen vertex shader
export const FULLSCREEN_VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPosition;
out vec2 vUV;
void main() {
  vUV = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

// ─────────────────────────────────────────────
// Flowmap simulation shaders
// ─────────────────────────────────────────────

export const SPLAT_FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec3 uColor;
uniform float uRadius;
uniform float uAspect;

void main() {
  vec2 p = vUV - uPoint;
  p.x *= uAspect;
  float d = dot(p, p);
  float falloff = exp(-d / uRadius);
  vec3 base = texture(uTarget, vUV).rgb;
  fragColor = vec4(base + uColor * falloff, 1.0);
}
`;

export const ADVECT_FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform float uDt;
uniform float uDissipation;
uniform vec2 uTexelSize;

void main() {
  vec2 vel = texture(uVelocity, vUV).xy;
  vec2 coord = vUV - uDt * vel * uTexelSize;
  fragColor = uDissipation * texture(uSource, coord);
}
`;

export const DIVERGENCE_FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

void main() {
  float L = texture(uVelocity, vUV - vec2(uTexelSize.x, 0.0)).x;
  float R = texture(uVelocity, vUV + vec2(uTexelSize.x, 0.0)).x;
  float B = texture(uVelocity, vUV - vec2(0.0, uTexelSize.y)).y;
  float T = texture(uVelocity, vUV + vec2(0.0, uTexelSize.y)).y;
  vec2 C = texture(uVelocity, vUV).xy;
  if (vUV.x - uTexelSize.x < 0.0) L = -C.x;
  if (vUV.x + uTexelSize.x > 1.0) R = -C.x;
  if (vUV.y + uTexelSize.y > 1.0) T = -C.y;
  if (vUV.y - uTexelSize.y < 0.0) B = -C.y;
  float div = 0.5 * (R - L + T - B);
  fragColor = vec4(div, 0.0, 0.0, 1.0);
}
`;

export const PRESSURE_FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexelSize;

void main() {
  float L = texture(uPressure, vUV - vec2(uTexelSize.x, 0.0)).x;
  float R = texture(uPressure, vUV + vec2(uTexelSize.x, 0.0)).x;
  float B = texture(uPressure, vUV - vec2(0.0, uTexelSize.y)).x;
  float T = texture(uPressure, vUV + vec2(0.0, uTexelSize.y)).x;
  float div = texture(uDivergence, vUV).x;
  fragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
}
`;

export const GRADIENT_SUBTRACT_FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

void main() {
  float L = texture(uPressure, vUV - vec2(uTexelSize.x, 0.0)).x;
  float R = texture(uPressure, vUV + vec2(uTexelSize.x, 0.0)).x;
  float B = texture(uPressure, vUV - vec2(0.0, uTexelSize.y)).x;
  float T = texture(uPressure, vUV + vec2(0.0, uTexelSize.y)).x;
  vec2 vel = texture(uVelocity, vUV).xy;
  vel -= vec2(R - L, T - B) * 0.5;
  fragColor = vec4(vel, 0.0, 1.0);
}
`;

// ─────────────────────────────────────────────
// Vorticity confinement shaders
// ─────────────────────────────────────────────

export const CURL_FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

void main() {
  float L = texture(uVelocity, vUV - vec2(uTexelSize.x, 0.0)).y;
  float R = texture(uVelocity, vUV + vec2(uTexelSize.x, 0.0)).y;
  float T = texture(uVelocity, vUV + vec2(0.0, uTexelSize.y)).x;
  float B = texture(uVelocity, vUV - vec2(0.0, uTexelSize.y)).x;
  float vorticity = R - L - T + B;
  fragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
`;

export const VORTICITY_FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uCurlStrength;
uniform float uDt;
uniform vec2 uTexelSize;

void main() {
  float L = texture(uCurl, vUV - vec2(uTexelSize.x, 0.0)).x;
  float R = texture(uCurl, vUV + vec2(uTexelSize.x, 0.0)).x;
  float T = texture(uCurl, vUV + vec2(0.0, uTexelSize.y)).x;
  float B = texture(uCurl, vUV - vec2(0.0, uTexelSize.y)).x;
  float C = texture(uCurl, vUV).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= uCurlStrength * C;
  force.y *= -1.0;
  vec2 vel = texture(uVelocity, vUV).xy;
  fragColor = vec4(vel + force * uDt, 0.0, 1.0);
}
`;

// ─────────────────────────────────────────────
// Layer A: 3D torus raymarched background
// ─────────────────────────────────────────────

export const BACKGROUND_FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uFlowColor;
uniform sampler2D uFlowVelocity;
uniform vec2 uMouse;
uniform float uTime;
uniform vec2 uResolution;
uniform float uReducedMotion;
uniform float uTheme; // 0 = dark, 1 = light

// Torus SDF: t.x = major radius, t.y = tube radius
float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

// Rotation matrices
mat3 rotateX(float a) {
  float c = cos(a), s = sin(a);
  return mat3(1,0,0, 0,c,-s, 0,s,c);
}
mat3 rotateY(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c,0,s, 0,1,0, -s,0,c);
}
mat3 rotateZ(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c,-s,0, s,c,0, 0,0,1);
}

float map(vec3 p, mat3 rot) {
  vec3 q = rot * p;
  return sdTorus(q, vec2(1.0, 0.38));
}

vec3 calcNormal(vec3 p, mat3 rot) {
  const float h = 0.001;
  vec2 k = vec2(1, -1);
  return normalize(
    k.xyy * map(p + k.xyy * h, rot) +
    k.yyx * map(p + k.yyx * h, rot) +
    k.yxy * map(p + k.yxy * h, rot) +
    k.xxx * map(p + k.xxx * h, rot)
  );
}

void main() {
  float aspect = uResolution.x / uResolution.y;

  // UV centered, aspect-corrected; offset torus to the right
  vec2 uv = vUV - 0.5;
  uv.x *= aspect;
  uv.x -= 0.35; // shift camera left so torus appears on the right

  // Camera
  vec3 ro = vec3(0.0, 0.0, 3.8);
  vec3 rd = normalize(vec3(uv, -1.5));

  // Slow idle rotation
  float speed = mix(1.0, 0.0, uReducedMotion);
  mat3 rot = rotateX(0.55 + uTime * 0.12 * speed)
           * rotateY(uTime * 0.08 * speed)
           * rotateZ(0.15 + uTime * 0.05 * speed);

  // Raymarch
  float t = 0.0;
  float d;
  bool hit = false;
  for (int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    d = map(p, rot);
    if (d < 0.002) { hit = true; break; }
    if (t > 10.0) break;
    t += d;
  }

  float lum = 0.0;
  if (hit) {
    vec3 p = ro + rd * t;
    vec3 n = calcNormal(p, rot);

    // Lighting: front-left key light + soft fill + rim
    vec3 lightDir = normalize(vec3(-0.4, 0.6, 0.8));
    float diff = max(dot(n, lightDir), 0.0);
    float fill = max(dot(n, normalize(vec3(0.3, -0.2, 0.5))), 0.0) * 0.3;
    float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0) * 0.2;

    // Base luminance from shading (drives glyph index selection)
    lum = diff * 0.65 + fill + rim + 0.08;

    // Fluid influence: make characters denser where fluid is active
    vec3 flow = texture(uFlowColor, vUV).rgb;
    float flowMag = length(flow);
    lum += clamp(flowMag * 0.5, 0.0, 0.4);
    lum = clamp(lum, 0.05, 1.0);
  }

  // R = luminance for glyph index, G = torus hit mask (1 = on surface)
  fragColor = vec4(lum, hit ? 1.0 : 0.0, 0.0, 1.0);
}
`;

// ─────────────────────────────────────────────
// Layer B: Full-screen ASCII post-processing
// ─────────────────────────────────────────────

export const ASCII_FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 fragColor;

uniform float uCharLength;
uniform float uCharSize;
uniform sampler2D uGlyphAtlas;
uniform sampler2D uScene;
uniform sampler2D uFluidDensity;
uniform sampler2D uColorWheel;
uniform float uTime;
uniform vec2 uResolution;
uniform float uTheme; // 0 = dark, 1 = light

const vec2 ATLAS_GRID = vec2(16.0);

float grayscale(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

float valueRemap(float value, float minIn, float maxIn, float minOut, float maxOut) {
  return minOut + (value - minIn) * (maxOut - minOut) / (maxIn - minIn);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  // Calculate character grid
  vec2 gridSize = floor(uResolution / uCharSize);
  vec2 cellID = floor(vUV * gridSize);
  vec2 cellUV = fract(vUV * gridSize);
  vec2 cellCenter = (cellID + 0.5) / gridSize;

  // Sample scene: R = luminance, G = torus hit mask
  vec4 sceneData = texture(uScene, cellCenter);
  float gray = sceneData.r;
  float torusMask = sceneData.g;

  // Discard pixels outside the torus shape
  if (torusMask < 0.5) {
    fragColor = vec4(0.0);
    return;
  }

  // Sample fluid density at cell center
  vec3 density = texture(uFluidDensity, cellCenter).rgb;
  float fluidDensity = length(density);

  // Compute fluid activation — low threshold so color appears quickly
  float fluidActiveFactor = smoothstep(0.002, 0.04, fluidDensity);

  // Compute fluid color from density using HSV color wheel - time-cycling hue
  float hue = fract(fluidDensity * 0.15 + uTime * 0.08);
  float sat = mix(0.85, 1.0, fluidActiveFactor);
  float val = mix(0.9, 1.0, fluidActiveFactor);
  vec3 fluidColor = hsv2rgb(vec3(hue, sat, val));

  // Map grayscale to glyph index in 16x16 atlas
  float charIdx = floor(gray * (uCharLength - 0.01));
  float col = mod(charIdx, ATLAS_GRID.x);
  float row = floor(charIdx / ATLAS_GRID.x);

  // Sample glyph from atlas
  vec2 glyphOrigin = vec2(col, row) / ATLAS_GRID;
  vec2 glyphUV = glyphOrigin + cellUV / ATLAS_GRID;
  float glyph = texture(uGlyphAtlas, glyphUV).r;

  // Discard transparent pixels
  if (glyph < 0.1) {
    fragColor = vec4(0.0);
    return;
  }

  // Base character color depends on theme
  vec3 baseColor = mix(vec3(0.6), vec3(0.35, 0.38, 0.40), uTheme);

  // Mix with fluid color when active
  vec3 charColor = mix(baseColor, fluidColor, fluidActiveFactor);

  // Output with premultiplied alpha
  float alpha = glyph;
  fragColor = vec4(charColor * alpha, alpha);
}
`;

// ─────────────────────────────────────────────
// Composite / display shader
// ─────────────────────────────────────────────

export const COMPOSITE_FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uLayerA; // background scene (drives ASCII density)
uniform sampler2D uLayerB; // ASCII overlay (premultiplied alpha)
uniform float uTheme;

void main() {
  vec4 ascii = texture(uLayerB, vUV);

  // Page background color (the actual visible bg)
  vec3 pageBg = mix(vec3(0.04, 0.05, 0.06), vec3(0.976, 0.976, 0.976), uTheme);

  // Composite ASCII characters over page background
  vec3 color = ascii.rgb + pageBg * (1.0 - ascii.a);

  fragColor = vec4(color, 1.0);
}
`;
