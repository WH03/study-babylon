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
import { AdvancedDynamicTexture, Button, Control } from "@babylonjs/gui/2D";

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

    const plane = MeshBuilder.CreatePlane("plane", { size: 2 });
    plane.parent = sphere;
    plane.position.y = 2;
    plane.billboardMode = Mesh.BILLBOARDMODE_ALL; //使平面始终面向相机
    // 创建一个全屏UI
    const advancedDynamicTexture = AdvancedDynamicTexture.CreateForMesh(
      plane,
      128,
      128,
      true //true:UI元素可以响应鼠标事件
    );
    // 创建一个按钮
    const button = Button.CreateSimpleButton("button", "点击我");
    button.width = 1;
    button.height = 0.4;
    button.color = "white";
    button.background = "skyBlue";
    button.cornerRadius = 10; //圆角
    button.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER; //垂直居中
    button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER; //水平居中
    button.onPointerClickObservable.add(() => {
      console.log("按钮被点击了");
    });
    advancedDynamicTexture.addControl(button);
  }

  //导入模型
  async ImportMeshes() {
    const mesh = await ImportMeshAsync(
      "https://assets.babylonjs.com/meshes/both_houses_scene.babylon",
      this.scene
    );
    let ground = this.scene.getMeshById("ground")!;
    ground.position.y = -0.5;
    let house1 = this.scene.getMeshByName("detached_house")!;
    house1.position.y = 0.5;
  }
}
