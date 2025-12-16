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
  Control,
  Image,
  Rectangle,
  ScrollViewer,
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
    this.CreateScrollView(); //创建滚动视图
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
  async CreateMeshes() {
    const box = MeshBuilder.CreateBox("box", { size: 2 });
    const ground = MeshBuilder.CreateGround("ground", {
      width: 6,
      height: 6,
      subdivisions: 2,
    });
    ground.position = new Vector3(0, -3, 0);
  }
  // 创建GUI
  async CreateScrollView() {
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // 创建滚动视图
    const scrollViewer = new ScrollViewer();
    scrollViewer.width = 0.5;
    scrollViewer.height = 0.5;
    scrollViewer.background = "#ccc";
    advancedDynamicTexture.addControl(scrollViewer);

    // 创建内容区域
    const rectangle = new Rectangle();
    rectangle.width = 2;
    rectangle.height = 2;
    rectangle.thickness = 5;
    rectangle.color = "red";
    rectangle.background = "yellow";
    rectangle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    rectangle.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    scrollViewer.addControl(rectangle);

    // scrollViewer.horizontalBar.value = 0.5; //水平滑块位置
    // scrollViewer.verticalBar.value = 0.5; //垂直滑块位置

    // 添加一个图片
    const image = new Image("image", "/textures/Logo.png");
    image.width = 0.4;
    image.height = 0.4;
    rectangle.addControl(image);
  }
}
