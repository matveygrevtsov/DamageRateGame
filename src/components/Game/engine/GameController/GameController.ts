import { Engine, Scene } from "@babylonjs/core";
import { Camera } from "../Camera/Camera";
import { MAP_CONFIG } from "./constants";
import { Map } from "../Map/Map";

interface IProps {
  canvas: HTMLCanvasElement;
}

export class GameController {
  private readonly canvas: HTMLCanvasElement;
  private readonly engine: Engine;
  private readonly scene: Scene;

  constructor({ canvas }: IProps) {
    this.canvas = canvas;
    this.engine = this.createEngine();
    this.scene = new Scene(this.engine);
    this.createMap();
    this.createCamera();
  }

  public start() {
    window.addEventListener("resize", this.resize);
    this.engine.runRenderLoop(this.render);
  }

  public unmount() {
    window.removeEventListener("resize", this.resize);
    this.engine.stopRenderLoop(this.render);
    this.scene.dispose();
    this.engine.dispose();
  }

  private createEngine() {
    const { canvas } = this;
    const engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });
    return engine;
  }

  private createMap() {
    const { scene } = this;
    const map = new Map({
      config: MAP_CONFIG,
      scene,
    });
    return map;
  }

  private createCamera() {
    const { canvas, scene } = this;
    const camera = new Camera({
      canvas,
      scene,
      groundSizeX: MAP_CONFIG.sizeX,
      groundSizeZ: MAP_CONFIG.sizeZ,
    });
    return camera;
  }

  render = () => this.scene.render();
  resize = () => this.engine.resize();
}
