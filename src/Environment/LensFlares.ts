import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ImportMeshAsync,
  LensFlareSystem,
  LensFlare,
  Color3,
} from "@babylonjs/core";

import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";

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

    // this.CreateMesh();
    this.ImportMeshes();
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
  }
  //创建物体
  CreateMesh(): void {
    const box = MeshBuilder.CreateBox("box", { size: 1 }, this.scene);
  }

  //导入模型
  async ImportMeshes() {
    const meshes = await ImportMeshAsync("/Meshes/candle.babylon", this.scene);
    console.log("mesh:", meshes);
    this.scene.createDefaultEnvironment(); //创建默认环境
    this.scene.getMeshByName("Plane")!.isVisible = false; //隐藏平面

    // 创建镜头光晕
    const lensFlares = new LensFlareSystem(
      "lensFlares",
      this.scene.getMeshByName("Cylinder_004"),
      this.scene
    );
    //
    const flare0 = new LensFlare(
      0.1, //大小
      1, //亮度
      new Color3(1, 1, 1), //颜色
      "/Particles/flare.png", //图片
      lensFlares //镜头光晕系统
    );

    const flare1 = new LensFlare(
      0.15,
      1.25,
      new Color3(0.95, 0.89, 0.72),
      "/Particles/flare.png",
      lensFlares
    );
    const flare2 = new LensFlare(
      0.1,
      0.85,
      new Color3(0.71, 0.8, 0.95),
      "/Particles/Flare2.png",
      lensFlares
    );
    const flare3 = new LensFlare(0.075, 1.5,new Color3(0.8, 0.56, 0.72),"/Particles/flare3.png",lensFlares
    );
  }
}
