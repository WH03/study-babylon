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
  InputText,
  StackPanel,
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
    const inputText = new InputText("inputText");
    inputText.width = "200px";
    inputText.height = "40px";
    inputText.maxWidth = "200px";
    inputText.text = "文本输入框";
    inputText.color = "white";
    inputText.background = "skyblue";
    inputText.focusedBackground = "green";
    inputText.hoverCursor = "text";
    panel.addControl(inputText); // 添加文本框到面板

    // 第二个输入框
    const inputText2 = new InputText("inputText2");
    inputText2.width = "200px";
    inputText2.height = "40px";
    inputText2.maxWidth = "200px";
    inputText2.text = "文本输入框2";
    inputText2.color = "black";
    inputText2.background = "green";
    inputText2.focusedBackground = "aqua";
    inputText2.hoverCursor = "text";
    inputText2.paddingTop = "10px";
    inputText2.onBeforeKeyAddObservable.add((text) => {
      const key = text.currentKey;
      // 限制只能输入数字
      if (key < "0" || key > "9") {
        inputText2.addKey = false;
      } else {
        inputText2.addKey = true;
      }
    });
    panel.addControl(inputText2); // 添加文本框到面板
  }
}
