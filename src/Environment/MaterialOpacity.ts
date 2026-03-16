import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ImportMeshAsync,
  Color4,
  Color3,
  StandardMaterial,
  CubeTexture,
  Texture,
  ShadowGenerator,
  Mesh,
  DirectionalLight,
  BackgroundMaterial,
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
    scene.clearColor = new Color4(0.2, 0.2, 0.3, 1);
    scene.ambientColor = new Color3(0.5, 0.8, 0.5);

    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 4,
      30,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 30; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    // camera.attachControl(canvas, true);
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateLight(); //创建光源

    this.CreateMesh();
    // this.ImportMeshes();
    // this.CreateSkyBox(scene); //创建天空盒
    this.CreateGround(); //创建地面
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
    hemisphericLight.intensity = 0.7;
  }
  //创建物体
  CreateMesh(): void {
    const directionalLight = new DirectionalLight(
      "directionalLight",
      new Vector3(-1, -3, 1)
    );
    directionalLight.intensity = 0.7;
    directionalLight.position = new Vector3(3, 9, 3);

    const box = MeshBuilder.CreateBox("box", { size: 2 }, this.scene);
    const material = new StandardMaterial("material");
    material.ambientColor = new Color3(0.5, 0.5, 0.3);
    box.material = material;
    // this.addShadow(box, directionalLight);
  }

  // 创建带材质的地面
  CreateGround(): void {
    const ground = MeshBuilder.CreateGround("ground", {
      width: 10,
      height: 10,
    });
    ground.position.y = -2;
    const groundMaterial = new BackgroundMaterial("groundMaterial");
    const texture = new Texture("/backgroundGround.png");
    texture.hasAlpha = true; //开启透明通道
    groundMaterial.diffuseTexture = texture;
    groundMaterial.shadowLevel = 0.2; //阴影的强度  0表示黑色，1表示没有阴影
    // groundMaterial.opacityFresnel = false; //禁用透明度菲涅尔
    ground.material = groundMaterial;

    // 接收阴影
    ground.receiveShadows = true;
  }

  addShadow(mesh: Mesh, light: DirectionalLight) {
    const shadowGenerator = new ShadowGenerator(1024, light);
    shadowGenerator.addShadowCaster(mesh);
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

  //创建天空盒
  async CreateSkyBox(scene: Scene) {
    const hdrTexture = new CubeTexture("/textures/SpecularHDR.dds", scene);
    scene.createDefaultSkybox(hdrTexture, true, 10000); //
  }
}
