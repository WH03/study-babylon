import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ImportMeshAsync,
  Animation,
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
      10,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 10; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    // camera.attachControl(canvas, true);
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateLight(); //创建光源

    this.CreateMesh(scene); //创建物体
    // this.ImportMeshes();
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
  CreateMesh(scene: Scene): void {
    const box = MeshBuilder.CreateBox("box", { size: 1 });

    const scalingAnimation = new Animation(
      "scalingAnimation",
      "scaling.x",
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    const scalingKeys = [
      { frame: 0, value: 1 },
      { frame: 20, value: 0.2 },
      { frame: 100, value: 1 },
    ];
    scalingAnimation.setKeys(scalingKeys);
    box.animations.push(scalingAnimation);

    // setTimeout(async () => {
    //   const anim = scene.beginAnimation(box, 0, 100, false);
    //   console.log("动画开始前");
    //   await anim.waitAsync();//等待动画结束
    //   console.log("动画结束后");
    // });

    // 创建并开始动画
    Animation.CreateAndStartAnimation(
      "scalingAnimation",
      box,
      "scaling.y",
      30,
      120,
      1,
      2.5
    );
  }

  //导入模型
  async ImportMeshes() {
    const mesh = await ImportMeshAsync(
      "https://assets.babylonjs.com/meshes/both_houses_scene.babylon",
      this.scene
    );
    let ground = this.scene.getMeshById("ground")!;
    ground.position.y = -0.5;
    let house1 = this.scene.getMeshByName("detached_house")!;
    house1.position.y = 0.5;
  }
}
