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
  Image,
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
    this.CreateSVGImage(); //创建精灵图片
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
  CreateSVGImage() {
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // 创建SVG图片
    const scale_f = 4.0;
    const svgImage = new Image("b1", "/GUI/bjs_demo1.svg#bjs_button_bg");
    svgImage.onSVGAttributesComputedObservable.add(() => {
      console.log("SVG加载完成");
      svgImage.width = String(svgImage.sourceWidth * 5.5) + "px";
      svgImage.height = String(svgImage.sourceHeight * 5.5) + "px";
    });
    svgImage.stretch = Image.STRETCH_UNIFORM;
    svgImage.color = "white";


    // 创建一个图片按钮
    const button1 = Button.CreateImageOnlyButton(
      "button1",
      "/GUI/bjs_demo1.svg#bjs_button_off"
    );
    button1.image?.onSVGAttributesComputedObservable.add(() => {
      button1.width = String(button1.image!.sourceWidth * scale_f) + "px";
      button1.height = String(button1.image!.sourceHeight * scale_f) + "px";
    });
    button1.image!.stretch = Image.STRETCH_UNIFORM;
    button1.color = "transparent";
    button1.delegatePickingToChildren = true; // 子元素可以响应点击事件
    button1.image!.detectPointerOnOpaqueOnly = true; // 只响应不透明的元素
    button1.onPointerClickObservable.add(() => {
      button1.isVisible = false;
      button2.isVisible = true;
    });

    // 创建一个图片按钮
    const button2 = Button.CreateImageOnlyButton(
      "button2",
      "/GUI/bjs_demo1.svg#bjs_button_on"
    );
    button2.image?.onSVGAttributesComputedObservable.add(() => {
      button2.width = String(button2.image!.sourceWidth * scale_f) + "px";
      button2.height = String(button2.image!.sourceHeight * scale_f) + "px";
    });
    button2.image!.stretch = Image.STRETCH_UNIFORM;
    button2.color = "transparent";
    button2.delegatePickingToChildren = true; // 子元素可以响应点击事件
    button2.image!.detectPointerOnOpaqueOnly = true; // 只响应不透明的元素
    button2.isVisible = false;
    button2.onPointerClickObservable.add(() => {
      button2.isVisible = false;
      button1.isVisible = true;
    });
    advancedDynamicTexture.addControl(svgImage);
    advancedDynamicTexture.addControl(button1);
    advancedDynamicTexture.addControl(button2);
  }
}
