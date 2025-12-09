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
  Ellipse,
  Line,
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
    this.CreateGUI();//创建GUI

    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
  }
  // 创建GUI
  CreateGUI() {
    const sphere = MeshBuilder.CreateSphere("box", {
      diameter: 2,
      segments: 16,
    });
    // sphere.position.y = 1;
    sphere.position = new Vector3(1, 1, 0);
    const ground = MeshBuilder.CreateGround("ground", {
      width: 6,
      height: 6,
      subdivisions: 2,
    });
    // 创建一个全屏UI
    const advancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI(
      "advancedDynamicTexture"
    );

    // 创建一个矩形，左侧对齐
    const rect = this.CreateRectangle();
    advancedDynamicTexture.addControl(rect);
    rect.linkWithMesh(sphere); //将矩形与球体关联

    rect.linkOffsetY = -80; //设置矩形与球体的垂直偏移量

    // 创建一个目标点
    const target = this.CreateTarget();
    advancedDynamicTexture.addControl(target);
    target.linkWithMesh(sphere); //将目标点与球体关联

    // 创建线
    const line = this.CreateLine();
    advancedDynamicTexture.addControl(line);
    line.linkWithMesh(sphere); //将线与球体关联
    line.connectedControl = rect; //将线连接到目标点
  }
  CreateRectangle(): Rectangle {
    const rect = new Rectangle(); //创建一个矩形
    rect.width = 0.1; //设置宽度
    rect.height = "40px"; //设置高度
    rect.cornerRadius = 10; //圆角
    rect.color = "Orange"; //设置颜色
    rect.thickness = 4; //边框厚度
    rect.background = "green"; //背景颜色
    rect.hoverCursor = "pointer"; //鼠标悬停时的光标

    const label = new TextBlock();
    label.text = "一个球";
    rect.addControl(label); //将文本块添加到矩形中

    return rect;
  }

  // 创建一个连接点
  CreateTarget() {
    const target = new Ellipse(); //创建一个椭圆
    target.width = "20px";
    target.height = "20px";
    target.color = "Orange"; //设置颜色
    target.thickness = 4; //边框厚度
    target.background = "green"; //背景颜色

    return target;
  }
  // 创建一个连接线
  CreateLine() {
    const line = new Line();
    line.lineWidth = 2;
    line.color = "Orange";
    // line.y1 = 0;//设置连接线的垂直偏移量
    line.y2 = 20; //设置连接线的垂直偏移量
    line.linkOffsetY = -10; //设置连接点的垂直偏移量

    return line;
  }
}
