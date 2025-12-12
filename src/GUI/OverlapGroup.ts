import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";
import { AdvancedDynamicTexture, Button, Line } from "@babylonjs/gui/2D";

export default class BasicScene {
  engine: Engine;
  scene: Scene;

  _buttonArr: Button[] = [];
  _advancedDynamicTexture!: AdvancedDynamicTexture; // 2D UI
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
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 4,
      10,
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
    // this.CreateGUI();
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
    this._advancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI(
      "advancedDynamicTexture"
    );
    this._CreateMeshAndBtn(1, 0, 0, 1); //创建物体1
    this._CreateMeshAndBtn(1.2, 0.1, 1, 1, 0); //创建物体2
    this._CreateMeshAndBtn(1.6, 0.4, 2, 1); //创建物体3
    this._CreateMeshAndBtn(2, 0.3, 3, 2); //创建物体4
    this._CreateMeshAndBtn(2, 1, 4, 2); //创建物体5
    this._CreateMeshAndBtn(0, 0, 5, undefined); //创建物体6

    // 在渲染之前调用
    this._advancedDynamicTexture.onBeginRenderObservable.add(() => {
      // this._advancedDynamicTexture.moveToNonOverlappedPosition(); //将重叠的UI元素移开
      // this._advancedDynamicTexture.moveToNonOverlappedPosition(1); //将重叠的UI元素移开
      this._advancedDynamicTexture.moveToNonOverlappedPosition(2); //将重叠的UI元素移开
    });
  }

  // 创建GUI
  private _CreateMeshAndBtn(
    x: number, //物体位置
    y: number, //物体位置
    i: number, //物体索引
    overlapGroup: number | undefined, //物体组
    overlapDeltaMultiplier: number = 1 //物体组
  ) {
    const sphere = MeshBuilder.CreateSphere(`sphere${i}`);
    sphere.position = new Vector3(x, y, 0);
    // 创建一个全屏UI
    const advancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI(
      "advancedDynamicTexture"
    );
    // 创建一个按钮
    const button = Button.CreateSimpleButton(`btn${i}`, `button-${i}`);
    button.widthInPixels = 80; //按钮宽度
    button.heightInPixels = 36; //按钮高度
    button.color = "#fff";
    button.background = "#000";
    button.fontWeight = "300";
    button.fontSizeInPixels = 16; //字体大小
    button.alpha = 0.8; //透明度
    button.cornerRadius = 4; //圆角
    button.thickness = 0; //边框宽度
    button.linkOffsetYInPixels = -60; //按钮位置偏移
    this._advancedDynamicTexture.addControl(button); //添加按钮到UI
    button.linkWithMesh(sphere); //将按钮与物体绑定

    // 重叠分组
    button.overlapGroup = overlapGroup; //物体组
    button.overlapDeltaMultiplier = overlapDeltaMultiplier; //物体组

    // 创建引线
    const line = new Line(`line_${i}`);
    line.lineWidth = 2;
    line.color = "#444";
    line.connectedControl = button;
    this._advancedDynamicTexture.addControl(line); //添加引线到UI

    line.linkWithMesh(sphere); //将引线与物体绑定
    line.y2 = 0; //引线位置偏移
    line.dash = [3, 3];
  }
}
