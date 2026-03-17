import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ImportMeshAsync,
  Matrix,
  StandardMaterial,
  Texture,
  MirrorTexture,
  Plane,
  Color3,
  Mesh,
  ReflectionProbe,
  FresnelParameters,
  RenderTargetTexture,
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
      Math.PI / 3,
      Math.PI / 3,
      30,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 300; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    // camera.attachControl(canvas, true);
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.AddFog(scene); //添加雾效

    this.CreateLight(); //创建光源

    this.CreateMesh(scene);
    // this.ImportMeshes();
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
    hemisphericLight.intensity = 0.7; //光源强度
  }
  //创建物体
  CreateMesh(scene: Scene): void {
    // 创建torusKnot: 圆环结
    const torusKnot = MeshBuilder.CreateTorusKnot("knot", {
      radius: 1, //半径
      tube: 0.4, //管子半径
      radialSegments: 128, //径向分段
      tubularSegments: 64, //管子分段
    });
    // y方向创建球
    const ySphere = MeshBuilder.CreateSphere("ySphere", {
      diameter: 1.5,
      segments: 16,
    });
    ySphere.setPivotMatrix(Matrix.Translation(3, 0, 0), false); //设置旋转中心点

    const bSphere = ySphere.clone("bSphere");
    bSphere.setPivotMatrix(Matrix.Translation(-1, 3, 0), false); //设置旋转中心点

    const gSphere = ySphere.clone("gSphere");
    gSphere.setPivotMatrix(Matrix.Translation(0, 0, -3), false); //设置旋转中心点

    // 创建镜面、地面
    const mirror = MeshBuilder.CreateGround("mirror");
    mirror.scaling = new Vector3(100, 0.01, 100);
    const mirrorMaterial = new StandardMaterial("mirrorMaterial");
    mirror.position.y = -2;
    mirror.material = mirrorMaterial;

    // 创建地面贴图
    const diffTexture = new Texture("/textures/amiga.jpg"); //贴图
    diffTexture.uScale = 10;
    diffTexture.vScale = 10;
    mirrorMaterial.diffuseTexture = diffTexture;

    // 创建反射探针
    const reflectionTexture = new MirrorTexture(
      "mirrorTexture",
      1024,
      scene,
      true
    );
    reflectionTexture.mirrorPlane = new Plane(0, -1, 0, -2); //设置反射平面
    reflectionTexture.renderList = [ySphere, bSphere, gSphere, mirror]; //设置反射对象
    reflectionTexture.level = 0.5; //设置反射强度
    mirrorMaterial.reflectionTexture = reflectionTexture;

    // 圆环结反射
    this.GenerateReflectionProbe(
      torusKnot,
      new Color3(1, 0.5, 0.5),
      [ySphere, bSphere, gSphere, mirror],
      scene
    );

    this.GenerateReflectionProbe(
      ySphere,
      Color3.Yellow(),
      [torusKnot, bSphere, gSphere, mirror],
      scene
    );

    this.GenerateReflectionProbe(
      bSphere,
      Color3.Blue(),
      [torusKnot, ySphere, gSphere, mirror],
      scene
    );
    this.GenerateReflectionProbe(
      gSphere,
      Color3.Green(),
      [torusKnot, bSphere, ySphere, mirror],
      scene
    );

    // 动画
    scene.registerBeforeRender(() => {
      ySphere.rotation.y += 0.01;
      bSphere.rotation.y += 0.01;
      gSphere.rotation.y += 0.01;
    });
  }

  // 生成反射探针
  GenerateReflectionProbe(
    root: Mesh,
    color: Color3,
    meshes: Mesh[],
    scene: Scene
  ) {
    const material = new StandardMaterial("satelliteMaterial" + root.name);
    material.diffuseColor = color;
    root.material = material;

    // 创建反射探针
    const reflectionProbe = new ReflectionProbe(
      "statelliteProbe" + root.name,
      512,
      scene
    );
    reflectionProbe.renderList!.push(...meshes); //设置反射对象
    material.reflectionTexture = reflectionProbe.cubeTexture; //设置反射贴图
    // 设置反射贴图参数
    material.reflectionFresnelParameters = new FresnelParameters({
      bias: 0.02,
    });
    reflectionProbe.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
    reflectionProbe.attachToMesh(root); //将反射探针附加到模型上
  }

  AddFog(scene: Scene) {
    scene.fogMode = Scene.FOGMODE_LINEAR; //设置雾效模式
    scene.fogColor = Color3.FromHexString(scene.clearColor.toHexString(true)); //设置雾效颜色
    scene.fogStart = 20; //设置雾效开始距离
    scene.fogEnd = 50; //设置雾效结束距离
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
}
