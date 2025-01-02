const DEFAULT_ROTATION_ANGLE = 1.5 * Math.PI;
export const CAMERA_ROTATION_GRADATIONS = (() => {
  const NUMBER_OF_CAMERA_ROTATION_GRADATIONS = 4; // Целое число, не меньшее двух.
  const ROTATION_DELTA = (2 * Math.PI) / NUMBER_OF_CAMERA_ROTATION_GRADATIONS;
  const CAMERA_ROTATION_GRADATIONS: number[] = [];
  for (let i = 0; i < NUMBER_OF_CAMERA_ROTATION_GRADATIONS; i++) {
    CAMERA_ROTATION_GRADATIONS.push(
      DEFAULT_ROTATION_ANGLE + i * ROTATION_DELTA,
    );
  }
  return CAMERA_ROTATION_GRADATIONS;
})();
export const BETA_ROTATION_ANGLE = Math.PI / 4; // Угол наклона ( = угол между плоскостью XZ и направлением камеры), допустимые значения от 0 до Math.PI / 2.
export const MIN_RADIUS = 5; // Минимальное расстояние от камеры до цели.
export const MAX_RADIUS = 15; // Максимальное расстояние от камеры до цели.
export const DEFAULT_RADIUS = MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) / 2;
export const SHOW_TARGET = true;
export const WINDOW_PADDING_PX = 100;
