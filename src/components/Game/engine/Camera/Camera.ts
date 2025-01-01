import {
  ArcRotateCamera,
  Mesh,
  Scene,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color3,
} from "@babylonjs/core";
import {
  ALPHA_ROTATION_ANGLE,
  BETA_ROTATION_ANGLE,
  DEFAULT_RADIUS,
  MAX_RADIUS,
  MIN_RADIUS,
  SHOW_TARGET,
  WINDOW_PADDING_PX,
} from "./constants";

interface IProps {
  canvas: HTMLCanvasElement;
  scene: Scene;
}

export class Camera {
  private readonly scene: Scene;
  private readonly camera: ArcRotateCamera;
  private readonly target: Mesh;

  constructor({ canvas, scene }: IProps) {
    this.scene = scene;

    this.camera = new ArcRotateCamera(
      "Camera",
      ALPHA_ROTATION_ANGLE,
      BETA_ROTATION_ANGLE,
      DEFAULT_RADIUS,
      Vector3.Zero(),
      scene,
    );
    this.camera.attachControl(canvas, true);

    this.target = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    const redMaterial = new StandardMaterial("redMaterial", scene);
    redMaterial.diffuseColor = new Color3(1, 0, 0); // Красный цвет
    this.target.material = redMaterial;
    if (!SHOW_TARGET) {
      this.target.isVisible = false;
    }
    this.camera.setTarget(this.target);

    this.initLimits();
    this.initHandlers();
  }

  public unmount() {
    window.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  private initHandlers() {
    this.initRotationHandler();
    window.addEventListener("mousemove", this.mouseMoveHandler);
  }

  private initRotationHandler() {
    const { scene, camera } = this;

    scene.registerBeforeRender(function () {
      camera.alpha = ALPHA_ROTATION_ANGLE;
      camera.beta = BETA_ROTATION_ANGLE;
    });
  }

  private initLimits() {
    this.camera.lowerRadiusLimit = MIN_RADIUS;
    this.camera.upperRadiusLimit = MAX_RADIUS;
  }

  mouseMoveHandler = (mouseEvent: MouseEvent) => {
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    const x = mouseEvent.x - halfWidth;
    const y = halfHeight - mouseEvent.y;

    if (y >= halfHeight - WINDOW_PADDING_PX) {
      if (x < WINDOW_PADDING_PX - halfWidth) {
        console.log("северо-запад");
        return;
      }

      if (Math.abs(x) < halfWidth - WINDOW_PADDING_PX) {
        console.log("север");
        return;
      }

      if (x > halfWidth - WINDOW_PADDING_PX) {
        console.log("северо-восток");
        return;
      }

      return;
    }

    if (Math.abs(y) < halfHeight - WINDOW_PADDING_PX) {
      if (x < WINDOW_PADDING_PX - halfWidth) {
        console.log("запад");
        return;
      }

      if (x > halfWidth - WINDOW_PADDING_PX) {
        console.log("восток");
        return;
      }

      return;
    }

    if (y <= WINDOW_PADDING_PX - halfHeight) {
      if (x < WINDOW_PADDING_PX - halfWidth) {
        console.log("юго-запад");
        return;
      }

      if (Math.abs(x) < halfWidth - WINDOW_PADDING_PX) {
        console.log("юг");
        return;
      }

      if (x > halfWidth - WINDOW_PADDING_PX) {
        console.log("юго-восток");
        return;
      }

      return;
    }
  };
}
