import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  FreeCamera,
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
    camera.attachControl(canvas, true);

    const freeCamera = new FreeCamera("camera2", new Vector3(0, 0, -10));
    freeCamera.layerMask = 0x10000000; //设置相机可见层遮罩

    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateLight(); //创建光源

    this.CreateMesh(); //创建物体

    if (scene.activeCameras?.length === 0) {
      //如果场景中没有激活的相机
      scene.activeCameras.push(scene.activeCamera!); //将相机添加到场景中
    }
    scene.activeCameras?.push(freeCamera); //将自由相机添加到场景中

    for (let i = 0; i < scene.lights?.length; i++) {
      scene.lights[i].excludeWithLayerMask = 0x10000000; //不受灯光影响的层遮罩
    }

    this.CreateLight2(); //创建光源2

    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0)
    );
  }
  CreateLight2() {
    const hemisphericLight2 = new HemisphericLight(
      "hemisphericLight2",
      new Vector3(0, 1, 0)
    );
    hemisphericLight2.diffuse = Color3.Blue(); //设置光源颜色
    hemisphericLight2.includeOnlyWithLayerMask = 0x10000000; //设置光源可见层遮罩
  }

  //创建物体
  CreateMesh(): void {
    const box = MeshBuilder.CreateBox("box");

    const sphere = MeshBuilder.CreateSphere("sphere");
    sphere.position = new Vector3(2, 0, 0);
    sphere.layerMask = 0x10000000; //设置物体可见层遮罩
  }
}
