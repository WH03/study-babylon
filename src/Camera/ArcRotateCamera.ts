/* 
    ArcRotateCamera 旋转相机
      该摄像机始终指向指定目标位置，并可围绕该目标旋转，目标作为旋转中心。它可以通过光标和鼠标或触摸事件来控制。
*/
import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Mesh,
  ArcRotateCamera,
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
    coordinate.ShowAxis(5);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    scene.useRightHandedSystem = true;
    /* 
    ArcRotateCamera 弧形旋转相机：
      参数：   
        name:相机名称
        position:相机位置
        scene?:场景
    */
    const arcRotateCamera = new ArcRotateCamera(
      "arcRotateCamera",
      Math.PI / 2, //相机绕Y轴旋转的角度
      Math.PI / 2.5, //相机绕X轴旋转的角度
      10, //相机距离目标点的距离
      Vector3.Zero() //相机旋转中心
    );
    arcRotateCamera.setTarget(Vector3.Zero()); //设置相机目标点
    // arcRotateCamera.zoomToMouseLocation = true;//以鼠标位置为中心进行缩放
    // arcRotateCamera.lowerRadiusLimit = 2; //相机最小距离
    // arcRotateCamera.upperRadiusLimit = 10; //相机最大距离
    // arcRotateCamera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    // arcRotateCamera.panningSensibility = 0; //鼠标拖动速度
    arcRotateCamera.attachControl(canvas, true);

    this.CreateLight(); //创建光源

    this.CreateMesh();
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
  CreateMesh(): void {
    const plane = MeshBuilder.CreatePlane("plane", {
      size: 5,
      sideOrientation: Mesh.DOUBLESIDE,
    }); //创建平面
    plane.rotation = new Vector3(Math.PI / 2, 0, 0); //旋转平面

    // 创建平面
    let redPlane = this.CreatePlane(Color3.Red(), new Vector3(-2, 0, -1.5));
    let greenPlane = this.CreatePlane(Color3.Green(), new Vector3(2, 0, -1));
    let bluePlane = this.CreatePlane(Color3.Blue(), new Vector3(2, 0, 1.5));
  }

  //创建平面
  CreatePlane(color: Color3, position: Vector3): Mesh {
    const planeMaterial = new StandardMaterial(`planeMaterial`); //创建材质
    planeMaterial.diffuseColor = color;
    planeMaterial.emissiveColor = color;
    planeMaterial.specularColor = color;
    const plane = MeshBuilder.CreatePlane(`plane${Math.random()}`, {
      width: 1,
      sideOrientation: Mesh.DOUBLESIDE,
    });
    plane.position = position;
    plane.material = planeMaterial;

    return plane;
  }
}
