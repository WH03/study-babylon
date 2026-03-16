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
  ShadowGenerator,
  Mesh,
  DirectionalLight,
  BackgroundMaterial,
  MirrorTexture,
  Plane,
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

    let box = this.CreateMesh();
    // this.ImportMeshes();
    // this.CreateSkyBox(scene); //创建天空盒
    this.CreateGround(box); //创建地面
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
  CreateMesh() {
    const directionalLight = new DirectionalLight(
      "directionalLight",
      new Vector3(-1, -3, 1)
    );
    directionalLight.intensity = 0.7;
    directionalLight.position = new Vector3(3, 9, 3);

    const sphere = MeshBuilder.CreateSphere("box", {
      diameter: 1,
      segments: 16,
    });
    sphere.position.y = 1;
    const material = new StandardMaterial("material");
    material.ambientColor = new Color3(0.5, 0.5, 0.3);
    sphere.material = material;

    this.addShadow(sphere, directionalLight);
    return sphere;
  }

  // 创建带材质的地面
  CreateGround(box: Mesh) {
    const ground = MeshBuilder.CreateGround("ground", {
      width: 10,
      height: 10,
    });
    // ground.position.y = -1;
    const groundMaterial = new BackgroundMaterial("groundMaterial");

    const mirrorTexture = new MirrorTexture("mirrorTexture", 512); //创建镜面纹理
    mirrorTexture.mirrorPlane = new Plane(0, -1, 0, 0); //设置镜面反射平面
    mirrorTexture.renderList?.push(box); //设置需要反射的物体列表

    groundMaterial.reflectionTexture = mirrorTexture;
    ground.material = groundMaterial;
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
