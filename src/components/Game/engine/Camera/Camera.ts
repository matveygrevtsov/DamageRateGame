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
import { GROUND_HEIGHT, GROUND_WIDTH } from "../GameController/constants";

interface IProps {
  canvas: HTMLCanvasElement;
  scene: Scene;
}

export class Camera {
  private readonly scene: Scene;
  private readonly camera: ArcRotateCamera;
  private readonly target: Mesh;
  private readonly movementVector: Vector3;

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

    this.movementVector = Vector3.Zero();

    this.initLimits();
    this.initHandlers();
  }

  public unmount() {
    window.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  private initHandlers() {
    this.initRotationHandler();
    window.addEventListener("mousemove", this.mouseMoveHandler);
    // Данный обработчик срабатывает на каждый кадр.
    this.scene.onBeforeRenderObservable.add(this.sceneTickHandler);
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

  mouseMoveHandler = ({ x, y }: MouseEvent) => {
    this.movementVector.copyFrom(Vector3.Zero());

    const directionVectorX = -Math.cos(this.camera.alpha);
    const directionVectorZ = -Math.sin(this.camera.alpha);

    if (y <= WINDOW_PADDING_PX) {
      this.movementVector.addInPlace(
        new Vector3(directionVectorX, 0, directionVectorZ)
      );
    }

    if (y >= window.innerHeight - WINDOW_PADDING_PX) {
      this.movementVector.addInPlace(
        new Vector3(-directionVectorX, 0, -directionVectorZ)
      );
    }

    if (x <= WINDOW_PADDING_PX) {
      this.movementVector.addInPlace(
        new Vector3(-directionVectorZ, 0, directionVectorX)
      );
    }

    if (x >= window.innerWidth - WINDOW_PADDING_PX) {
      this.movementVector.addInPlace(
        new Vector3(directionVectorZ, 0, -directionVectorX)
      );
    }

    this.movementVector.normalize();
  };

  sceneTickHandler = () => {
    const { scene, target, movementVector } = this;
    if (!movementVector.length() || !scene.deltaTime) {
      return;
    }
    const speed = (scene.deltaTime / 1000) * 4;
    const groundHalfWidth = GROUND_WIDTH / 2;
    const groundHalfHeight = GROUND_HEIGHT / 2;
    target.position.addInPlace(movementVector.scale(speed));

    if (target.position.x > groundHalfWidth) {
      target.position.x = groundHalfWidth;
    }

    if (target.position.x < -groundHalfWidth) {
      target.position.x = -groundHalfWidth;
    }

    if (target.position.z > groundHalfHeight) {
      target.position.z = groundHalfHeight;
    }

    if (target.position.z < -groundHalfHeight) {
      target.position.z = -groundHalfHeight;
    }
  };
}
