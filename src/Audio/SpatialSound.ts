import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  CreateSoundAsync,
  CreateAudioEngineAsync,
  CreateSoundBufferAsync,
  FreeCamera,
  StandardMaterial,
  Color3,
  Camera,
  Sound,
} from "@babylonjs/core";
export default class BasicScene {
  engine: Engine;
  scene: Scene;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = this.CreateScene(canvas);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    // 环境
    // scene.gravity = new Vector3(0, -0.98, 0);
    // scene.collisionsEnabled = true;
    // const camera = new FreeCamera("camera", new Vector3(0, 5, 0)); //创建相机
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      8,
      Vector3.Zero()
    );
    camera.attachControl(canvas, true);

    // camera.checkCollisions = true;
    // camera.applyGravity = true;
    // camera.ellipsoid = new Vector3(1, 1, 1);

    this.CreateLigtht(); //创建光源
    this.CreateMesh(); //创建物体
    this.InitAudio(); //初始化音频
    return scene;
  }

  CreateLigtht() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
    const directionalLight = new HemisphericLight(
      "directionalLight",
      new Vector3(0, -5, 2),
      this.scene
    );
  }
  //创建物体
  CreateMesh(): void {
    const pos1 = new Vector3(6, 0, 0);
    const pos2 = new Vector3(-10, 0, 0);
    const pos3 = new Vector3(0, 0, 10);
    // 创建平面
    const ground = MeshBuilder.CreateGround("ground", {
      width: 60,
      height: 60,
    });
    // ground.checkCollisions = true;//开启碰撞检测
    const groundMaterial = new StandardMaterial("groundMaterial");
    groundMaterial.diffuseColor = Color3.Gray(); // 设置材质颜色
    groundMaterial.backFaceCulling = false;
    ground.material = groundMaterial; // 将材质应用到物体上
    ground.position = Vector3.Zero();

    // 创建球体材质
    const phereMaterial = new StandardMaterial("sphereMaterial");
    phereMaterial.diffuseColor = Color3.Yellow(); // 设置材质颜色
    phereMaterial.alpha = 0.3; // 设置透明度
    phereMaterial.backFaceCulling = false; // 关闭背面剔除

    // 创建球体
    const sphere1 = MeshBuilder.CreateSphere(
      "sphere1",
      { segments: 20, diameter: 5 },
      this.scene
    );
    sphere1.material = phereMaterial; // 将材质应用到物体上
    sphere1.position = pos1;

    const sphere2 = MeshBuilder.CreateSphere(
      "sphere2",
      { segments: 20, diameter: 20 },
      this.scene
    );
    sphere2.material = phereMaterial; // 将材质应用到物体上
    sphere2.position = pos2;

    const sphere3 = MeshBuilder.CreateSphere(
      "sphere3",
      { segments: 20, diameter: 6 },
      this.scene
    );
    sphere3.material = phereMaterial; // 将材质应用到物体上
    sphere3.position = pos3;
  }
  // 初始化音频
  async InitAudio() {
    const pos1 = new Vector3(6, 0, 0);
    const pos2 = new Vector3(-10, 0, 0);
    const pos3 = new Vector3(0, 0, 10);

    const audioEngine = await CreateAudioEngineAsync();
    await audioEngine.unlockAsync();
    const music1 = await CreateSoundAsync(
      "violons11",
      "/sounds/violons11.wav",
      {
        autoplay: true,
        loop: true,
        spatialEnabled: true,
      }
    );
    music1.spatial.position = pos1;
    music1.spatial.maxDistance = 10;

    const music2 = await CreateSoundAsync(
      "violons18",
      "/sounds/violons18.wav",
      {
        autoplay: true,
        loop: true,
        spatialEnabled: true,
      }
    );
    music2.spatial.position = pos2;

    const music3 = await CreateSoundAsync(
      "cellolong",
      "/sounds/cellolong.wav",
      {
        autoplay: true,
        loop: true,
        spatialEnabled: true,
      }
    );
    music3.spatial.position = pos3;
    music3.spatial.maxDistance = 10; //设置最大距离
  }
}
