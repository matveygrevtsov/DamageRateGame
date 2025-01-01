import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from "@babylonjs/core";

interface IProps {
  canvas: HTMLCanvasElement;
}

export class GameController {
  private readonly canvas: HTMLCanvasElement;
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly render: () => void;
  private readonly resize: () => void;

  constructor({ canvas }: IProps) {
    this.canvas = canvas;

    this.engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
    });

    this.scene = new Scene(this.engine);

    this.render = () => this.scene.render();

    this.resize = () => this.engine.resize();
  }

  public start() {
    window.addEventListener("resize", this.resize);
    this.fillScene();
    this.initCamera();
    this.initLight();
    this.engine.runRenderLoop(this.render);
  }

  public unmount() {
    window.removeEventListener("resize", this.resize);
    this.engine.stopRenderLoop(this.render);
    this.scene.dispose();
    this.engine.dispose();
  }

  private fillScene() {
    this.initGround();
  }

  private initGround() {
    MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, this.scene);
  }

  private initCamera() {
    const camera = new ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      Math.PI / 4,
      15,
      Vector3.Zero(),
      this.scene,
    );

    camera.attachControl(this.canvas, true);
  }

  private initLight() {
    const light = new HemisphericLight(
      "light",
      new Vector3(0, 1, 0),
      this.scene,
    );
    light.intensity = 0.7;
  }
}
