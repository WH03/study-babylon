import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Vector4,
  Animation,
} from "@babylonjs/core";

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
      5,
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

    // 创建车材质
    const carMaterial = new StandardMaterial("carMaterial");
    carMaterial.diffuseTexture = new Texture(
      "https://assets.babylonjs.com/environments/car.png"
    );
    const faceUV = [];
    faceUV[0] = new Vector4(0, 0.5, 0.38, 1);
    faceUV[1] = new Vector4(0, 0.5, 1, 0.5);
    faceUV[2] = new Vector4(0.38, 1, 0, 0.5);
    // 创建车模型
    const car = MeshBuilder.ExtrudePolygon(
      "car",
      {
        shape: outline,
        depth: 0.2,
        faceUV: faceUV,
        wrap: true,
      },
      this.scene,
      earcut
    );
    car.rotation.x = -Math.PI / 2;
    car.material = carMaterial;

    // 车轮材质
    const wheelMaterial = new StandardMaterial("wheelMaterial");
    wheelMaterial.diffuseTexture = new Texture(
      "https://assets.babylonjs.com/environments/wheel.png"
    );
    const wheelUV = [];
    wheelUV[0] = new Vector4(0, 0, 1, 1);
    wheelUV[1] = new Vector4(0, 0.5, 0, 0.5);
    wheelUV[2] = new Vector4(0, 0, 1, 1);
    // 车轮模型
    const wheelRB = MeshBuilder.CreateCylinder("wheelRB", {
      diameter: 0.125,
      height: 0.05,
      faceUV: wheelUV,
    });
    wheelRB.material = wheelMaterial;
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

    // 车轮动画
    const wheelAnimation = new Animation(
      "wheelAnimation",
      "rotation.y",
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // 车轮动画关键帧
    const wheelKeys = [];
    wheelKeys.push(
      {
        frame: 0,
        value: 0,
      },
      {
        frame: 30,
        value: 2 * Math.PI,
      }
    );
    wheelAnimation.setKeys(wheelKeys);
    wheelRB.animations = [wheelAnimation];
    scene.beginAnimation(wheelRB, 0, 30, true);

    wheelRF.animations = [wheelAnimation];
    scene.beginAnimation(wheelRF, 0, 30, true);

    wheelLB.animations = [wheelAnimation];
    scene.beginAnimation(wheelLB, 0, 30, true);

    wheelLF.animations = [wheelAnimation];
    scene.beginAnimation(wheelLF, 0, 30, true);

    // 小车动画

    const carAnimation = new Animation(
      "carAnimation",
      "position.x",
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    const carKeys = [];
    carKeys.push(
      {
        frame: 0,
        value: -4,
      },
      {
        frame: 150,
        value: 4,
      },
      {
        frame: 210,
        value: 4,
      }
    );
    carAnimation.setKeys(carKeys);
    car.animations = [carAnimation];
    scene.beginAnimation(car, 0, 210, true);
    return car;
  }
}
