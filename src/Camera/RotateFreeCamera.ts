import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  FreeCamera,
  StandardMaterial,
  Color3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";
import FreeCameraKeyboardRotateInput from "@/components/FreeCameraKeyboard";
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

    const freeCamera = new FreeCamera("freeCamera", new Vector3(0, 5, -20)); //创建相机
    freeCamera.attachControl(canvas, true); //相机控制
    freeCamera.setTarget(Vector3.Zero()); //相机目标点
    freeCamera.minZ = 0.01; //相机最小距离
    freeCamera.speed = 0.1; //相机移动速度
    freeCamera.inputs.removeByType("FreeCameraKeyboardMoveInput");
    freeCamera.inputs.add(new FreeCameraKeyboardRotateInput(0.01)); //键盘控制相机移动

    this.CreateLight(); //创建光源

    this.CreateMesh(); //创建物体

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
    const box = MeshBuilder.CreateBox("box");
    box.checkCollisions = true; //开启碰撞检测

    const ground = MeshBuilder.CreateGround("ground", {
      width: 30,
      height: 30,
    });
    const groundMaterial = new StandardMaterial("groundMaterial");
    groundMaterial.diffuseColor = Color3.Gray(); //设置材质颜色
    groundMaterial.backFaceCulling = true; //设置材质背面是否显示
    ground.material = groundMaterial;
    ground.position.y = -1;
    ground.checkCollisions = true; //开启碰撞检测
  }
}
