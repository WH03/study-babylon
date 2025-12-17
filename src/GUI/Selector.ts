import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Mesh,
  Tools,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";
import {
  AdvancedDynamicTexture,
  CheckboxGroup,
  Control,
  RadioGroup,
  SelectionPanel,
  SliderGroup,
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
    const boxMaterial = new StandardMaterial("boxMaterial");
    boxMaterial.emissiveColor = Color3.Blue();
    const box = MeshBuilder.CreateBox("box", { size: 2 });
    box.material = boxMaterial;
    const ground = MeshBuilder.CreateGround("ground", {
      width: 6,
      height: 6,
      subdivisions: 2,
    });
    ground.position = new Vector3(0, -3, 0);
    this.CreateSelector(box, boxMaterial); //创建选择器
  }
  // 创建GUI
  CreateSelector(box: Mesh, boxMaterial: StandardMaterial) {
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const selectorBox = new SelectionPanel("selectorBox");
    selectorBox.width = 0.3;
    selectorBox.height = 0.6;
    selectorBox.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    selectorBox.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    selectorBox.left = "10px";
    selectorBox.top = "-10px";
    selectorBox.color = "cyan";
    advancedDynamicTexture.addControl(selectorBox);

    // 添加选项：大小缩放
    const toSize = function (isChecked: boolean) {
      if (isChecked) {
        box.scaling = new Vector3(0.5, 0.5, 0.5);
      } else {
        box.scaling = new Vector3(1, 1, 1);
      }
    };

    // 添加选项：位置变化
    const toMove = function (isChecked: boolean) {
      if (isChecked) {
        box.position = new Vector3(2, 2, 0);
      } else {
        box.position = new Vector3(0, 0, 0);
      }
    };
    // 添加选项：改变颜色
    const setColor = function (num: number) {
      console.log("num: ", num);
      if (num === 0) {
        boxMaterial.emissiveColor = Color3.Red();
      } else if (num === 1) {
        boxMaterial.emissiveColor = Color3.Green();
      }
    };
    const transformGroup = new CheckboxGroup("transformGroup");
    transformGroup.addCheckbox("缩放", toSize); //添加缩放选项
    transformGroup.addCheckbox("位置变化", toMove); //添加位置变化选项
    selectorBox.addGroup(transformGroup);

    const colorGroup = new RadioGroup("color");
    colorGroup.addRadio("Red", setColor);
    colorGroup.addRadio("Green", setColor);
    selectorBox.addGroup(colorGroup);

    // 旋转
    const toRotate = function (rotate: number) {
      box.rotation = new Vector3(0, rotate, 0);
    };
    const displayValue = function (value: number) {
      return Math.round(Tools.ToDegrees(value));
    };
    const rotateGroup = new SliderGroup("rotateGroup");
    rotateGroup.addSlider(
      "旋转",
      toRotate,
      "degs",
      0,
      Math.PI * 2,
      0,
      displayValue
    );
    selectorBox.addGroup(rotateGroup);
  }
}
