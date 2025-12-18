import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";
import { AdvancedDynamicTexture, Line, TextBlock } from "@babylonjs/gui/2D";
import { GUI3DManager, HolographicButton, TouchHolographicButton } from "@babylonjs/gui/3D";

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
    this.CreateHolographicButton(box);
  }
  // 创建GUI
  CreateHolographicButton(box: Mesh) {
    // 创建 3d gui
    const manager = new GUI3DManager();

    // 创建全息按钮
    // const holographicButton = new HolographicButton("holographicButton");
    const holographicButton = new TouchHolographicButton("holographicButton");
    manager.addControl(holographicButton);

    holographicButton.position = new Vector3(0, 0, 3);
    holographicButton.imageUrl = "/GUI/down.png";

    const textBlock = new TextBlock();
    textBlock.color = "red";
    textBlock.fontSize = 36;
    textBlock.text = "全息按钮";

    holographicButton.content = textBlock; //覆盖按钮内容
    holographicButton.onPointerClickObservable.add(() => {
      box.rotation.x += 0.1;
    });
  }
}
