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
import { AdvancedDynamicTexture, Grid, Rectangle } from "@babylonjs/gui/2D";

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
    this.CreateGrid(); //创建网格
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
  CreateGrid() {
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // 创建网格
    const grid = new Grid();
    grid.background = "black";
    grid.width = 0.8;
    advancedDynamicTexture.addControl(grid);

    grid.addColumnDefinition(100, true); // 宽度、是否像素比
    grid.addColumnDefinition(0.5);
    grid.addColumnDefinition(0.5);

    grid.addColumnDefinition(100, true);
    grid.addRowDefinition(0.5);
    grid.addRowDefinition(0.5);

    let rectangle = new Rectangle();
    rectangle.background = "red";
    rectangle.thickness = 1;
    grid.addControl(rectangle, 0, 1); // 添加矩形到网格

    rectangle = new Rectangle();
    rectangle.background = "green";
    rectangle.thickness = 1;
    grid.addControl(rectangle, 0, 2); // 添加矩形到网格, 第1列第2行

    rectangle = new Rectangle();
    rectangle.background = "blue";
    rectangle.thickness = 1;
    grid.addControl(rectangle, 1, 1); // 添加矩形到网格， 第1列第1行

    rectangle = new Rectangle();
    rectangle.background = "yellow";
    rectangle.thickness = 1;
    grid.addControl(rectangle, 1, 2); // 添加矩形到网格， 第1列第2行
  }
}
