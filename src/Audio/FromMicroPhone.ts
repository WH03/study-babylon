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
  CreateSoundSourceAsync,
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
    this.InitAudio(); //初始化音频
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
    const box = MeshBuilder.CreateBox("box", { size: 1 }, this.scene);
    box.position.y = 0.5;
    const ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6 });
  }
  // 初始化音频
  async InitAudio() {
    const audioContext = new AudioContext(); // 创建音频上下文
    const audioEngine = await CreateAudioEngineAsync({ audioContext });
    await audioEngine.unlockAsync();
    const audioNode = new OscillatorNode(audioContext, {
      frequency: 440,
      type: "sine",
    });
    await CreateSoundSourceAsync("sine", audioNode, { volume: 0.1 });
    audioNode.start();
  }
}
