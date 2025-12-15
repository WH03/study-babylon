import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ImportMeshAsync,
  StandardMaterial,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";
import {
  AdvancedDynamicTexture,
  ColorPicker,
  Control,
  Line,
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
    const skullMaterial = new StandardMaterial("skullMaterial");
    let models = await ImportMeshAsync("/Meshes/skull.babylon", this.scene);
    let skull = models.meshes[0];
    skull.scaling = new Vector3(0.1, 0.1, -0.1);
    skull.position = new Vector3(0, 0, 0);
    skull.material = skullMaterial;
    this.CreateColorPicker(skullMaterial);
  }
  // 创建GUI
  CreateColorPicker(skullMaterial: StandardMaterial) {
    // 创建UI
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // 创建堆叠面板
    const panel = new StackPanel();
    panel.width = "200px";
    panel.isVertical = true;
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    advancedDynamicTexture.addControl(panel);

    // 创建文本
    const textBlock = new TextBlock();
    textBlock.text = "Diffuse Picker";
    textBlock.height = "30px";
    textBlock.color = "white";
    panel.addControl(textBlock);

    // 创建颜色选择器
    const colorPicker = new ColorPicker();
    colorPicker.value = skullMaterial.diffuseColor;
    colorPicker.width = "150px";
    colorPicker.height = "150px";
    colorPicker.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    colorPicker.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    colorPicker.onValueChangedObservable.add((value) => {
      // 更新材质颜色
      skullMaterial.diffuseColor.copyFrom(value);
      // 更新文本内容
      textBlock.text = value.toHexString();
    });
    panel.addControl(colorPicker);
  }
}
