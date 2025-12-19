/* 
  相机个模型绑定
*/

import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  FramingBehavior,
  Mesh,
  Color3,
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
    camera.upperRadiusLimit = 30; //相机最大距离

    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度

    // camera.useBouncingBehavior = true; //启用相机弹跳行为
    // camera.useAutoRotationBehavior = true; //启用相机自动旋转行为
    camera.addBehavior(this.AddFramingBehavior()); //添加相机自动旋转行为

    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机
    this.CreateLight(); //创建光源
    let box = this.CreateMesh(); //创建物体
    camera.setTarget(box); //设置相机目标
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
    hemisphericLight.diffuse = new Color3(1, 1, 1);
    hemisphericLight.intensity = 0.7;
  }
  CreateMesh(): Mesh {
    const box = MeshBuilder.CreateBox("box", { size: 2 }, this.scene);
    box.position = new Vector3(0, 1, 0);
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 8, height: 8 },
      this.scene
    );
    return box;
  }
  //添加相机框架行为
  AddFramingBehavior() {
    const framingBehavior = new FramingBehavior();
    framingBehavior.mode = FramingBehavior.IgnoreBoundsSizeMode;
    framingBehavior.radiusScale = 8;

    return framingBehavior;
  }
}
