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
  Grid,
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
    this.CreateMeshes(); //创建物体
    this.CreateStyle(); //创建网格
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
  CreateStyle() {
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const style = advancedDynamicTexture.createStyle();
    style.fontSize = "24px";
    style.fontStyle = "bold";

    // 创建堆叠面板
    const stackPanel = new StackPanel();
    advancedDynamicTexture.addControl(stackPanel); // 添加到UI

    // 创建文本
    const textBlock = new TextBlock();
    textBlock.width = "200px";
    textBlock.height = "50px";
    textBlock.text = "Hello World! (no style) ";
    textBlock.color = "skyblue";
    textBlock.fontSize = "24px";
    textBlock.fontStyle = "blod";
    stackPanel.addControl(textBlock); // 添加到堆叠面板

    // 创建文本
    const textBlock2 = new TextBlock();
    textBlock2.width = 1;
    textBlock2.height = "50px";
    textBlock2.text = "Hello World! (with style) ";
    textBlock2.color = "skyblue";
    textBlock2.style = style;
    stackPanel.addControl(textBlock2); // 添加到堆叠面板

    // 创建文本
    const textBlock3 = new TextBlock();
    textBlock3.width = 1;
    textBlock3.height = "50px";
    textBlock3.text = "测试啊(with style) ";
    textBlock3.color = "skyblue";
    textBlock3.style = style;
    stackPanel.addControl(textBlock3); // 添加到堆叠面板

    // 创建按钮
    const button = Button.CreateSimpleButton("button", "Click me");
    button.width = "200px";
    button.height = "50px";
    button.background = "green";
    button.cornerRadius = 10;
    button.onPointerClickObservable.add(() => {
      style.fontSize = 32;
      style.fontFamily = "Arial";
      style.fontStyle = "italic";
    });
    stackPanel.addControl(button); // 添加到堆叠面板
  }
}
