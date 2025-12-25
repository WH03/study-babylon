/* 
    VR设备方向相机
*/
import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  VRDeviceOrientationFreeCamera,
  VRDeviceOrientationArcRotateCamera,
  Mesh,
  VRDeviceOrientationGamepadCamera,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = this.CreateScene(canvas);

    const coordinate = new Coordinate(this.scene);
    coordinate.ShowAxis(20);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    // scene.useRightHandedSystem = true;
    // 创建VR 设备方向相机
    // const camera = new VRDeviceOrientationFreeCamera(
    //   "camera",
    //   new Vector3(0, 2, -8)
    // );
    // 创建VR 设备方向弧形旋转相机
    // const camera = new VRDeviceOrientationArcRotateCamera(
    //   "camera",
    //   -Math.PI / 2,
    //   Math.PI / 4,
    //   8,
    //   Vector3.Zero()
    // );
    const camera = new VRDeviceOrientationGamepadCamera(
      "camera",
      new Vector3(0, 2, -8)
    );

    camera.attachControl(canvas, true);

    this.CreateLight(); //创建光源

    this.CreateMesh();
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
  }
  //创建物体
  CreateMesh(): void {
    const box = MeshBuilder.CreateBox(
      "box",
      { size: 5, sideOrientation: Mesh.FRONTSIDE },
      this.scene
    );
  }
}
