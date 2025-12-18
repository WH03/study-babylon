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
import { TextBlock } from "@babylonjs/gui/2D";
import { Button3D, GUI3DManager, StackPanel3D } from "@babylonjs/gui";

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
      Math.PI / 2.5,
      10,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 30; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateLight(); //创建光源
    this.CreateMeshes(); //创建物体
    this.CreateStereoPanel(); //创建立体面板
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
  CreateStereoPanel() {
    // 3D GUI
    const manager = new GUI3DManager();
    const panel3d = new StackPanel3D();
    panel3d.margin = 0.5;
    panel3d.position.z = 3;

    manager.addControl(panel3d);
    this.AddButton(panel3d);
    this.AddButton(panel3d);
    this.AddButton(panel3d);
  }

  AddButton(panel3d: StackPanel3D) {
    const button = new Button3D("button");
    panel3d.addControl(button);
    button.onPointerClickObservable.add(() => {
      panel3d.isVertical = !panel3d.isVertical;
    });

    const textBlock = new TextBlock();
    textBlock.text = "按钮";
    textBlock.color = "white";
    textBlock.fontSize = "40px";
    button.content = textBlock;
  }
}
