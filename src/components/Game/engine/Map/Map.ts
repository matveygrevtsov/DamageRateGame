import {
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
  StandardMaterial,
  Texture,
  Color3,
  DynamicTexture,
} from "@babylonjs/core";
import { IMapConfig } from "../../../../types";
import { CELL_RESOLUTION_PX } from "./constants";

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
    this.createLight();
    this.createGround();
  }

  private createLight() {
    const { scene } = this;
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light;
  }

  private createGround() {
    const {
      scene,
      config: { sizeX, sizeZ },
    } = this;
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: sizeX, height: sizeZ },
      scene
    );
    ground.material = this.createGroundMaterial();
    return ground;
  }

  private createGroundMaterial() {
    const {
      scene,
      config: { sizeX, sizeZ },
    } = this;
    const material = new StandardMaterial("material", scene);
    const dynamicTexture = new DynamicTexture(
      "dynamicTexture",
      {
        width: 9 * CELL_RESOLUTION_PX,
        height: 18 * CELL_RESOLUTION_PX,
      },
      scene
    );
    const canvasRenderingContext = dynamicTexture.getContext();

    // Загружаем первую текстуру
    const img = new Image();
    img.src = "assets/grass.png";
    img.onload = function () {
      try {
        for (let x = 0; x < sizeX; x++) {
          for (let z = 0; z < sizeZ; z++) {
            canvasRenderingContext.drawImage(
              this,
              CELL_RESOLUTION_PX * x,
              CELL_RESOLUTION_PX * z,
              CELL_RESOLUTION_PX,
              CELL_RESOLUTION_PX
            );
          }
        }

        dynamicTexture.update();
      } catch (error) {}
    };

    material.diffuseTexture = dynamicTexture;
    material.diffuseColor = new Color3(1.5, 1.5, 1.5); // Увеличиваем яркость

    return material;
  }
}
