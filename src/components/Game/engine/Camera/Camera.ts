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
      scene
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

    this.initRotationHandler();

    this.initLimits();
  }

  public unmount() {}

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
}
