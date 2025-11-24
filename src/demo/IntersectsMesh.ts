import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  ImportMeshAsync,
  Axis,
  Space,
  Tools,
  Animation,
  MeshBuilder,
  StandardMaterial,
} from "@babylonjs/core";

import "@babylonjs/loaders";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  carReady: boolean;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = this.CreateScene(canvas);
    this.carReady = false;

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
    new HemisphericLight("light", new Vector3(1, 1, 0), scene);
    // 创建碰撞盒子
    this.createBox();
    // 创建车
    this.createCar(scene);

    return scene;
  }
  // 创建碰撞盒子
  createBox() {
    const wireFrame = new StandardMaterial("wireFrame");
    wireFrame.wireframe = true;
    const hitBox = MeshBuilder.CreateBox(
      "hitBox",
      { width: 0.5, height: 0.6, depth: 4.5 },
      this.scene
    );
    hitBox.material = wireFrame;
    hitBox.position = new Vector3(3.1, 0.3, -5);
  }

  // 创建车
  createCar(scene: Scene) {
    // 导入村庄模型
    ImportMeshAsync(
      "https://assets.babylonjs.com/meshes/village.glb",
      this.scene
    );
    // 导入车模型
    ImportMeshAsync(
      "https://assets.babylonjs.com/meshes/car.glb",
      this.scene
    ).then(() => {
      const car = scene.getMeshByName("car")!;
      this.carReady = true;
      car.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
      car.position = new Vector3(-3, 0.16, 8);

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

    class walk {
      turn: number;
      dist: number;
      constructor(turn: number, dist: number) {
        this.turn = turn;
        this.dist = dist;
      }
    }
    const track: {
      dist: number;
      turn: number;
    }[] = [];
    track.push(new walk(180, 2.5));
    track.push(new walk(0, 5));

    // 导入人物，开启动画
    ImportMeshAsync(
      "https://playground.babylonjs.com/scenes/Dude/Dude.babylon",
      this.scene
    ).then((result) => {
      const dude = result.meshes[0];
      dude.scaling = new Vector3(0.008, 0.008, 0.008);

      dude.position = new Vector3(1.5, 0, -6.9);
      dude.rotate(Axis.Y, Tools.ToRadians(-90), Space.LOCAL);

      const startRotation = dude.rotationQuaternion!.clone();

      this.scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

      let distance = 0;
      let step = 0.015;
      let p = 0;

      // 获取碰撞盒子
      const hitBox = scene.getMeshByName("hitBox")!;
      //每次渲染前调用
      scene.onBeforeRenderObservable.add(() => {
        if (this.carReady) {
          // 小车进入到碰撞盒子，人物停止移动
          if (
            scene.getMeshByName("car")!.intersectsMesh(hitBox) &&
            !dude.getChildMeshes()[1].intersectsMesh(hitBox)
          ) {
            return;
          }
        }

        dude.movePOV(0, 0, step);
        distance += step;

        if (distance > track[p].dist) {
          dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
          p += 1;
          p %= track.length;
          if (p === 0) {
            distance = 0;
            dude.position = new Vector3(1.5, 0, -6.9);
            dude.rotationQuaternion = startRotation.clone();
          }
        }
      });
    });
  }
}
