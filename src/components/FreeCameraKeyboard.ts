import type {
  FreeCamera,
  ICameraInput,
  KeyboardInfo,
  Nullable,
  Observer,
} from "@babylonjs/core";

// 自定义自由相机键盘旋转
export default class FreeCameraKeyboardRotateInput
  implements ICameraInput<FreeCamera>
{
  camera!: FreeCamera;

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
    // const scene = this.camera.getScene(); //获取场景
    // scene.onKeyboardObservable.add((keyboardInfo) => {
    //   switch (keyboardInfo.event.key) {
    //     case "ArrowLeft":
    //       this.camera.rotation.y += 0.01;
    //       break;
    //     case "ArrowRight":
    //       this.camera.rotation.y -= 0.01;
    //       break;
    //   }
    // });
    const scene = this.camera.getScene(); //获取场景
    this.rotateObsV = scene.onKeyboardObservable.add((keyboardInfo) => {
      switch (keyboardInfo.event.key) {
        case "ArrowLeft":
          this.camera.rotation.y += this.sensility;
          break;
        case "ArrowRight":
          this.camera.rotation.y -= this.sensility;
          break;
      }
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
