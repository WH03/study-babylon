/* 
    VirtualJoySticks: 虚拟摇杆的使用
*/
import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ArcRotateCamera,
  LoadSceneAsync,
  VirtualJoysticksCamera,
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
    coordinate.ShowAxis(5);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    // scene.useRightHandedSystem = true;
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      15,
      Vector3.Zero()
    );
    camera.attachControl(canvas, true);
    this.CreateLight(); //创建光源

    this.CreateMesh();

    this.LoadModel(canvas); //加载模型
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
    const box = MeshBuilder.CreateBox("box", { size: 2 });
  }

  //加载模型
  async LoadModel(canvas: HTMLCanvasElement) {
    let newScene = await LoadSceneAsync(
      "/Meshes/Espilit/Espilit.babylon",
      this.engine
    );
    const virtualJoySticksCamera = new VirtualJoysticksCamera(
      "virtualJoySticksCamera",
      newScene.activeCamera!.position
    );
    const activeCamera = newScene.activeCamera as ArcRotateCamera;
    virtualJoySticksCamera.rotation = activeCamera.rotation;
    virtualJoySticksCamera.checkCollisions = activeCamera.checkCollisions;
    //当场景加载完成时执行
    newScene.executeWhenReady(() => {
      newScene.activeCamera = virtualJoySticksCamera;
      newScene.activeCamera.attachControl(canvas);
      this.engine.runRenderLoop(() => {
        newScene.render();
      });
    });
  }
}
