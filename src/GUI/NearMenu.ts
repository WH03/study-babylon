import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import {
  GUI3DManager,
  NearMenu,
  TouchHolographicButton,
} from "@babylonjs/gui/3D";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = this.CreateScene(canvas);

    // const coordinate = new Coordinate(this.scene);
    // coordinate.ShowAxis(10);

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
      50,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 100; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机
    this.CreateNearMenu();
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
    const ground = MeshBuilder.CreateGround("ground", {
      width: 10,
      height: 10,
    });
  }
  // 创建GUI
  CreateNearMenu() {
    // 创建 3d gui
    const manager = new GUI3DManager();
    // manager.useRealisticScaling = true; // 使用真实比例
    manager.useRealisticScaling = false; // 使用真实比例

    const nearMenu = new NearMenu("nearMenu");
    nearMenu.position = new Vector3(0, 0, -1); // X=0（居中）, Y=1（高于地面）, Z=5（沿相机朝向）
    nearMenu.rows = 2; // 5个按钮垂直排列
    manager.addControl(nearMenu);
    // 创建按钮
    for (let i = 0; i < 5; i++) {
      let btn = this.CreateMenu(i); // 创建菜单
      nearMenu.addButton(btn);
    }
  }

  CreateMenu(index: number) {
    const button = new TouchHolographicButton(`button-${index}`);
    button.scaling = new Vector3(0.5, 0.5, 0.5);
    button.imageUrl = "/GUI/down.png"; // 确保图片路径正确，否则用文字测试
    button.text = `按钮${index}`;
    return button;
  }
}
