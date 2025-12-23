import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  SpriteManager,
  Sprite,
  ActionManager,
  ExecuteCodeAction,
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
    // coordinate.ShowAxis(10);

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
      Math.PI / 2,
      Math.PI / 4,
      10,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 200; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    // camera.attachControl(canvas, true);
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机
    this.CreateLight(); //创建光源
    this.CreateMesh(); //创建物体

    this.CreateSpriteTree(scene); //创建精灵树
    this.CreateSpritePlayer(scene); //创建精灵小人
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
  }
  //创建物体
  CreateMesh(): void {
    const box = MeshBuilder.CreateBox("box", { size: 1 }, this.scene);
    box.position = new Vector3(0, 2, 0);
    box.actionManager = new ActionManager();
    box.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
        alert("box");
      })
    );
  }

  // 创建精灵
  CreateSpriteTree(scene: Scene) {
    const spriteNumber = 2000; //精灵数量
    // 精灵管理器
    const spriteManagerTree = new SpriteManager(
      "spriteManagerTree", //精灵管理器名称
      "/Events/palm.png", //精灵图片路径
      spriteNumber, //精灵数量
      800, //精灵宽度
      scene
    );
    // 具体精灵
    for (let i = 0; i < spriteNumber; i++) {
      const sprite = new Sprite(`sprite${i}`, spriteManagerTree);
      //随机位置
      sprite.position = new Vector3(
        Math.random() * 100 - 50,
        0,
        Math.random() * 100 - 50
      );

      //让一些树倒了
      if (Math.round(Math.random() * 5) == 0) {
        sprite.angle = Math.PI / 2; //精灵角度
        sprite.position.y = -0.3; //精灵位置
      }
    }
  }

  //   添加精灵小人
  CreateSpritePlayer(scene: Scene) {
    const spriteManagerPlayer = new SpriteManager(
      "spriteManagerPlayer",
      "/Events/player.png",
      2, //精灵数量
      64, //精灵宽度
      scene
    );
    spriteManagerPlayer.isPickable = true; //可拾取

    // 第一个小人
    const spritePlayer1 = new Sprite("spritePlayer1", spriteManagerPlayer);
    spritePlayer1.playAnimation(0, 40, true, 100); //播放动画
    spritePlayer1.position = new Vector3(1, 0.3, 0);
    spritePlayer1.size = 1; //精灵大小
    spritePlayer1.isPickable = true; //可拾取
    spritePlayer1.actionManager = new ActionManager();
    spritePlayer1.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
        alert("点击了小人"); //拾取精灵
      })
    );

    // 第二个小人
    const spritePlayer2 = new Sprite("spritePlayer2", spriteManagerPlayer);
    spritePlayer2.stopAnimation(); //停止动画
    spritePlayer2.cellIndex = 2; //精灵索引
    spritePlayer2.size = 1; //精灵大小
    spritePlayer2.position = new Vector3(0, 0.5, 0);
    spritePlayer2.invertU = true; //翻转
  }
}
