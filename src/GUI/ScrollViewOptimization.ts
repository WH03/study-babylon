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
  Checkbox,
  Container,
  Control,
  ScrollViewer,
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
    this.CreateScrollView(scene); //创建滚动视图
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
  async CreateScrollView(scene: Scene) {
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // 创建滚动视图
    const scrollViewer = new ScrollViewer();
    scrollViewer.width = 0.5;
    scrollViewer.height = 0.5;
    scrollViewer.background = "orange";
    scrollViewer.forceHorizontalBar = true; //强制显示水平滚动条
    scrollViewer.forceVerticalBar = true; //强制显示垂直滚动条
    advancedDynamicTexture.addControl(scrollViewer);

    // 创建内容
    const clientWidth = 10000,
      clientHeight = 10000;
    const numButtons = 5000; //按钮数量
    const colors = ["red", "green", "blue", "yellow", "purple", "lightGreen"]; //按钮颜色数组
    // 创建容器
    const container = new Container();
    container.width = clientWidth + "px";
    container.height = clientHeight + "px";
    scrollViewer.addControl(container);

    // 批量创建按钮
    for (let i = 0; i < numButtons; i++) {
      const button = Button.CreateSimpleButton(`button${i}`, `button-${i}`);
      button.width = "150px";
      button.height = "40px";
      button.fontSize = 24;
      button.cornerRadius = 5;
      button.background = colors[Math.floor(Math.random() * colors.length)]; //
      button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT; //按钮水平对齐方式
      button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP; //按钮垂直对齐方式
      button.left = Math.random() * clientWidth + "px"; //按钮水平位置
      button.top = Math.random() * clientHeight + "px"; //按钮垂直位置
      container.addControl(button);
    }

    // 优化滚动视图的性能
    const bucket = Checkbox.AddCheckBoxWithHeader("使用bucket", (value) => {
      scrollViewer.setBucketSizes(value ? 110 : 0, value ? 40 : 0); //设置bucket大小
    });
    (bucket.children[0] as Checkbox).isChecked = false;
    bucket.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    bucket.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    bucket.left = "20px";
    bucket.top = "30px";
    advancedDynamicTexture.addControl(bucket);

    // 优化滚动视图的渲染性能
    const freeze = Checkbox.AddCheckBoxWithHeader("冻结滚动视图", (value) => {
      scrollViewer.freezeControls = value; //冻结滚动视图
      bucket.children[0].isEnabled = value; //禁用bucket
    });

    (freeze.children[0] as Checkbox).isChecked = false; //默认不冻结滚动视图
    freeze.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    freeze.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    freeze.left = "5px";
    freeze.top = "5px";
    advancedDynamicTexture.addControl(freeze);

    //显示信息
    const statsText = new TextBlock();
    statsText.top = "60px";
    statsText.left = "20px";
    statsText.color = "white";
    statsText.width = "400px";
    statsText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    statsText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    statsText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT; // 文本水平居左
    statsText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP; // 文本垂直居上
    advancedDynamicTexture.addControl(statsText);

    scene.onBeforeRenderObservable.add(
      () => advancedDynamicTexture.markAsDirty() //强制更新
    );
    scene.onAfterRenderObservable.add(() => {
      statsText.text = `布局调用次数：${advancedDynamicTexture.numLayoutCalls}--渲染调用次数：${advancedDynamicTexture.numRenderCalls}`;
    });
  }
}
