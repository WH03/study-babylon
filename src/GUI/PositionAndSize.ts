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
  Button,
  Control,
  Rectangle,
  StackPanel,
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
    this.CreateGUI();

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
    sphere.position.y = 1;
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
    const rect1 = this.CreateRectangle();
    advancedDynamicTexture.addControl(rect1);
    // rect1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  }
  CreateRectangle(): Rectangle {
    const rect = new Rectangle(); //创建一个矩形
    rect.width = 0.2; //设置宽度
    rect.height = "40px"; //设置高度
    rect.cornerRadius = 10; //圆角
    rect.color = "Orange"; //设置颜色
    rect.thickness = 4; //边框厚度
    rect.background = "green"; //背景颜色
    rect.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;//水平对齐方式
    rect.top = "50px";//距离顶部距离
    rect.left = "50px";//距离左侧距离
    return rect;
  }
}
