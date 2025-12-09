import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ImportMeshAsync,
  Mesh,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";
import {
  AdvancedDynamicTexture,
  Button,
  Control,
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
    // camera.attachControl(canvas, true);
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateLight(); //创建光源
    this.CreateGUI();

    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
  }
  // 创建GUI
  CreateGUI() {
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
    // 创建一个全屏UI
    const advancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI(
      "advancedDynamicTexture"
    );
    // 创建一个面板
    const panel = new StackPanel(); //创建一个堆叠面板
    // panel.background = "skyBlue"; //设置面板背景颜色
    advancedDynamicTexture.addControl(panel); //将面板添加到全屏UI中
    // 创建一个按钮
    const button = Button.CreateSimpleButton("button", "点击我");
    button.width = "200px";
    button.height = "50px";
    button.color = "white";
    button.background = "skyBlue";
    button.cornerRadius = 10; //圆角
    button.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER; //垂直居中
    button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER; //水平居中

    // 创建文字
    const text = new TextBlock(); //创建一个文本块
    text.width = 0.2; //设置宽度
    text.height = "40px"; //设置高度
    text.color = "white"; //设置颜色
    // text.text = "Hello World"; //设置文本内容

    panel.addControl(text); //将文本块添加到面板中

    // 鼠标按下
    button.onPointerDownObservable.add(() => {
      text.text = "鼠标按下";
    });
    // 鼠标抬起
    button.onPointerUpObservable.add(() => {
      text.text = "鼠标抬起";
    });
    // 鼠标进入
    button.onPointerEnterObservable.add(() => {
      text.text = "鼠标进入";
    });
    // 鼠标离开
    button.onPointerOutObservable.add(() => {
      text.text = "鼠标离开";
    });
    // 移动
    button.onPointerMoveObservable.add((data) => {
      // console.log("@@data移动：", data);
      const coordinate = button.getLocalCoordinates(data); //获取鼠标相对于按钮的坐标
      text.text = `坐标x:${coordinate.x.toFixed(2)},y:${coordinate.y.toFixed(
        2
      )}`;
    });

    panel.addControl(button);
  }
}
