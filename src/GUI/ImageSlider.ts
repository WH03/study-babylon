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
  TextBlock,
  Control,
  Slider,
  Grid,
  ImageBasedSlider,
} from "@babylonjs/gui/2D";
import * as GUI from "@babylonjs/gui";

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
    const grid = new Grid();
    grid.addColumnDefinition(0.25); // 添加列定义
    grid.addColumnDefinition(0.25);
    grid.addColumnDefinition(0.25);
    grid.addColumnDefinition(0.25);

    grid.addRowDefinition(0.25); // 添加行定义
    grid.addRowDefinition(0.25);
    grid.addRowDefinition(0.25);
    grid.addRowDefinition(0.25);
    advancedDynamicTexture.addControl(grid);

    this.CreateSlider(grid, false, true, true, 0, 0);
    this.CreateSlider(grid, true, true, true, 1, 0);

    this.CreateSlider(grid, false, false, true, 0, 1);
    this.CreateSlider(grid, true, false, true, 1, 1);

    this.CreateSlider(grid, false, false, true, 2, 0);
    this.CreateSlider(grid, true, false, true, 3, 0);

    this.CreateSlider(grid, false, false, true, 2, 1);
    this.CreateSlider(grid, true, false, true, 3, 1);




    this.CreateImageSlider(grid, false, true, true, 0, 2);
    this.CreateImageSlider(grid, true, true, true, 1, 2);

    this.CreateImageSlider(grid, false, false, true, 0, 3);
    this.CreateImageSlider(grid, true, false, true, 1, 3);

    this.CreateImageSlider(grid, false, false, true, 2, 2);
    this.CreateImageSlider(grid, true, false, true, 3, 2);

    this.CreateImageSlider(grid, false, false, true, 2, 3);
    this.CreateImageSlider(grid, true, false, true, 3, 3);
  }

  // 创建slider
  CreateSlider(
    parent: Grid, // 网格
    isVertical: boolean, // 是否垂直
    isClamped: boolean, // 是否限制
    displayThumb: boolean, // 是否显示滑块
    row: number, // 行
    col: number // 列
  ) {
    // 创建堆叠面板
    const panel = new StackPanel();
    panel.width = "200px";
    parent.addControl(panel, row, col);

    // 创建标题
    const header = new TextBlock();
    header.text = "Y-rotation 0 deg";
    header.height = "30px";
    header.color = "white";
    panel.addControl(header);

    // 创建slider
    const slider = new Slider();
    slider.minimum = 0;
    slider.maximum = Math.PI * 2;
    slider.isVertical = isVertical; // 水平或垂直
    slider.isThumbClamped = isClamped; // 是否限制在最小值和最大值之间
    slider.displayThumb = displayThumb; // 是否显示滑块

    if (isVertical) {
      // 垂直
      slider.width = "20px";
      slider.height = "80px";
    } else {
      slider.height = "20px";
      slider.width = "200px";
    }
    slider.color = "red";
    slider.onValueChangedObservable.add((value) => {
      header.text = `Y-rotation ${Math.round(Tools.ToDegrees(value))} deg`;
    });
    slider.value = Math.PI + Math.PI * Math.random();
    panel.addControl(slider);
  }

  CreateImageSlider(
    parent: Grid, // 网格
    isVertical: boolean, // 是否垂直
    isClamped: boolean, // 是否限制
    displayThumb: boolean, // 是否显示滑块
    row: number, // 行
    col: number // 列
  ) {
    // 创建堆叠面板
    const panel = new StackPanel();
    panel.width = "200px";
    parent.addControl(panel, row, col);

    // 创建标题
    const header = new TextBlock();
    header.text = "Y-rotation 0 deg";
    header.height = "30px";
    header.color = "white";
    panel.addControl(header);

    // 创建slider
    const slider = new ImageBasedSlider();
    slider.minimum = 0;
    slider.maximum = Math.PI * 2;
    slider.isVertical = isVertical; // 水平或垂直
    slider.isThumbClamped = isClamped; // 是否限制在最小值和最大值之间
    slider.displayThumb = displayThumb; // 是否显示滑块

    if (isVertical) {
      // 垂直
      slider.width = "20px";
      slider.height = "80px";
    } else {
      slider.height = "20px";
      slider.width = "200px";
    }

    if (!isVertical) {
      slider.backgroundImage = new GUI.Image(
        "back",
        "/textures/gui/backgroundImage.png"
      );
      slider.valueBarImage = new GUI.Image(
        "value",
        "/textures/gui/valueImage.png"
      );
    } else {
      slider.backgroundImage = new GUI.Image(
        "back",
        "/textures/gui/backgroundImage-vertical.png"
      );
      slider.valueBarImage = new GUI.Image(
        "value",
        "/textures/gui/valueImage-vertical.png"
      );
    }
    slider.thumbImage = new GUI.Image("thumb", "/textures/gui/thumb.png");

    slider.onValueChangedObservable.add((value) => {
      header.text = `Y-rotation ${Math.round(Tools.ToDegrees(value))} deg`;
    });
    slider.value = Math.PI + Math.PI * Math.random();
    panel.addControl(slider);
  }
}
