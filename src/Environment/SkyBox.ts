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
  CreateMesh(): void {
    const box = MeshBuilder.CreateBox("box", { size: 1 }, this.scene);
    const material = new StandardMaterial("material");
    material.ambientColor = new Color3(0.5, 0.5, 0.3);
    box.material = material;
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

  CreateSkyBox(scene: Scene): void {
    const skyBox = MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
    const skyBoxMaterial = new StandardMaterial("skyBoxMaterial");
    skyBoxMaterial.backFaceCulling = false; //设置材质是否进行背面剔除
    skyBoxMaterial.reflectionTexture = new CubeTexture(
      "/textures/skybox/",
      scene,
      ["px.jpg", "py.jpg", "pz.jpg", "nx.jpg", "ny.jpg", "nz.jpg"]
    );
    // 设置天空盒的纹理坐标模式
    skyBoxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyBoxMaterial.diffuseColor = new Color3(0, 0, 0);//设置漫反射颜色
    skyBoxMaterial.specularColor = new Color3(0, 0, 0);//设置镜面反射颜色
    skyBox.material = skyBoxMaterial;
  }
}
