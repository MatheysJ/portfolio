/**
 * Matriz de rotação 3x3 (linha a linha), no sistema de coordenadas do CSS:
 * x → direita, y → baixo, z → em direção ao usuário.
 */
export type Matrix = readonly number[];
export type Vector = readonly [number, number, number];
/** [x, y, z, w] */
export type Quaternion = readonly [number, number, number, number];
