import {
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
  StandardMaterial,
  Texture,
  Color3,
} from "@babylonjs/core";
import { IMapConfig } from "../../../../types";

interface IProps {
  config: IMapConfig;
  scene: Scene;
}

export class Map {
  private readonly config: IMapConfig;
  private readonly scene: Scene;

  constructor({ config, scene }: IProps) {
    this.config = config;
    this.scene = scene;
    this.createGround();
    this.createLight();
  }

  private createGround() {
    const {
      scene,
      config: { sizeX, sizeZ },
    } = this;
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: sizeX, height: sizeZ },
      scene,
    );
    const material = new StandardMaterial("groundMaterial", scene);

    const texture = new Texture(
      "https://playground.babylonjs.com/textures/grass.png",
      scene,
    );
    texture.uScale = sizeX / 3; // Количество повторений по оси U
    texture.vScale = sizeZ / 3; // Количество повторений по оси V

    material.diffuseTexture = texture;
    material.roughness = 1;
    material.diffuseColor = new Color3(1.5, 1.5, 1.5); // Увеличивает яркость текстуры
    ground.material = material;

    return ground;
  }

  private createLight() {
    const { scene } = this;
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light;
  }
}
