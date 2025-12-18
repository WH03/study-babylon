import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ImportMeshAsync,
  Color3,
  Mesh,
  PBRMaterial,
} from "@babylonjs/core";

import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";
import {
  Button3D,
  CylinderPanel,
  GUI3DManager,
  MeshButton3D,
  StackPanel3D,
  TextBlock,
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
    const ground = MeshBuilder.CreateGround("ground", {
      width: 6,
      height: 6,
      subdivisions: 2,
    });
    ground.position = new Vector3(0, -3, 0);
  }
  // 创建球形面板
  async CreateGeometryPanel() {
    let model = await ImportMeshAsync("/Meshes/pushButton.glb", this.scene); // 导入模型

    // 3D GUI
    const manager = new GUI3DManager();

    const geometryPanel = new StackPanel3D(); // 圆柱形面板
    geometryPanel.margin = 0.7;
    manager.addControl(geometryPanel);

    // button3D
    const button = new Button3D("button");
    geometryPanel.addControl(button);

    // 设置文本内容
    const textBlock = new TextBlock("textBlock");
    textBlock.text = "3D按钮";
    textBlock.color = "white";
    textBlock.fontSize = 36;
    button.content = textBlock;

    const cylinderPanel = new CylinderPanel(); // 圆柱形面板
    cylinderPanel.margin = 0.7;
    manager.addControl(cylinderPanel);
    let pushButtonCore = model.meshes[0] as Mesh;
    this.MakePushButtons(cylinderPanel, pushButtonCore);
    pushButtonCore.setEnabled(false); // 隐藏模型
  }

  // 创建按钮
  MakePushButton(mesh: Mesh, panel: CylinderPanel) {
    let index = 0;
    // 获取圆柱体
    const cylinder = mesh.getChildMeshes(false, (node) => {
      return node.name.indexOf("Cylinder") != -1;
    })[0];
    // 设置按钮材质
    const cylinderMaterial = cylinder.material?.clone(
      `cylinderMaterial${index}`
    )! as PBRMaterial;

    cylinderMaterial.albedoColor = new Color3(0.5, 0.19, 0); // 设置材质颜色

    cylinder.material = cylinderMaterial;

    const pushButton = new MeshButton3D(mesh, `pushBtn${index}`);
    pushButton.pointerEnterAnimation = () => {
      (cylinder.material! as PBRMaterial).albedoColor = Color3.Green();
    };
    pushButton.pointerOutAnimation = () => {
      (cylinder.material! as PBRMaterial).albedoColor = new Color3(
        0.5,
        0.19,
        0
      );
    };
    pushButton.pointerDownAnimation = () => {
      cylinder.position.y = 0;
    };
    pushButton.pointerUpAnimation = () => {
      cylinder.position.y = 0.21;
    };
    pushButton.onPointerDownObservable.add(() => {
      console.log(pushButton.name + " pushed.");
    });
    panel.addControl(pushButton);
    index++;
  }

  MakePushButtons(panel: any, pushButtonCore: Mesh) {
    panel.blockLayout = true;
    for (var i = 0; i < 60; i++) {
      let newPushButton = pushButtonCore.clone(`pushButton${i}`) as Mesh;

      this.MakePushButton(newPushButton, panel);
    }
    panel.blockLayout = false;
  }
}
