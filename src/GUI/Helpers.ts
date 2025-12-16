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
  Checkbox,
  Ellipse,
  Grid,
  RadioButton,
  Rectangle,
  Slider,
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
    this.CreateHelper(); //创建辅助线
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
  CreateHelper() {
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // 创建网格
    const grid = new Grid();
    grid.background = "black";
    grid.addColumnDefinition(0.15);
    grid.addColumnDefinition(0.15);
    grid.addColumnDefinition(0.15);
    grid.addColumnDefinition(0.15);
    grid.addColumnDefinition(0.15);
    grid.addColumnDefinition(0.15);
    grid.addRowDefinition(0.5);
    grid.addRowDefinition(0.5);
    advancedDynamicTexture.addControl(grid);

    const stackPanel = new StackPanel();
    grid.addControl(stackPanel, 1, 1); // 添加到网格中,位置为1行1列

    const colors = ["red", "green", "blue", "yellow", "magenta", "cyan"];
    const ellipses = colors.map((color, index) => {
      const circle = new Ellipse();
      circle.width = "100px";
      circle.height = "100px";
      circle.thickness = 1;
      circle.background = color;
      grid.addControl(circle, 0, index);

      return circle;
    });

    // 创建文本
    const textBlock = new TextBlock();
    textBlock.text = "大小:100";
    textBlock.color = "white";
    textBlock.fontSize = 24;
    textBlock.width = "100px";
    textBlock.height = "50px";
    stackPanel.addControl(textBlock);

    // 创建滑块
    const slider = new Slider();
    slider.width = "100px";
    slider.height = "20px";
    slider.background = "gray"; // 设置滑块背景颜色
    slider.color = "skyblue"; // 设置滑块颜色
    slider.minimum = 10;
    slider.maximum = 120;
    slider.value = 100;
    slider.step = 1;
    slider.isThumbClamped = true; // 设置滑块是否在最小值和最大值之间
    slider.onValueChangedObservable.add((value: number) => {
      textBlock.text = `大小:${value}`;
      ellipses.map((ellipse) => {
        ellipse.width = `${value}px`;
        ellipse.height = `${value}px`;
      });
    });
    stackPanel.addControl(slider);

    // 多选按钮
    const panelCheck = new StackPanel();
    grid.addControl(panelCheck, 1, 2);
    const checks = colors.map((color, i) => {
      /* 
      AddCheckBoxWithHeader：添加带有标题的复选框
      参数1：标题颜色
      参数2：回调函数，当复选框的值改变时调用
      */
      const check = Checkbox.AddCheckBoxWithHeader(color, (v) => {
        ellipses[i].isVisible = v; // 设置椭圆是否可见
      });
      check.children[0].color = color; // 设置复选框的颜色
      panelCheck.addControl(check);
      return check;
    });

    // 单选
    const panelRadio = new StackPanel();
    grid.addControl(panelRadio, 1, 3);

    const radio1 = RadioButton.AddRadioButtonWithHeader(
      "enable",
      "group",
      true,
      (radioButton, value) => {
        if (value) {
          checks.forEach((check) => {
            check.isEnabled = true;
            check.children[0].color = (check.children[1] as TextBlock).text;
          });
        }
      }
    );
    panelRadio.addControl(radio1);
    const radio2 = RadioButton.AddRadioButtonWithHeader(
      "disable",
      "group",
      false,
      (radioButton, value) => {
        if (value) {
          checks.forEach((check) => {
            check.isEnabled = false;
            check.children[0].color = "gray";
          });
        }
      }
    );
    panelRadio.addControl(radio2);
  }
}
