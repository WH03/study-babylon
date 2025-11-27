import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  CreateSoundAsync,
  CreateAudioEngineAsync,
  StandardMaterial,
  Color3,
  Texture,
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

    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      8,
      Vector3.Zero()
    );
    camera.attachControl(canvas, true);
    this.CreateLigtht(); //创建光源
    this.CreateMesh(); //创建物体
    this.InitAudio(camera); //初始化音频
    return scene;
  }

  CreateLigtht() {
    const light = new HemisphericLight(
      "light",
      new Vector3(0, 1, 0),
      this.scene
    );
  }
  //创建物体
  CreateMesh(): void {
    const groundMaterial = new StandardMaterial("groundMaterial");
    groundMaterial.diffuseColor = Color3.Yellow();
    groundMaterial.backFaceCulling = true; //背面剔除

    const ground = MeshBuilder.CreateGround("ground", {
      width: 600,
      height: 600,
    });
    ground.position.y = -0.5;
    ground.material = groundMaterial;
  }
  // 初始化音频
  async InitAudio(camera: ArcRotateCamera) {
    // 创建箱子材质
    const boxMaterial = new StandardMaterial("boxMaterial");
    boxMaterial.diffuseTexture = new Texture("/images/crate.png");
    // 创建一个立方体
    const box = MeshBuilder.CreateBox("box");
    box.material = boxMaterial;

    //cylinder
    const cylinder = MeshBuilder.CreateCylinder("cylinder", {
      height: 1, //高度
      diameterTop: 0, //顶部直径
      diameterBottom: 1, //底部直径
      tessellation: 15, //边数
      subdivisions: 1, //细分
    });
    cylinder.parent = box;
    cylinder.position = new Vector3(0.5, 0, 0);
    cylinder.rotation.z = Math.PI / 2;

    const cylinderMaterial = new StandardMaterial("cylinderMaterial");
    cylinderMaterial.diffuseColor = Color3.Green();
    cylinderMaterial.alpha = 0.5;

    //
    const h = 30,
      innerAngle = 45,
      outerAngle = 90;
    const cy1 = MeshBuilder.CreateCylinder("cylinder1", {
      height: h, //高度
      diameterTop: 0, //顶部直径
      diameterBottom: 2 * h * Math.tan((Math.PI * outerAngle) / 360), //底部直径
      tessellation: 20, //边数
      subdivisions: 1, //细分
    });
    cy1.material = cylinderMaterial;
    cy1.parent = box;
    cy1.position = new Vector3(h / 2.0, 0, 0);
    cy1.rotation.z = Math.PI / 2;

    const cy2 = MeshBuilder.CreateCylinder("cylinder2", {
      height: h, //高度
      diameterTop: 0, //顶部直径
      diameterBottom: 2 * h * Math.tan((Math.PI * innerAngle) / 360), //底部直径
      tessellation: 20, //边数
      subdivisions: 1, //细分
    });
    cy2.material = cylinderMaterial;
    0;
    cy2.parent = box;
    cy2.position = new Vector3(h / 2.0, 0, 0);
    cy2.rotation.z = Math.PI / 2;

    const audioEngine = await CreateAudioEngineAsync();
    await audioEngine.unlockAsync();
    // 创建音频
    const music = await CreateSoundAsync("bounce", "/sounds/violons11.wav", {
      // volume: 0.3,
      autoplay: true,
      loop: true,
      spatialEnabled: true,
    });
    music.spatial.rolloffFactor = 1; //衰减因子
    music.spatial.coneInnerAngle = innerAngle;
    music.spatial.coneOuterAngle = outerAngle;
    music.spatial.distanceModel = "linear";
    music.spatial.attach(box);

    // 设置动画
    let alpha = 0;
    const r = 30;
    this.scene.registerBeforeRender(() => {
      camera.position = new Vector3(
        r * Math.cos(alpha),
        0,
        r * Math.sin(alpha)
      );
      alpha += 0.01;
    });
  }
}
