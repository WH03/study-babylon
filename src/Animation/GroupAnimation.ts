import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  PointLight,
  StandardMaterial,
  Color3,
  Animation,
  AnimationGroup,
} from "@babylonjs/core";

import Coordinate from "@/components/Coordinate";
import { AdvancedDynamicTexture, Button, StackPanel } from "@babylonjs/gui/2D";

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
    const camera = new ArcRotateCamera("camera", 0, 0.8, 100, Vector3.Zero());
    camera.attachControl(canvas, true);
    this.CreateLigtht(); //创建光源

    this.CreateMesh(scene); //创建网格

    return scene;
  }

  CreateLigtht() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
    const pointLight = new PointLight("pointLight", new Vector3(0, 100, 100));
  }
  //创建物体
  CreateMesh(scene: Scene): void {
    const material1 = new StandardMaterial("texture1");
    material1.diffuseColor = new Color3(0, 1, 0);

    const box1 = MeshBuilder.CreateBox("box", { size: 10 }, this.scene);
    box1.position = new Vector3(-20, 0, 0);
    box1.material = material1;

    const box2 = MeshBuilder.CreateBox("box", { size: 10 }, this.scene);
    box2.position = new Vector3(20, 0, 0);

    // 缩放动画
    const scalingAnimation = new Animation(
      "scalingAnimation",
      "scaling.x",
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    const scalingKeys = [
      { frame: 0, value: 1 },
      { frame: 20, value: 0.2 },
      { frame: 100, value: 1 },
    ];
    scalingAnimation.setKeys(scalingKeys); //设置动画关键帧
    box1.animations.push(scalingAnimation); //添加动画

    // 旋转动画
    const rotationAnimation = new Animation(
      "rotationAnimation",
      "rotation.y",
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const rotationKeys = [
      { frame: 0, value: 0 },
      { frame: 40, value: Math.PI },
      { frame: 80, value: 0 },
    ];
    rotationAnimation.setKeys(rotationKeys);
    box2.animations.push(rotationAnimation);

    // 组合动画
    const groupAnimation = new AnimationGroup("groupAnimation");
    groupAnimation.addTargetedAnimation(scalingAnimation, box1);
    groupAnimation.addTargetedAnimation(rotationAnimation, box1);
    groupAnimation.addTargetedAnimation(rotationAnimation, box2);
    groupAnimation.normalize(0, 100); //设置动画时间
    // groupAnimation.play(true); //开始动画

    // UI
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI"); //创建一个全屏UI
    const panel = new StackPanel(); //创建一个面板
    panel.isVertical = false; //设置面板为垂直布局
    panel.verticalAlignment = StackPanel.VERTICAL_ALIGNMENT_BOTTOM; //设置面板垂直对齐方式
    advancedDynamicTexture.addControl(panel); //将面板添加到UI中

    // 添加按钮
    const addButton = (text: string, callback: () => void) => {
      const button = Button.CreateSimpleButton("button", text);
      button.width = "120px";
      button.height = "40px";
      button.color = "white";
      button.background = "green";
      button.paddingLeft = "10px";
      button.paddingRight = "10px";
      button.onPointerUpObservable.add(() => {
        callback();
      });
      panel.addControl(button);
    };

    addButton("开始动画", () => {
      groupAnimation.play(true);
    });
    addButton("暂停动画", () => {
      groupAnimation.pause(); //暂停动画
    });
    addButton("停止动画", () => {
      groupAnimation.stop(); //停止动画
      groupAnimation.reset(); //重置动画
    });
  }
}
