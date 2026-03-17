import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  PhotoDome,
  PointerEventTypes,
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
    this.CreateMesh(); //创建物体
    this.CreatePhoto360(scene); //创建全景图
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

  // 创建360全景图
  CreatePhoto360(scene: Scene): void {
    const photo360 = new PhotoDome(
      "photo360",
      "/textures/360photo.jpg",
      {
        resolution: 64, // 分辨率
        size: 1000, // 大小
        useDirectMapping: true, // 是否使用直接映射
      },
      scene
    ); // 创建全景图

    let tickCount = -240,
      zoomLevel = 1;
    scene.registerBeforeRender(() => {
      tickCount += 1;
      if (zoomLevel == 1) {
        if (tickCount >= 0) {
          photo360.fovMultiplier = Math.sin(tickCount / 100) * 0.5 + 1;
        }
      } else {
        photo360.fovMultiplier = zoomLevel;
      }
    });

    scene.onPointerObservable.add((e) => {
      if (photo360 == undefined) return;
      zoomLevel += e.event.wheelDeltaY! * -0.0005;
      console.log(e.event);
      if (zoomLevel < 0) zoomLevel = 0;
      if (zoomLevel > 2) zoomLevel = 2;
      if (zoomLevel == 1) {
        tickCount = -60;
      }
    }, PointerEventTypes.POINTERWHEEL);
  }
}
