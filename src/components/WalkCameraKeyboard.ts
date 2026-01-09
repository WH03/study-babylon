import {
  Vector3,
  type ICameraInput,
  type KeyboardInfo,
  type Nullable,
  type Observer,
  type UniversalCamera,
} from "@babylonjs/core";

// 自定义自由相机键盘旋转
export default class FreeCameraKeyboardRotateInput
  implements ICameraInput<UniversalCamera>
{
  camera!: UniversalCamera;

  rotateObsV: Nullable<Observer<KeyboardInfo>> = null;
  sensility!: number;

  constructor(sensility: number) {}

  getClassName(): string {
    return "FreeCameraKeyboardRotateInput";
  }
  getSimpleName(): string {
    return "keyboardRotate";
  }
  attachControl(noPreventDefault?: boolean): void {
    const scene = this.camera.getScene(); //获取场景
    const directional = Vector3.Zero();
    this.rotateObsV = scene.onKeyboardObservable.add((keyboardInfo) => {
      switch (keyboardInfo.event.key) {
        case "ArrowLeft":
          this.camera.rotation.y -= this.sensility;
          directional.copyFromFloats(0, 0, 0);
          break;
        case "ArrowRight":
          this.camera.rotation.y += this.sensility;
          directional.copyFromFloats(0, 0, 0);
          break;
        case "ArrowUp":
          directional.copyFromFloats(0, 0, this.camera.speed);
          break;
        case "ArrowDown":
          directional.copyFromFloats(0, 0, -this.camera.speed);
          break;
      }
      // 相机旋转矩阵
      this.camera
        .getViewMatrix()
        .invertToRef(this.camera._cameraTransformMatrix);
      // 旋转方向向量
      Vector3.TransformNormalToRef(
        directional,
        this.camera._cameraTransformMatrix,
        this.camera._transformedDirection
      );
    });
  }
  detachControl(): void {
    // throw new Error("Method not implemented.");
    if (this.rotateObsV) {
      this.camera.getScene().onKeyboardObservable.remove(this.rotateObsV);
    }
  }
  checkInputs?: (() => void) | undefined;
}
