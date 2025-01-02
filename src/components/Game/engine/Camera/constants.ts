export const ALPHA_ROTATION_ANGLE = 1.5 * Math.PI;
export const BETA_ROTATION_ANGLE = Math.PI / 4; // Угол наклона ( = угол между плоскостью XZ и направлением камеры), допустимые значения от 0 до Math.PI / 2.
export const MIN_RADIUS = 5; // Минимальное расстояние от камеры до цели.
export const MAX_RADIUS = 15; // Максимальное расстояние от камеры до цели.
export const DEFAULT_RADIUS = MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) / 2;
export const SHOW_TARGET = true;
export const WINDOW_PADDING_PX = 100;
