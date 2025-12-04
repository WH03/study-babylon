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
    this.CreateLight(); //创建光源
    this.CreateMesh(); //创建物体
    this.InitAudio(); //初始化音频
    return scene;
  }

  CreateLight() {
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
  async InitAudio() {
    // 创建箱子材质
    const boxMaterial = new StandardMaterial("boxMaterial");
    boxMaterial.diffuseTexture = new Texture("/images/crate.png");
    // 创建一个立方体
    const box = MeshBuilder.CreateBox("box");
    box.material = boxMaterial;

    const audioEngine = await CreateAudioEngineAsync();
    await audioEngine.unlockAsync();
    // 创建音频
    const music = await CreateSoundAsync("bounce", "/sounds/cellolong.wav", {
      // volume: 0.1,
      autoplay: true,
      loop: true,
      spatialEnabled: true,
    });
    music.spatial.attach(box);

    // 设置动画
    let alpha = 0;
    const r = 50;
    this.scene.registerBeforeRender(() => {
      box.position = new Vector3(r * Math.cos(alpha), 0, r * Math.sin(alpha));
      alpha += 0.01;
    });
  }
}
