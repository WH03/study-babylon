import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
} from "babylonjs";

import earcut from "earcut";

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
      3,
      Vector3.Zero()
    );
    camera.attachControl(canvas, true);
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    const car = this.createCar();

    const wheelRB = MeshBuilder.CreateCylinder(
      "wheelRB",
      {
        diameter: 0.125,
        height: 0.05,
      }
    );
    wheelRB.parent = car;
    wheelRB.position.z = -0.1;
    wheelRB.position.x = -0.2;
    wheelRB.position.y = 0.035;

    let wheelRF = wheelRB.clone("wheelRF");
    wheelRF.position.x = 0.1;

    let wheelLB = wheelRB.clone("wheelLB");
    wheelLB.position.y = -0.2 - 0.035;

    let wheelLF = wheelRF.clone("wheelLF");
    wheelLF.position.y = -0.2 - 0.035;

    return scene;
  }

  // 创建车
   createCar() {
    const outline = [new Vector3(-0.3, 0, -0.1), new Vector3(0.2, 0, -0.1)];

    // 弧形面
    for (let i = 0; i < 20; i++) {
      outline.push(
        new Vector3(
          0.2 * Math.cos((i * Math.PI) / 40),
          0,
          0.2 * Math.sin((i * Math.PI) / 40) - 0.1
        )
      );
    }

    // 顶
    outline.push(new Vector3(0, 0, 0.1));
    outline.push(new Vector3(-0.3, 0, 0.1));

    // 创建车模型
    const car = MeshBuilder.ExtrudePolygon(
      "car",
      {
        shape: outline,
        depth: 0.2,
      },
      this.scene,
      earcut
    );

    return car;
  }
}
