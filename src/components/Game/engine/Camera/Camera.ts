import {
  ArcRotateCamera,
  Mesh,
  Scene,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color3,
  KeyboardInfo,
  KeyboardEventTypes,
} from "@babylonjs/core";
import {
  BETA_ROTATION_ANGLE,
  CAMERA_ROTATION_GRADATIONS,
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
  private rotationGradationIndex: number;

  constructor({ canvas, scene }: IProps) {
    this.scene = scene;

    this.rotationGradationIndex = 0;

    this.camera = new ArcRotateCamera(
      "Camera",
      CAMERA_ROTATION_GRADATIONS[this.rotationGradationIndex],
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

    this.movementVector = Vector3.Zero();

    this.initLimits();
    this.initHandlers();
  }

  public unmount() {
    window.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  private initHandlers() {
    window.addEventListener("mousemove", this.mouseMoveHandler);
    // Данный обработчик срабатывает на каждый кадр.
    this.scene.onBeforeRenderObservable.add(this.sceneTickHandler);

    // Данный обработчик срабатывает при нажатии на любую клавишу клавиатуры.
    this.scene.onKeyboardObservable.add(this.keyboardHandler);

    this.scene.registerBeforeRender(this.rotationHandler);
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
        new Vector3(directionVectorX, 0, directionVectorZ),
      );
    }

    if (y >= window.innerHeight - WINDOW_PADDING_PX) {
      this.movementVector.addInPlace(
        new Vector3(-directionVectorX, 0, -directionVectorZ),
      );
    }

    if (x <= WINDOW_PADDING_PX) {
      this.movementVector.addInPlace(
        new Vector3(-directionVectorZ, 0, directionVectorX),
      );
    }

    if (x >= window.innerWidth - WINDOW_PADDING_PX) {
      this.movementVector.addInPlace(
        new Vector3(directionVectorZ, 0, -directionVectorX),
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

  keyboardHandler = (keyboardInfo: KeyboardInfo) => {
    if (
      keyboardInfo.type === KeyboardEventTypes.KEYDOWN &&
      keyboardInfo.event.code === "KeyE"
    ) {
      this.rotationGradationIndex =
        (this.rotationGradationIndex + 1) % CAMERA_ROTATION_GRADATIONS.length;
    }
  };

  rotationHandler = () => {
    const { camera, rotationGradationIndex } = this;
    camera.alpha = CAMERA_ROTATION_GRADATIONS[rotationGradationIndex];
    camera.beta = BETA_ROTATION_ANGLE;
  };
}
