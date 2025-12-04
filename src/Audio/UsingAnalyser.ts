import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  CreateSoundAsync,
  CreateAudioEngineAsync,
} from "@babylonjs/core";

// import Visualizer from "@c/Visualizer";
import Visualizer from "@/components/CreateVisualizer";

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
    new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
  }
  //创建物体
  CreateMesh(): void {
    const box = MeshBuilder.CreateBox("box", { size: 1 }, this.scene);
    box.position.y = 0.5;
    MeshBuilder.CreateGround("ground", { width: 6, height: 6 });
  }
  // 初始化音频
  async InitAudio() {
    let volume = 0.1; //音量
    const audioEngine = await CreateAudioEngineAsync();
    await audioEngine.unlockAsync();
    const music = await CreateSoundAsync("sound", "/sounds/bird.mp3", {
      volume,
      loop: true, // 不循环（单次音效）
      autoplay: true, // 不自动播放（符合浏览器政策）
      analyzerFFTSize: 1024,
      analyzerEnabled: true,
    });

    let analyzer = music.analyzer;

    new Visualizer(this.scene, analyzer);
  }
}
