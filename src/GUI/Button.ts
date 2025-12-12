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
import { AdvancedDynamicTexture, StackPanel, Button } from "@babylonjs/gui/2D";

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
    this.CreateGUI(); //创建GUI

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
  }
  // 创建GUI
  CreateGUI() {
    // 创建高级动态纹理
    const advancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI(
      "advancedDynamicTexture"
    );

    // 创建面板
    const panel = new StackPanel();
    advancedDynamicTexture.addControl(panel);

    // 创建文本框
    const button = Button.CreateSimpleButton("button", "点击我");
    button.width = "200px";
    button.height = "40px";
    button.color = "white";
    button.background = "skyblue";
    button.hoverCursor = "text";
    panel.addControl(button); // 添加文本框到面板

    // 创建带背景图的按钮
    const imageButton = Button.CreateImageButton(
      "imageButton",
      "带背景图的按钮",
      "/grass.jpg"
    );
    imageButton.width = "200px";
    imageButton.height = "40px";
    imageButton.color = "white";
    imageButton.background = "green";
    imageButton.hoverCursor = "text";
    imageButton.paddingTop = "10px";
    panel.addControl(imageButton); // 添加文本框到面板

    // 背景图铺满按钮
    const imageBGButton = Button.CreateImageWithCenterTextButton(
      "imageBGButton",
      "背景图按钮",
      "/grass.jpg"
    );
    imageBGButton.width = "200px";
    imageBGButton.height = "40px";
    imageBGButton.color = "white";
    imageBGButton.paddingTop = "10px";
    // imageBGButton.textBlock!.text = "1111212";
    imageBGButton.fontSize = "24px";
    panel.addControl(imageBGButton); // 添加文本框到面板

    //只有背景图按钮
    const imageOnlyButton = Button.CreateImageOnlyButton(
      "imageOnlyButton",
      "/grass.jpg"
    );
    imageOnlyButton.width = "200px";
    imageOnlyButton.height = "40px";
    imageOnlyButton.paddingTop = "10px";
    panel.addControl(imageOnlyButton); // 添加文本框到面板
  }
}
