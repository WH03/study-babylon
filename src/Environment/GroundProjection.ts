import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Color4,
  Color3,
  CubeTexture,
  Texture,
  BackgroundMaterial,
  Mesh,
  PBRMaterial,
  DirectionalLight,
  ShadowGenerator,
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
      Math.PI / 3,
      15,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 300; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    camera.attachControl(canvas, true);
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(
      "/textures/environment.env",
      scene
    );

    this.CreateLight(); //创建光源

    this.CreateMesh(scene);
    // this.ImportMeshes();
    // this.CreateHDRBox(scene); //创建天空盒
    this.CreateSkyBox(scene); //创建天空盒
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
  CreateMesh(scene: Scene): void {
    const pbr = new PBRMaterial("pbr", scene); //创建PBR材质
    pbr.albedoColor = new Color3(0.9, 0.9, 0.9); //设置物体颜色
    pbr.metallic = 1.0; //设置金属度
    pbr.roughness = 0.0; //设置粗糙度

    const sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      scene
    );
    sphere.position.y = 1;
    sphere.material = pbr;

    this.AddShadow(scene, sphere);
  }
  //

  // 创建天空盒
  CreateSkyBox(scene: Scene): void {
    const skybox = MeshBuilder.CreateBox("skybox", {
      size: 1000,
      sideOrientation: Mesh.BACKSIDE,
    });
    skybox.position.y = 500;
    skybox.isPickable = false;
    skybox.receiveShadows = true;

    const skyBoxMaterial = new BackgroundMaterial("skyMaterial", scene);
    skyBoxMaterial.reflectionTexture = scene.environmentTexture!.clone(); //天空盒反射贴图
    skyBoxMaterial.reflectionTexture!.coordinatesMode = Texture.SKYBOX_MODE; //天空盒模式
    skyBoxMaterial.enableGroundProjection = true; //启用地面投影
    skyBoxMaterial.projectedGroundRadius = 20; //地面投影半径
    skyBoxMaterial.projectedGroundHeight = 3; //地面投影高度
    skybox.material = skyBoxMaterial;
  }

  // 添加阴影
  AddShadow(scene: Scene, mesh: Mesh): void {
    // 添加灯光
    const light = new DirectionalLight(
      "light0", // 光源id
      new Vector3(-8, -14, -10), // 光源位置
      scene
    );
    light.intensity = 0.7; // 光源强度
    light.shadowMinZ = 15; // 阴影最小z值
    light.shadowMaxZ = 30; // 阴影最大z值
    light.diffuse = new Color3(1, 0.9, 0.6); // 光源颜色

    const shadowGenerator = new ShadowGenerator(512, light); // 阴影生成器
    shadowGenerator.usePercentageCloserFiltering = true; // 启用百分比更接近过滤
    shadowGenerator.darkness = 0.2; // 阴影暗度

    shadowGenerator.addShadowCaster(mesh); // 添加阴影投射者
  }
}
