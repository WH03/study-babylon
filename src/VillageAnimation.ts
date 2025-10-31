import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Animation,
  ImportMeshAsync,
} from "babylonjs";

import "babylonjs-loaders";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = this.CreateScene(canvas);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      15,
      Vector3.Zero()
    );
    camera.attachControl(canvas, true);
    const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
    // 创建车
    const car = this.createCar(scene);

    return scene;
  }

  // 创建车
  createCar(scene: Scene) {
    // 导入村庄模型
    ImportMeshAsync(
      "https://assets.babylonjs.com/meshes/village.glb",
      this.scene
    );
    ImportMeshAsync(
      "https://assets.babylonjs.com/meshes/car.glb",
      this.scene
    ).then(() => {
      const car = scene.getMeshByName("car")!;
      car.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
      car.position.y = 0.16;
      car.position.x = -3;
      car.position.z = 8;

      const carAanimation = new Animation(
        "carAnimation",
        "position.z",
        30,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE
      );

      const carKeys = [];
      carKeys.push(
        {
          frame: 0,
          value: 8,
        },
        {
          frame: 150,
          value: -7,
        },
        {
          frame: 200,
          value: -7,
        }
      );

      carAanimation.setKeys(carKeys);
      car.animations.push(carAanimation);
      scene.beginAnimation(car, 0, 200, true);
    });
  }
}
