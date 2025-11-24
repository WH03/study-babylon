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
} from "@babylonjs/core";

import "@babylonjs/loaders";

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
    new HemisphericLight("light", new Vector3(1, 1, 0), scene);
    // 创建车
    this.createCar(scene);

    return scene;
  }

  // 创建车
  createCar(scene: Scene) {
    // 导入村庄模型
    ImportMeshAsync(
      "https://assets.babylonjs.com/meshes/village.glb",
      this.scene
    );
    // 导入车模型
    // ImportMeshAsync(
    //   "https://assets.babylonjs.com/meshes/car.glb",
    //   this.scene
    // ).then(() => {
    //   const car = scene.getMeshByName("car")!;
    //   car.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
    //   car.position.y = 0.16;
    //   car.position.x = -3;
    //   car.position.z = 8;

    //   const carAanimation = new Animation(
    //     "carAnimation",
    //     "position.z",
    //     30,
    //     Animation.ANIMATIONTYPE_FLOAT,
    //     Animation.ANIMATIONLOOPMODE_CYCLE
    //   );

    //   const carKeys = [];
    //   carKeys.push(
    //     {
    //       frame: 0,
    //       value: 8,
    //     },
    //     {
    //       frame: 150,
    //       value: -7,
    //     },
    //     {
    //       frame: 200,
    //       value: -7,
    //     }
    //   );

    //   carAanimation.setKeys(carKeys);
    //   car.animations.push(carAanimation);
    //   scene.beginAnimation(car, 0, 200, true);

    //   // 车轮动画
    //   const wheelRB = scene.getMeshByName("weelRB");
    //   const wheelRF = scene.getMeshByName("weelRF");
    //   const wheelLB = scene.getMeshByName("weelLB");
    //   const wheelLF = scene.getMeshByName("wheelLF");
    //   scene.beginAnimation(wheelRB, 0, 100, true);
    //   scene.beginAnimation(wheelRF, 0, 30, true);
    //   scene.beginAnimation(wheelLB, 0, 30, true);
    //   scene.beginAnimation(wheelLF, 0, 30, true);
    // });

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

    track.push(new walk(86, 7));
    track.push(new walk(-85, 14.8));
    track.push(new walk(-93, 16.5));
    track.push(new walk(48, 25.5));
    track.push(new walk(-112, 30.5));
    track.push(new walk(-72, 33.2));
    track.push(new walk(42, 37.5));
    track.push(new walk(-98, 45.2));
    track.push(new walk(0, 47));

    // 导入人物，开启动画
    ImportMeshAsync(
      "https://playground.babylonjs.com/scenes/Dude/Dude.babylon",
      this.scene
    ).then((result) => {
      const dude = result.meshes[0];
      dude.scaling = new Vector3(0.008, 0.008, 0.008);
      dude.position = new Vector3(-6, 0, 0);
      // this.scene.beginAnimation(result.skeletons[0], 0, 100, true);
      dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);
      const startRotation = dude.rotationQuaternion!.clone();

      scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

      let distance = 0;
      let step = 0.015;
      let p = 0;
      //每次渲染前调用
      scene.onBeforeRenderObservable.add(() => {
        dude.movePOV(0, 0, step);
        distance += step;

        if (distance > track[p].dist) {
          dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
          p += 1;
          p %= track.length;
          if (p === 0) {
            distance = 0;
            dude.position = new Vector3(-6, 0, 0);
            dude.rotationQuaternion = startRotation.clone();
          }
        }
      });
    });
  }
}
