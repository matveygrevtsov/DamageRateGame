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
  PointerInfo,
} from "@babylonjs/core";
import {
  BETA_ROTATION_ANGLE,
  CAMERA_ROTATION_GRADATIONS,
  DEFAULT_RADIUS,
  MAX_RADIUS,
  MIN_RADIUS,
  SHOW_TARGET,
  CANVAS_PADDING_PX,
  ROTATION_ANIMATION_DURATION_MS,
  ALPHA_DELTA,
} from "./constants";
import { GROUND_HEIGHT, GROUND_WIDTH } from "../GameController/constants";

interface IProps {
  canvas: HTMLCanvasElement;
  scene: Scene;
}

export class Camera {
  private readonly camera: ArcRotateCamera;
  private readonly canvas: HTMLCanvasElement;
  private readonly scene: Scene;
  private readonly target: Mesh;
  private readonly movementVector: Vector3;
  private mouseX: number;
  private mouseY: number;
  private rotationGradationIndex: number;
  private rotationAnimationStartTimeMs?: number;

  constructor({ canvas, scene }: IProps) {
    this.canvas = canvas;
    this.scene = scene;
    this.rotationGradationIndex = 0;
    this.camera = this.createCamera();
    this.target = this.createTarget();
    this.movementVector = Vector3.Zero();
    this.mouseX = 0;
    this.mouseY = 0;
    this.initHandlers();
  }

  private createCamera() {
    const { scene, canvas, rotationGradationIndex } = this;
    const camera = new ArcRotateCamera(
      "Camera",
      CAMERA_ROTATION_GRADATIONS[rotationGradationIndex],
      BETA_ROTATION_ANGLE,
      DEFAULT_RADIUS,
      Vector3.Zero(),
      scene,
    );
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = MIN_RADIUS;
    camera.upperRadiusLimit = MAX_RADIUS;
    return camera;
  }

  private createTarget() {
    const { scene, camera } = this;
    const target = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    const redMaterial = new StandardMaterial("redMaterial", scene);
    redMaterial.diffuseColor = new Color3(1, 0, 0); // Красный цвет
    target.material = redMaterial;
    if (!SHOW_TARGET) {
      target.isVisible = false;
    }
    camera.setTarget(target);
    return target;
  }

  private initHandlers() {
    const { scene, sceneTickHandler, keyboardHandler, mouseMoveHandler } = this;
    scene.onBeforeRenderObservable.add(sceneTickHandler);
    scene.onKeyboardObservable.add(keyboardHandler);
    scene.onPointerObservable.add(mouseMoveHandler);
  }

  private refreshMovementVectorByMouseCoordinates() {
    const { mouseX, mouseY } = this;

    this.movementVector.copyFrom(Vector3.Zero());

    const directionVectorX = -Math.cos(this.camera.alpha);
    const directionVectorZ = -Math.sin(this.camera.alpha);

    if (mouseY <= CANVAS_PADDING_PX) {
      this.movementVector.addInPlace(
        new Vector3(directionVectorX, 0, directionVectorZ),
      );
    }

    if (mouseY >= this.canvas.height - CANVAS_PADDING_PX) {
      this.movementVector.addInPlace(
        new Vector3(-directionVectorX, 0, -directionVectorZ),
      );
    }

    if (mouseX <= CANVAS_PADDING_PX) {
      this.movementVector.addInPlace(
        new Vector3(-directionVectorZ, 0, directionVectorX),
      );
    }

    if (mouseX >= this.canvas.width - CANVAS_PADDING_PX) {
      this.movementVector.addInPlace(
        new Vector3(directionVectorZ, 0, -directionVectorX),
      );
    }

    this.movementVector.normalize();
  }

  private refreshTargetPositionByMovementVector() {
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
  }

  private refreshRotation() {
    const { camera, rotationGradationIndex, rotationAnimationStartTimeMs } =
      this;

    if (rotationAnimationStartTimeMs === undefined) {
      camera.alpha = CAMERA_ROTATION_GRADATIONS[rotationGradationIndex];
      camera.beta = BETA_ROTATION_ANGLE;
      return;
    }

    const animationProgressMs = Date.now() - rotationAnimationStartTimeMs;
    const nextRotationGradationIndex =
      (rotationGradationIndex + 1) % CAMERA_ROTATION_GRADATIONS.length;

    if (animationProgressMs >= ROTATION_ANIMATION_DURATION_MS) {
      this.rotationAnimationStartTimeMs = undefined;
      this.rotationGradationIndex = nextRotationGradationIndex;
      return;
    }

    camera.alpha =
      (ALPHA_DELTA / ROTATION_ANIMATION_DURATION_MS) * animationProgressMs +
      CAMERA_ROTATION_GRADATIONS[rotationGradationIndex];
  }

  sceneTickHandler = () => {
    this.refreshMovementVectorByMouseCoordinates();
    this.refreshTargetPositionByMovementVector();
    this.refreshRotation();
  };

  keyboardHandler = (keyboardInfo: KeyboardInfo) => {
    if (
      keyboardInfo.type === KeyboardEventTypes.KEYDOWN &&
      keyboardInfo.event.code === "KeyE" &&
      this.rotationAnimationStartTimeMs === undefined
    ) {
      this.rotationAnimationStartTimeMs = Date.now();
    }
  };

  mouseMoveHandler = (pointerInfo: PointerInfo) => {
    this.mouseX = pointerInfo.event.clientX;
    this.mouseY = pointerInfo.event.clientY;
  };
}
