import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ImportMeshAsync,
  FlyCamera,
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

    const flyCamera = new FlyCamera("flyCamera", new Vector3(5, 5, 5));
    flyCamera.setTarget(Vector3.Zero());
    flyCamera.attachControl(true);
    flyCamera.rollCorrect = 10;
    flyCamera.bankedTurn = true; // 修正
    flyCamera.bankedTurnMultiplier = 0; // 修正
    flyCamera.maxZ = 10;//设置相机最大距离,超出不渲染
    flyCamera.minZ = 1;//设置相机最小距离，小于不渲染
    this.CreateLight(); //创建光源

    this.CreateMesh();
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
}
