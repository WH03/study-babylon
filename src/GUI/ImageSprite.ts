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
    this.CreateSpriteImage(); //创建精灵图片
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
  CreateSpriteImage() {
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // 创建面板
    const panel = new StackPanel();
    advancedDynamicTexture.addControl(panel);
    // 创建按钮
    const button = Button.CreateSimpleButton("button", "点击");
    button.width = "150px";
    button.height = "40px";
    button.color = "white";
    button.background = "green";
    button.cornerRadius = 10;
    panel.addControl(button);

    let cellFlag = true;

    const image = new Image("image", "/GUI/player.png");
    image.width = "100px";
    image.height = "100px";
    image.cellId = 1; // 设置单元格ID
    image.cellWidth = 64;
    image.cellHeight = 64;
    image.sourceWidth = 64;
    image.sourceHeight = 64;
    panel.addControl(image);

    button.onPointerClickObservable.add(() => {
      cellFlag = !cellFlag;
      if (cellFlag) {
        image.cellId = 1;
        button.textBlock!.text = "Cell Animation";
      } else {
        image.cellId = -1;
        image.sourceLeft = 0;
        button.textBlock!.text = "Source Animation";
      }
    });

    // 动画
    setInterval(() => {
      if (cellFlag) {
        if (image.cellId < 10) {
          image.cellId++;
        } else {
          image.cellId = 1;
        }
      } else {
        image.sourceLeft += image.sourceWidth;
        if (image.sourceLeft >= 1408) {
          image.sourceLeft = 0;
        }
      }
    }, 50);
  }
}
