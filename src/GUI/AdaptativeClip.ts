import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";
import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
} from "@babylonjs/gui/2D";

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
      30,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 30; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateLight(); //创建光源
    this.CreateMeshes(); //创建物体
    this.AdaptativeClip(); //创建键盘
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
  }
  // 创建物体
  CreateMeshes() {
    const box = MeshBuilder.CreateBox("box", { size: 2 });
    const ground = MeshBuilder.CreateGround("ground", {
      width: 6,
      height: 6,
      subdivisions: 2,
    });
    ground.position = new Vector3(0, -3, 0);
  }
  // 创建GUI
  AdaptativeClip() {
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // 创建矩形
    const rectangle = new Rectangle();
    rectangle.width = "200px";
    rectangle.height = "50px";
    rectangle.color = "orange";
    rectangle.background = "skyblue";
    rectangle.cornerRadius = 10;
    rectangle.thickness = 6;
    // rectangle.adaptWidthToChildren = true; //自适应宽度：和子控件宽度一致
    rectangle.isPointerBlocker = true; // 阻止点击穿透
    rectangle.clipChildren = false; // 子控件超出范围时裁剪
    advancedDynamicTexture.addControl(rectangle);

    // 创建文本
    const textBlock = new TextBlock();
    textBlock.text = "Hello World";
    textBlock.color = "white";
    textBlock.width = "50px";
    textBlock.fontSize = 24;
    textBlock.left = "-60px";
    rectangle.addControl(textBlock);
  }
}
