import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import * as GUI from "@babylonjs/gui";

import Coordinate from "@/components/Coordinate";
import {
  AdvancedDynamicTexture,
  Control,
  MultiLine,
} from "@babylonjs/gui/2D";

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
    scene.useRightHandedSystem = true;
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 4,
      30,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 30; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateLight(); //创建光源
    let mesh = this.CreateMeshes(); //创建物体
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
  }
  // 创建物体
  CreateMeshes() {
    const positions = [
      new Vector3(-6, 0, 0),
      new Vector3(-4, 0, 2),
      new Vector3(-2, -6, 0),
      new Vector3(0, 0, 0),
      new Vector3(2, 2, 0),
      new Vector3(4, 4, 8),
      new Vector3(6, 0, -4),
    ];
    const spheres = positions.map((pos, index) => {
      const sphere = MeshBuilder.CreateSphere(`sphere${index}`, {
        diameter: 1,
      });
      sphere.position = pos;
      return sphere;
    });
    this.CreateLine(spheres);
  }
  // 创建GUI
  CreateLine(mesh: Mesh[]) {
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // 创建按钮
    const button = GUI.Button.CreateSimpleButton("Button", "一个按钮");
    button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    button.width = "100px";
    button.height = "30px";
    button.left = "10%";
    button.top = "30px";
    button.color = "white";
    button.cornerRadius = 10;
    button.background = "green";

    advancedDynamicTexture.addControl(button);

    // 创建多行线
    const multiLine = new MultiLine();
    multiLine.lineWidth = 3;
    multiLine.color = "skyblue";
    multiLine.dash = [10, 10];
    multiLine.add(button);
    multiLine.add(...mesh);
    advancedDynamicTexture.addControl(multiLine);
  }
}
