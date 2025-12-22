/* 
    六自由度拖拽
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
  SixDofDragBehavior,
  ImportMeshAsync,
  BoundingBoxGizmo,
  UtilityLayerRenderer,
  MultiPointerScaleBehavior,
  TransformNode,
  AttachToBoxBehavior,
} from "@babylonjs/core";
import { GUI3DManager, HolographicButton, PlanePanel } from "@babylonjs/gui/3D";

import "@babylonjs/loaders";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = this.CreateScene(canvas);

    // const coordinate = new Coordinate(this.scene);
    // coordinate.ShowAxis(10);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    scene.createDefaultVRExperience({ floorMeshes: [] });
    // scene.useRightHandedSystem = true;
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      new Vector3(0, -2, 0)
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 30; //相机最大距离

    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度

    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机
    this.CreateLight(); //创建光源
    this.CreateMesh(); //创建物体
    this.AddSixDofDragBehavior(); //添加六自由度拖拽行为
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
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 8, height: 8 },
      this.scene
    );
    ground.position = new Vector3(0, -1.1, 0);
  }
  //添加六自由度拖拽行为
  async AddSixDofDragBehavior() {
    // 1. 推荐改用 ImportMeshAsync，这样可以直接操作加载进来的 meshes
    const result = await ImportMeshAsync("/Meshes/seagulf.glb", this.scene);

    // 2. 获取根节点。GLB 通常会有一个 __root__ 节点
    // 拖拽根节点可以确保整个模型（包括所有子零件）一起移动
    const modelRoot = result.meshes[0] as Mesh;

    modelRoot.position = Vector3.Zero();
    modelRoot.scaling.scaleInPlace(0.002);
    // 3. 创建包围盒
    let boundingBox =
      BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(modelRoot);

    // 4. 创建拖拽行为
    let utilLayer = new UtilityLayerRenderer(this.scene); //创建辅助层
    utilLayer.utilityLayerScene.autoClearDepthAndStencil = false; //设置自动清除深度和模板缓冲区
    let boundingBoxGizmo = new BoundingBoxGizmo(
      Color3.FromHexString("#0984e3"),
      utilLayer
    );
    boundingBoxGizmo.attachedMesh = boundingBox; //将包围盒与gizmo关联

    // 5. 添加行为
    let sixDofDragBehavior = new SixDofDragBehavior(); //创建六自由度拖拽行为
    boundingBox.addBehavior(sixDofDragBehavior); //将行为添加到包围盒
    let multiPointerScaleBehavior = new MultiPointerScaleBehavior(); //多指缩放行为
    boundingBox.addBehavior(multiPointerScaleBehavior); //将行为添加到包围盒

    // 6. 创建按钮，点击按钮时切换拖拽行为
    let button = this.CreateButton();
    const manager = new GUI3DManager(); //创建GUI3DManager
    const parentBar = new TransformNode("parentBar"); //创建父节点TransformNode
    parentBar.scaling.scaleInPlace(0.3); //设置父节点的缩放比例
    const planePanel = new PlanePanel(); //创建PlanePanel
    planePanel.margin = 0;
    planePanel.rows = 1;
    manager.addControl(planePanel);
    planePanel.linkToTransformNode(parentBar); //将PlanePanel与父节点关联
    planePanel.addControl(button); //将按钮添加到PlanePanel
    // 绑定按钮点击事件
    button.onPointerClickObservable.add(() => {
      if (boundingBoxGizmo.attachedMesh) {
        boundingBoxGizmo.attachedMesh = null; //如果已经附加了网格，则取消附加
        boundingBox.removeBehavior(sixDofDragBehavior);
        boundingBox.removeBehavior(multiPointerScaleBehavior);
      } else {
        boundingBoxGizmo.attachedMesh = boundingBox; //如果未附加网格，则附加网格
        boundingBox.addBehavior(sixDofDragBehavior);
        boundingBox.addBehavior(multiPointerScaleBehavior);
      }
    });

    // 添加行为
    const behavior = new AttachToBoxBehavior(parentBar); //创建AttachToBoxBehavior行为
    boundingBox.addBehavior(behavior); //将行为添加到网格
  }

  // 创建按钮，点击按钮时切换拖拽行为
  CreateButton() {
    // 创建按钮
    const button = new HolographicButton("button"); //创建HolographicButton
    button.text = `按钮`; //设置按钮文本
    return button;
  }
}
