import { raylib } from "./raylib-bindings.ts";

// ----------------------------------------------------------------------------
// Basic geometric 3D shapes drawing functions
// ----------------------------------------------------------------------------

/**
 * Draw a grid (centered at (0, 0, 0)).
 */
export function drawGrid(slices: number, spacing: number): void {
  raylib.symbols.DrawGrid(slices, spacing);
}
