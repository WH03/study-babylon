import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ImportMeshAsync,
  Animation,
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
      10,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 10; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    // camera.attachControl(canvas, true);
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateLight(); //创建光源

    this.CreateMesh(scene); //创建物体
    // this.ImportMeshes();
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
  CreateMesh(scene: Scene): void {
    const box = MeshBuilder.CreateBox("box", { size: 1 });

    // 动画1：左右移动
    const moveLeftAnimation = new Animation(
      "moveLeftAnimation",
      "position.x",
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    // 创建关键帧
    const animationKeys = [
      { frame: 0, value: 0 }, //初始位置
      { frame: 30, value: -3 }, //移动到左侧
      { frame: 60, value: 3 }, //回到初始位置
      { frame: 100, value: 0 }, //回到初始位置
    ];
    // 将关键帧添加到动画中
    moveLeftAnimation.setKeys(animationKeys);
    box.animations.push(moveLeftAnimation);
    // 开启动画
    scene.beginAnimation(box, 0, 100, true);

    // 动画2：混合动画
    const blendingAnimation = new Animation(
      "blendingAnimation",
      "position.y",
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    blendingAnimation.enableBlending = true; // 启用混合动画
    blendingAnimation.blendingSpeed = 0.1; // 设置混合速度

    blendingAnimation.setKeys(animationKeys); // 将关键帧添加到动画中
    scene.onPointerDown = (event, pick) => {
      //如果点击了box
      if (pick.pickedMesh) {
        // 停止之前的动画
        scene.stopAnimation(box);
        // 开始混合动画
        scene.beginDirectAnimation(box, [blendingAnimation], 0, 100, true);
      }
    };
  }
}
