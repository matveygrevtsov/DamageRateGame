import { HemisphericLight, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
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
    this.initGround();
    this.initLight();
  }

  private initGround() {
    const {
      scene,
      config: { sizeX, sizeZ },
    } = this;
    MeshBuilder.CreateGround("ground", { width: sizeX, height: sizeZ }, scene);
  }

  private initLight() {
    const { scene } = this;
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
  }
}
