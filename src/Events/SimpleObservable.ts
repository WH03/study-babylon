import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Observable,
  Mesh,
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

    this.CreateLight(); //创建光源
    this.CreateMesh(scene); //  创建物体
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0)
    );
  }
  //创建物体
  CreateMesh(scene: Scene): void {
    const box = MeshBuilder.CreateBox("box", { size: 1 });

    const sphere1 = MeshBuilder.CreateSphere("sphere1");
    const sphere2 = sphere1.clone("sphere2");
    sphere2.position.z = 2;

    // let alpha = 0;
    // scene.registerBeforeRender(() => {
    //   box.position.x = Math.sin(alpha) * 5;
    //   let observable = this.CreateObservable(sphere1, sphere2);
    //   observable.notifyObservers(box.position.x);
    //   alpha += 0.01;
    // });

    //写法二：
    let alpha = 0;
    
    const observableScene = scene.onBeforeRenderObservable.add(() => {
      box.position.x = Math.sin(alpha) * 5;
      let observable = this.CreateObservable(sphere1, sphere2);
      observable.notifyObservers(box.position.x);
      alpha += 0.01;

      // 移除观察者
      if (scene.onBeforeRenderObservable.hasObservers() && alpha > 5) {
        scene.onBeforeRenderObservable.remove(observableScene);
      }
    });
  }

  // 创建观察者
  CreateObservable(mesh1: Mesh, mesh2: Mesh) {
    // 创建一个可观察对象
    const observable = new Observable();
    // 添加观察者
    observable.add((value: any) => {
      mesh1.position.x = value / 2;
      mesh2.position.x = value / 3;
    });
    return observable;
  }
}
