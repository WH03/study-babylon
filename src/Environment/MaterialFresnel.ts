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

    // this.CreateLight(); //创建光源

    this.CreateMesh();
    // this.ImportMeshes();
    // this.CreateSkyBox(scene); //创建天空盒
    // this.CreateGround(); //创建地面
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
    // 创建灯光
    const directionalLight = new DirectionalLight(
      "directionalLight",
      new Vector3(-1, -3, 1)
    );
    directionalLight.intensity = 0.7;
    directionalLight.position = new Vector3(3, 9, 3);
    // 创建平面
    const ground = MeshBuilder.CreateGround("ground", {
      width: 6,
      height: 6,
      subdivisions: 2,
    });
    // ground.position.y = -2;

    // 创建材质
    const groundMaterial = new BackgroundMaterial("groundMaterial");
    const texture = new Texture("/backgroundGround.png");
    texture.hasAlpha = true; //开启透明通道
    groundMaterial.diffuseTexture = texture;
    groundMaterial.shadowLevel = 0.2; //阴影的强度  0表示黑色，1表示没有阴影
    groundMaterial.opacityFresnel = false; //禁用透明度菲涅尔
    ground.material = groundMaterial;

    // 接收阴影
    ground.receiveShadows = true;
    //创建立方体
    const box = MeshBuilder.CreateBox("box", { size: 2 }, this.scene);
    // const sphere = MeshBuilder.CreateSphere("sphere", {
    //   diameter: 2,
    //   segments: 16,
    // });
    box.position.y = 2;
    const material = new StandardMaterial("material");
    material.ambientColor = new Color3(0.5, 0.5, 0.3);
    box.material = material;
    this.addShadow(box, directionalLight);
    this.addReflect(box, groundMaterial);
  }

  // 添加反射
  addReflect(Mesh: Mesh, material: BackgroundMaterial) {
    const mirrorTexture = new MirrorTexture("mirror", 512);
    mirrorTexture.mirrorPlane = new Plane(0, -1, 0, 0);
    mirrorTexture.renderList = [Mesh];

    material.reflectionTexture = mirrorTexture;
    material.reflectionFresnel = true; //开启反射菲涅尔
    material.reflectionStandardFresnelWeight = 0.8; //反射菲涅尔权重

    // 添加杂色
    material.useRGBColor = false; //禁用RGB颜色
    material.primaryColor = Color3.Magenta(); //设置主颜色
  }

  addShadow(mesh: Mesh, light: DirectionalLight) {
    const shadowGenerator = new ShadowGenerator(512, light);
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
