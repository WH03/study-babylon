import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
} from "@babylonjs/core";

import Animations from "@/components/Animation";
import Coordinate from "@/components/Coordinate";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  private animations: Animations; // 新增属性存储动画实例
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = this.CreateScene(canvas);
    this.animations = new Animations(this.scene); // 初始化一次
    // 创建坐标轴
    const coordinate = new Coordinate(this.scene);
    coordinate.ShowAxis(15);
    this.CreateMesh(this.scene);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      30,
      Vector3.Zero()
    );
    camera.attachControl(canvas, true);
    this.CreateLight(); //创建光源
    return scene;
  }

  CreateLight() {
    const light = new HemisphericLight(
      "light",
      new Vector3(0, 1, 0),
      this.scene
    );
  }
  //创建物体
  CreateMesh(scene: Scene): void {
    const box = MeshBuilder.CreateBox("box", { size: 1 }, this.scene);

    // this.animations.move(
    //   box,
    //   new Vector3(0, 0, 0),
    //   new Vector3(10, 0, 0),
    //   2000
    // );

    // this.animations.scaling(
    //   box,
    //   new Vector3(1, 1, 1),
    //   new Vector3(10, 1, 1),
    //   2000
    // );

    this.animations.rotation(
      box,
      new Vector3(0, 0, 0),
      new Vector3(0, Math.PI, 0),
      2000
    );

    // this.animations?.move(
    //   box,
    //   new Vector3(0, 0, 0),
    //   new Vector3(2, 0, 0),
    //   2000
    // );

    // console.log("@@Animations", Animations.move());
    // 关键修改1：创建 Animations 类实例（传入场景）
    // 添加动画
    // const frameRate = 30; // 每秒帧数
    /* 
    xSlide: x轴移动动画
    position.x: 动画目标属性
    frameRate: 动画帧率
    Animation.ANIMATIONTYPE_FLOAT: 动画类型，这里使用浮点数类型
    Animation.ANIMATIONLOOPMODE_CYCLE: 动画循环模式，这里使用循环模式
    */
    // const xSlide = new Animation(
    //   "xSlide",
    //   "position.x",
    //   frameRate,
    //   Animation.ANIMATIONTYPE_FLOAT,
    //   Animation.ANIMATIONLOOPMODE_CYCLE
    // );
    // // 设置关键帧
    // const keyFrames = [
    //   {
    //     frame: 0,
    //     value: 2,
    //   },
    //   {
    //     frame: frameRate,
    //     value: -2,
    //   },
    //   {
    //     frame: 2 * frameRate,
    //     value: 2,
    //   },
    // ];

    // // 将关键帧添加到动画中
    // xSlide.setKeys(keyFrames);
    // // 将动画添加到物体中
    // box.animations.push(xSlide);
    // // 播放动画
    // scene?.beginAnimation(box, 0, frameRate * 2, true);
  }
}
