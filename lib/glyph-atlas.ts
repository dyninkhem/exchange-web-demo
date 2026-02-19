/**
 * Generates a 16×16 grid glyph atlas texture on a 1024×1024 canvas.
 * Each glyph occupies a 64×64 cell, matching getgram.ai's atlas layout.
 */

const DEFAULT_GLYPHS = " .-:;=+*#%@VMWA&$";

const ATLAS_SIZE = 1024;
const GRID = 16;
const CELL_SIZE = ATLAS_SIZE / GRID; // 64

export function createGlyphAtlas(
  gl: WebGL2RenderingContext,
  glyphs: string = DEFAULT_GLYPHS
): { texture: WebGLTexture; count: number } {
  const count = glyphs.length;
  const canvas = document.createElement("canvas");
  canvas.width = ATLAS_SIZE;
  canvas.height = ATLAS_SIZE;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);

  ctx.fillStyle = "#fff";
  ctx.font = `${CELL_SIZE * 0.75}px "Courier New", Courier, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < count; i++) {
    const col = i % GRID;
    const row = Math.floor(i / GRID);
    ctx.fillText(glyphs[i], col * CELL_SIZE + CELL_SIZE / 2, row * CELL_SIZE + CELL_SIZE / 2);
  }

  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

  return { texture, count };
}
