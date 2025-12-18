import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  Vector2,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as GUI from "@babylonjs/gui";

import Coordinate from "@/components/Coordinate";
import { Image } from "@babylonjs/gui/2D";
import { GUI3DManager, HolographicSlate } from "@babylonjs/gui/3D";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = this.CreateScene(canvas);

    // const coordinate = new Coordinate(this.scene);
    // coordinate.ShowAxis(10);

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
      300,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 300; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机
    this.CreateHolographicSlate();
    this.CreateLight(); //创建光源
    this.CreateMeshes(); //创建物体
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
  CreateHolographicSlate() {
    // 创建 3d gui
    const manager = new GUI3DManager(this.scene);

    // 创建全息板
    const holographicSlate = new HolographicSlate("holographicSlate");
    holographicSlate.dimensions = new Vector2(10, 8);
    // 修复2：最小尺寸略小于实际尺寸（避免缩放时过小）
    holographicSlate.minDimensions = new Vector2(5, 4);
    holographicSlate.titleBarHeight = 0.5;
    holographicSlate.title = "这是标题";
    holographicSlate.scaling = new Vector3(0.8, 0.8, 0.8);
    const slateImage = new Image("slateImg", "/Materials/MonaLisa.jpeg");
    slateImage.stretch = Image.STRETCH_UNIFORM; // 等比拉伸填充控件
    holographicSlate.content = slateImage; // 设置内容
    holographicSlate.position = new Vector3(0, 0, 0);
    manager.addControl(holographicSlate);
  }
}
