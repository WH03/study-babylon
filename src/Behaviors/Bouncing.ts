/* 
    摄像机行为：
        进入场景，跳跃
        自动旋转
*/

import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  BouncingBehavior,
  MeshBuilder,
  AutoRotationBehavior,
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
    coordinate.ShowAxis(10);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    scene.useRightHandedSystem = true;
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 4,
      8,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 30; //相机最大距离

    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度

    // camera.useBouncingBehavior = true; //启用相机弹跳行为
    // camera.useAutoRotationBehavior = true; //启用相机自动旋转行为
    camera.addBehavior(this.AddBouncingBehavior()); //添加相机弹跳行为
    camera.addBehavior(this.AddAutoRotationBehavior()); //添加相机自动旋转行为

    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机
    this.CreateLight(); //创建光源
    this.CreateMesh(); //创建物体
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
  }
  CreateMesh(): void {
    const box = MeshBuilder.CreateBox("box", { size: 1 }, this.scene);
  }
  //   添加弹跳行为
  AddBouncingBehavior() {
    const bouncing = new BouncingBehavior();
    bouncing.lowerRadiusTransitionRange = 3; //相机距离物体小于0.5时，开始弹跳
    bouncing.upperRadiusTransitionRange = -10; //相机距离物体大于-5时，停止弹跳
    return bouncing;
  }
  AddAutoRotationBehavior() {
    const rotation = new AutoRotationBehavior();
    rotation.idleRotationSpeed = 0.1; //相机静止时的旋转速度
    rotation.idleRotationWaitTime = 500; //相机静止时的等待时间

    return rotation;
  }
}
