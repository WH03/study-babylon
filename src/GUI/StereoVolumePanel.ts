import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  TransformNode,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";
import {
  Container,
  Container3D,
  CylinderPanel,
  GUI3DManager,
  HolographicButton,
  PlanePanel,
  ScatterPanel,
  SpherePanel,
} from "@babylonjs/gui";

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
      Math.PI / 2.5,
      30,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 30; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateLight(); //创建光源
    this.CreateMeshes(); //创建物体
    this.CreateGeometryPanel(); //创建球形面板
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
  }
  // 创建物体
  CreateMeshes() {
    const box = MeshBuilder.CreateBox("box", { size: 2 });
    const ground = MeshBuilder.CreateGround("ground", {
      width: 6,
      height: 6,
      subdivisions: 2,
    });
    ground.position = new Vector3(0, -3, 0);
  }
  // 创建球形面板
  CreateGeometryPanel() {
    // 创建一个父节点,用于控制面板的位置和旋转
    const parentNode = new TransformNode("parentNode");

    parentNode.position = new Vector3(0, 5, 0);
    // 3D GUI
    const manager = new GUI3DManager();
    // const geometryPanel = new SpherePanel();// 球形面板
    const geometryPanel = new CylinderPanel(); // 圆柱形面板
    // const geometryPanel = new PlanePanel(); // 平面面板
    // const geometryPanel = new ScatterPanel(); // 随机面板

    geometryPanel.margin = 0.2;
    geometryPanel.position.z = 3;
    geometryPanel.blockLayout = false; //布局是否被阻塞
    geometryPanel.orientation = Container3D.FACEFORWARD_ORIENTATION; //面板方向
    manager.addControl(geometryPanel);
    geometryPanel.linkToTransformNode(parentNode);

    for (let i = 0; i < 100; i++) {
      this.AddButton(geometryPanel);
    }
  }

  // 创建圆柱形面

  // 添加按钮
  AddButton(geometryPanel: any) {
    const button = new HolographicButton("button");
    button.text = `按钮${geometryPanel.children.length + 1}`;
    geometryPanel.addControl(button);
  }
}
