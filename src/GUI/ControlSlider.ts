import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  AbstractMesh,
  Tools,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";
import {
  AdvancedDynamicTexture,
  StackPanel,
  Button,
  TextBlock,
  Control,
  Slider,
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
    // this.CreateGUI(); //创建GUI

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
    const box = MeshBuilder.CreateBox("box", { size: 1 });
    box.position = new Vector3(0, 1, 0);
    this.CreateGUI(box);
  }
  // 创建GUI
  CreateGUI(box: AbstractMesh) {
    // 创建高级动态纹理
    const advancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI(
      "advancedDynamicTexture"
    );
    // 创建面板
    const panel = new StackPanel();
    advancedDynamicTexture.addControl(panel);

    // 创建文本
    const textBlock = new TextBlock();
    textBlock.text = `Y-rotate: ${0} deg`;
    textBlock.height = "30px";
    textBlock.color = "white";
    textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.addControl(textBlock);

    // 创建滑块
    const slider = new Slider();
    slider.width = "200px";
    slider.height = "20px";
    slider.color = "gray";
    // slider.background = "gray"; //设置滑块的背景颜色
    // slider.thumbColor = "white"; //设置滑块的颜色

    slider.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT; //水平对齐方式
    slider.minimum = 0;
    slider.maximum = Math.PI * 2;
    slider.value = 0; //设置初始值
    slider.onValueChangedObservable.add((value) => {
      textBlock.text = `Y-rotate: ${Math.round(
        Tools.ToDegrees(value) || 0
      )} deg`;
      if (box) {
        box.rotation.y = Number(value.toFixed(2));
      }
    });
    panel.addControl(slider);
  }
}
