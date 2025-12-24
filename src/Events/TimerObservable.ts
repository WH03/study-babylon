import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Observable,
  Mesh,
  Color3,
  setAndStartTimer,
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

    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateLight(scene); //创建光源
    this.CreateMesh(scene); //  创建物体
    return scene;
  }

  CreateLight(scene: Scene) {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0)
    );

    setTimeout(() => {
      hemisphericLight.diffuse = Color3.Blue();
    }, 2000);

    setAndStartTimer({
      timeout: 4000,
      contextObservable: scene.onBeforeRenderObservable,

      onEnded: () => {
        hemisphericLight.diffuse = Color3.Red();
      },
    });

    // 写法二：
    let pressed = false;
    scene.onPointerDown = () => {
      pressed = true; //按下鼠标
      setAndStartTimer({
        timeout: 6000,
        contextObservable: scene.onBeforeRenderObservable,
        breakCondition: () => {
          //按下鼠标时，计时器停止
          return !pressed;
        },
        onAborted: () => {
          hemisphericLight.diffuse.set(0, 0, 0);
        },

        onEnded: () => {
          hemisphericLight.diffuse = Color3.Purple();
        },
        onTick: (data) => {
          hemisphericLight.diffuse.set(0, data.completeRate, 0);
        },
      });
    };

    //
    scene.onPointerUp = () => {
      pressed = false; //松开鼠标
    };
  }
  //创建物体
  CreateMesh(scene: Scene): void {
    const box = MeshBuilder.CreateBox("box", { size: 1 });
  }
}
