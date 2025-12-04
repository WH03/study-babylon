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

import * as GUI from "@babylonjs/gui"; // GUI

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
    let isPlaying = false;
    const soundArr = [
      [0.0, 3.0],
      [5.1, 6.6],
      [12.0, 1.6],
      [14.0, 9.2],
      [23.0, 7.9],
      [31.0, 2.8],
    ];
    const audioEngine = await CreateAudioEngineAsync();
    await audioEngine.unlockAsync();
    const sounds = await CreateSoundAsync("sound", "/sounds/6sounds.mp3");
    // sounds.play();
    sounds.onEndedObservable.add(() => {
      isPlaying = false;
      console.log("播放结束");
    });

    // 创建UI
    const advancedDynamicTexture =
      GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const panel = new GUI.StackPanel();
    panel.width = "220px";
    panel.fontSize = "14px";
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    advancedDynamicTexture.addControl(panel);

    // 创建按钮
    const button = GUI.Button.CreateSimpleButton("button", "播放完整音频");
    button.paddingTop = "10px";
    button.width = "150px";
    button.height = "40px";
    button.color = "white";
    button.background = "green";
    button.onPointerClickObservable.add(() => {
      if (!isPlaying) {
        isPlaying = true;
        sounds.play();
      }
    });
    panel.addControl(button);

    for (let i = 0; i < soundArr.length; i++) {
      const button = GUI.Button.CreateSimpleButton(
        `button${i}`,
        `播放${i + 1}音频`
      );
      button.paddingTop = "10px";
      button.width = "150px";
      button.height = "40px";
      button.color = "white";
      button.background = "green";
      button.onPointerClickObservable.add(() => {
        if (!isPlaying) {
          isPlaying = true;
          sounds.play({
            loop: false, //不循环
            loopStart: soundArr[i][0], //循环开始时间;
            loopEnd: soundArr[i][1], //循环结束时间
            startOffset: soundArr[i][0], //开始播放的偏移量
          });
        }
      });

      panel.addControl(button);
    }
  }
}
