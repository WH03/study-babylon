import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ImportMeshAsync,
  Mesh,
  AbstractMesh,
  Color3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";
import {
  AdvancedDynamicTexture,
  Checkbox,
  Control,
  InputText,
  RadioButton,
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
    ground.rotation = new Vector3(0, 0, Math.PI);
    this.CreateGUI(ground);
  }
  // 创建GUI
  async CreateGUI(box: Mesh) {
    const colors = new Map([
      ["Red", Color3.Red()],
      ["Green", Color3.Green()],
      ["Blue", Color3.Blue()],
      ["Yellow", Color3.Yellow()],
      ["Magenta", Color3.Magenta()],
    ]);
    // 创建高级动态纹理
    const advancedDynamicTexture = AdvancedDynamicTexture.CreateForMesh(
      box,
      256,
      256,
      false
    );
    // 创建面板
    const panel = new StackPanel();
    advancedDynamicTexture.addControl(panel);

    //创建文本
    const textBlock = new TextBlock();
    textBlock.height = "50px";
    textBlock.text = "请选择一个选项";
    textBlock.color = "white";
    panel.addControl(textBlock);

    // 创建单选按钮6
    colors.forEach((item, index) => {
      console.log("@item", item);
      console.log("@index", index);
      this.CreateRadioButton(textBlock, index, panel);
    });
  }

  CreateRadioButton(textBlock: TextBlock, color: string, parent: StackPanel) {
    const radioButton = new RadioButton(); //创建单选按钮
    radioButton.width = "20px";
    radioButton.height = "20px";
    radioButton.color = "white";
    radioButton.onIsCheckedChangedObservable.add((state) => {
      if (state) {
        textBlock.text = `你选择了${color}`;
        textBlock.color = color;
      }
    });
    // 创建标题
    const header = Control.AddHeader(radioButton, color, "100px", {
      isHorizontal: true, //水平布局
      controlFirst: true, //控制在前
    });
    header.height = "30px";
    header.color = "white";
    parent.addControl(header);
  }
}
