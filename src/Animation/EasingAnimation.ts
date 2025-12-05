import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ImportMeshAsync,
  StandardMaterial,
  Color3,
  Animation,
  CircleEase,
  EasingFunction,
  BezierCurveEase,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/inspector";
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
    scene.debugLayer.show();
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 4,
      30,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    // camera.upperRadiusLimit = 30; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    // camera.attachControl(canvas, true);
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateLight(); //创建光源

    this.CreateMesh(scene);
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
    const torusMaterial = new StandardMaterial("toursMaterial");
    torusMaterial.diffuseColor = Color3.Green();
    //
    const torus = MeshBuilder.CreateTorus("torus", {
      diameter: 1,
      thickness: 0.2,
      tessellation: 64,
    });
    torus.material = torusMaterial;
    torus.position = new Vector3(2, 0, 4);

    // 创建普通动画
    Animation.CreateAndStartAnimation(
      "anim",
      torus,
      "position",
      30,
      120,
      torus.position,
      torus.position.add(new Vector3(-8, 0, 0))
    );
    // 根据预定义的缓动函数创建动画
    const torus2 = MeshBuilder.CreateTorus("torus2", {
      diameter: 1,
      thickness: 0.2,
      tessellation: 64,
    });
    torus2.position = new Vector3(2, 0, 2);

    const torus2Anim = new Animation(
      "torus2Anim",
      "position",
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    const torus2Keys = [
      { frame: 0, value: torus2.position.clone() },
      { frame: 120, value: torus2.position.add(new Vector3(-8, 0, 0)) },
    ];
    torus2Anim.setKeys(torus2Keys);
    torus2.animations.push(torus2Anim);
    // 使用缓动函数
    const easingFunction = new CircleEase(); //圆缓动函数
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    torus2Anim.setEasingFunction(easingFunction);
    scene.beginAnimation(torus2, 0, 120, true);

    const torus3 = torus2.clone("torus3");
    torus3.position = new Vector3(2, 0, 0);
    // 贝塞尔曲线缓动函数
    const bezierAnimation = new Animation(
      "bezierAnimation",
      "position",
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    const bezierKeys = [
      { frame: 0, value: torus3.position.clone() },
      { frame: 120, value: torus3.position.add(new Vector3(-8, 0, 0)) },
    ];
    bezierAnimation.setKeys(bezierKeys);
    const bezierEase = new BezierCurveEase(0.32, -0.73, 0.69, 1.59);
    bezierAnimation.setEasingFunction(bezierEase);
    torus3.animations.push(bezierAnimation);
    scene.beginAnimation(torus3, 0, 120, true);
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
