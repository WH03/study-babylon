/* 
    FollowCamera: 跟随相机

*/
import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  FollowCamera,
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
    coordinate.ShowAxis(5);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    scene.useRightHandedSystem = true;
    /* 
    FollowCamera: 跟随相机
      name: 相机名称
      position: 相机位置
      scene: 场景
    */
    const followCamera = new FollowCamera(
      "followCamera",
      new Vector3(10, 10, -10),
      scene
    );
    followCamera.attachControl(true);

    followCamera.radius = 10; //距离
    followCamera.heightOffset = 10; //高度
    followCamera.rotationOffset = 60; //旋转角度
    followCamera.cameraAcceleration = 0.005; //加速度
    followCamera.maxCameraSpeed = 10; //最大速度

    this.CreateLight(); //创建光源

    this.CreateMesh(followCamera, scene);
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
  CreateMesh(camera: FollowCamera, scene: Scene): void {
    const box = MeshBuilder.CreateBox("box", { size: 2 }, this.scene);
    camera.lockedTarget = box;

    // 设置动画
    setTimeout(() => {
      scene.registerBeforeRender(() => {
        if (box.position.z > -6) {
          box.position.z -= 0.01;
        }
      });
    }, 5000);
  }
}
