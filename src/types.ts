export type TGetObjectValues<T extends object> = T[keyof T];

export interface IMapConfig {
  sizeX: number;
  sizeZ: number;
}
