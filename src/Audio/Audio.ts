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
    const box = MeshBuilder.CreateBox("box", { size: 1 }, this.scene);
    box.position.y = 0.5;
    const ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6 });
  }
  // 初始化音频
  async InitAudio() {
    let volume = 0.1; //音量
    let playbackRate = 0.5; //播放速度
    const audioEngine = await CreateAudioEngineAsync();
    await audioEngine.unlockAsync();
    const gunshot = await CreateSoundAsync("sound", "/sounds/gunshot.wav", {
      playbackRate,
      volume,
      loop: false, // 不循环（单次音效）
      autoplay: false, // 不自动播放（符合浏览器政策）
    });
    console.log("gunshot", gunshot);
    // onEndedObservable 是音频实例的内置可观察对象，当声音播放完成（非循环、未暂停 / 停止）时，会自动触发所有绑定的回调。
    gunshot.onEndedObservable.add(() => {
      console.log("gunshot 结束");
      if (volume < 1) {
        volume += 0.5;
        gunshot.setVolume(volume);
      }
      playbackRate += 0.5;
      gunshot.playbackRate = playbackRate;
      console.log("volume:", volume, "playbackRate:", playbackRate);
    });

    window.addEventListener("mousedown", (event) => {
      if (event.button === 0) {
        // 0 表示鼠标左键
        gunshot.play(); // 播放预加载的音频对象
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        //左键
        gunshot.play();
      }
    });
  }
}
