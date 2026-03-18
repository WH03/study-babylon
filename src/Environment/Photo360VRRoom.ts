import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  PhotoDome,
  PointerEventTypes,
  ExecuteCodeAction,
  ActionManager,
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
    // scene.useRightHandedSystem = true;
    this.CreateVRHelper(scene); //创建VR助手
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
    hemisphericLight.intensity = 0.7;
  }
  //创建物体
  CreateMesh(): void {
    const box = MeshBuilder.CreateBox("box", { size: 1 }, this.scene);
  }

  // 创建360全景图
  CreatePhoto360(scene: Scene): void {
    const photo360 = new PhotoDome(
      "photo360",
      "/textures/sidexside.jpg",
      {
        resolution: 32, // 分辨率
        size: 1000, // 大小
      },
      scene
    ); // 创建全景图
    photo360.imageMode = PhotoDome.MODE_SIDEBYSIDE; // 设置全景图模式

    let tickCout = -240,
      zoomLevel = 1;
    scene.registerAfterRender(() => {
      tickCout++;
      if (zoomLevel == 1) {
        if (tickCout >= 0) {
          photo360.fovMultiplier = Math.sin(tickCout / 100) * 0.5 + 1;
        }
      } else {
        photo360.fovMultiplier = zoomLevel;
      }
    });

    scene.onPointerObservable.add((e) => {
      if (photo360 == undefined) return;
      // 使用类型断言将事件转为 WheelEvent
      const wheelEvent = e.event as WheelEvent;
      zoomLevel += wheelEvent.deltaY * -0.0005;

      if (zoomLevel < 0) zoomLevel = 0;
      if (zoomLevel > 2) zoomLevel = 2;
      if (zoomLevel == 1) {
        tickCout = -60;
      }
    }, PointerEventTypes.POINTERWHEEL);
  }

  CreateVRHelper(scene: Scene) {
    const vrHelper = scene.createDefaultVRExperience();
    scene.actionManager?.registerAction(
      // 创建一个 ExecuteCodeAction
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnKeyDownTrigger,
          parameter: "s", //press "s" key
        },
        () => {
          vrHelper.enterVR();
        }
      )
    );

    // 从全屏切换到2d
    scene.actionManager?.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnKeyDownTrigger,
          parameter: "e", //press "e" key
        },
        () => {
          vrHelper.exitVR();
          document.exitFullscreen();
        }
      )
    );
  }
}
