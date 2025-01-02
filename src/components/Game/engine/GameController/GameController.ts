import {
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { GROUND_HEIGHT, GROUND_WIDTH } from "./constants";
import { Camera } from "../Camera/Camera";

interface IProps {
  canvas: HTMLCanvasElement;
}

export class GameController {
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly camera: Camera;

  constructor({ canvas }: IProps) {
    this.engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
    });

    this.scene = new Scene(this.engine);

    this.camera = new Camera({ canvas, scene: this.scene });
  }

  public start() {
    window.addEventListener("resize", this.resize);
    this.fillScene();
    this.initLight();
    this.engine.runRenderLoop(this.render);
  }

  public unmount() {
    window.removeEventListener("resize", this.resize);
    this.engine.stopRenderLoop(this.render);
    this.scene.dispose();
    this.engine.dispose();
    this.camera.unmount();
  }

  private fillScene() {
    this.initGround();
  }

  private initGround() {
    MeshBuilder.CreateGround(
      "ground",
      { width: GROUND_WIDTH, height: GROUND_HEIGHT },
      this.scene,
    );
  }

  private initLight() {
    const light = new HemisphericLight(
      "light",
      new Vector3(0, 1, 0),
      this.scene,
    );
    light.intensity = 0.7;
  }

  render = () => this.scene.render();
  resize = () => this.engine.resize();
}
