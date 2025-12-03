import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  DirectionalLight,
  Animation,
} from "@babylonjs/core";

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
    scene.useRightHandedSystem = true; //设置右手坐标系
    const camera = new ArcRotateCamera(
      "camera", //名称
      Math.PI / 4, //弧度
      Math.PI / 4, //弧度
      10, //距离
      Vector3.Zero() //位置
    );
    camera.attachControl(canvas, true);
    this.CreateLigtht(); //创建光源

    this.CreateMesh(scene);
    return scene;
  }

  CreateLigtht() {
    const directionalLight = new DirectionalLight(
      "directionalLight",
      new Vector3(0, -1, 1)
    );
    directionalLight.intensity = 0.75;
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0)
    );
    hemisphericLight.intensity = 0.5;
  }
  //创建物体
  CreateMesh(scene: Scene): void {
    const box = MeshBuilder.CreateBox("box", { size: 1 }, this.scene);
    box.position = new Vector3(2, 0, 0); //设置位置

    // 移动动画
    const frameRate = 30;
    const moveAnimation = new Animation(
      "moveAnimation",
      "position.x",
      frameRate,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    let animationKeys = [
      { frame: 0, value: 2 },
      {
        frame: frameRate,
        value: -2,
      },
      {
        frame: frameRate * 2,
        value: 2,
      },
    ];

    // 旋转动画
    const rotationAnimation = new Animation(
      "rotationAnimation",
      "rotation.y",
      frameRate,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    animationKeys = [
      { frame: 0, value: 0 },
      { frame: frameRate, value: Math.PI },
      { frame: 2 * frameRate, value: 2 * Math.PI },
    ];
    rotationAnimation.setKeys(animationKeys);
    box.animations.push(rotationAnimation);

    moveAnimation.setKeys(animationKeys);
    box.animations.push(moveAnimation);

    // 顺序操作
    const nextAnimation = () => {
      scene.beginDirectAnimation(
        box,
        [moveAnimation, rotationAnimation],
        0,
        2 * frameRate,
        true
      );
    };
    scene.beginDirectAnimation(
      box,
      [rotationAnimation],
      0,
      frameRate * 2,
      false,
      1,
      nextAnimation
    ).onAnimationEnd = nextAnimation;
  }
}
