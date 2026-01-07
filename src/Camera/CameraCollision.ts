import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  FreeCamera,
  StandardMaterial,
  Color3,
  Texture,
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
    scene.gravity = new Vector3(0, -9.81, 0);
    scene.collisionsEnabled = true; //开启碰撞检测

    const freeCamera = new FreeCamera("freeCamera", new Vector3(0, 1, -5)); //创建相机
    freeCamera.attachControl(canvas, true); //相机控制
    freeCamera.setTarget(Vector3.Zero()); //相机目标点
    freeCamera.minZ = 0.01; //相机最小距离
    freeCamera.speed = 0.1; //相机移动速度

    freeCamera.applyGravity = true; //相机重力
    freeCamera.ellipsoid = new Vector3(1, 1, 1); //相机碰撞体积
    freeCamera.checkCollisions = true; //相机碰撞检测

    this.CreateLight(); //创建光源

    this.CreateMesh();

    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(1, 1, 0)
    );
  }
  //创建物体
  CreateMesh(): void {
    const boxMaterial = new StandardMaterial("boxMaterial");
    boxMaterial.diffuseTexture = new Texture("/Materials/box.png");
    const box = MeshBuilder.CreateBox("box");
    box.material = boxMaterial;
    box.checkCollisions = true; //开启碰撞检测

    const box2 = MeshBuilder.CreateBox("box2");
    box2.position = new Vector3(3, 0, 0);
    const ground = MeshBuilder.CreateGround("ground", {
      width: 30,
      height: 30,
    });
    box2.checkCollisions = true; //开启碰撞检测

    
    const groundMaterial = new StandardMaterial("groundMaterial");
    groundMaterial.diffuseColor = Color3.Gray(); //设置材质颜色
    groundMaterial.backFaceCulling = true; //设置材质背面是否显示
    ground.material = groundMaterial;
    ground.position.y = -1;
    ground.checkCollisions = true; //开启碰撞检测
  }
}
