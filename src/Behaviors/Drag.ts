/* 
    模型拖拽
*/
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  Color3,
  PointerDragBehavior,
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

    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机
    this.CreateLight(); //创建光源
    this.CreateMesh(); //创建物体
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
  CreateMesh() {
    const box = MeshBuilder.CreateBox("box", { size: 2 }, this.scene);
    box.position = new Vector3(0, 1, 0);
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 8, height: 8 },
      this.scene
    );
    this.AddDragBehavior(box);
  }
  //添加相机框架行为
  AddDragBehavior(box: Mesh) {
    const pointerDragBehavior = new PointerDragBehavior({
      // dragAxis: new Vector3(0, 1, 0), //拖拽方向:根据自身的方向
      dragPlaneNormal: new Vector3(0, 1, 0), //拖拽平面法线
    });
    pointerDragBehavior.useObjectOrientationForDragging = false; //使用对象方向
    pointerDragBehavior.updateDragPlane = false; //更新拖拽平面
    //使用对象方向
    pointerDragBehavior.useObjectOrientationForDragging = false;

    //开始拖拽事件
    pointerDragBehavior.onDragStartObservable.add((event) => {
      console.log("开始拖拽event", event);
    });
    // 拖拽事件
    pointerDragBehavior.onDragObservable.add((event) => {
      console.log("拖拽中event", event);
    });
    //拖拽结束事件
    pointerDragBehavior.onDragEndObservable.add((event) => {
      console.log("拖拽结束event", event);
    });

    box.addBehavior(pointerDragBehavior);
  }
}
