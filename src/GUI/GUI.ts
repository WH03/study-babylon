import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/inspector";
import * as GUI from "@babylonjs/gui";

// import Coordinate from "@/components/Coordinate";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = this.CreateScene(canvas);

    // const coordinate = new Coordinate(this.scene);
    // coordinate.ShowAxis(10);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    scene.useRightHandedSystem = true;
    scene.debugLayer.show();
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
    // camera.attachControl(canvas, true);
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateLight(); //创建光源
    this.CreateMesh();
    this.CreateGUI();

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
  }

  CreateGUI() {
    // GUI
    const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    // Globals

    const colorPanel = "#505050";
    const colorPanelBackground = "#50505025";
    // PANEL
    const panel = new GUI.Rectangle();
    panel.isPointerBlocker = true;
    panel.width = "40%";
    panel.height = "80%";
    panel.background = colorPanelBackground;
    panel.color = colorPanel;
    panel.thickness = 1;
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    ui.addControl(panel);

    // PANEL CONTAINER
    const panelContainer = new GUI.StackPanel();
    panelContainer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panel.addControl(panelContainer);

    // Title
    panelContainer.addControl(this.TextTitle("Babylon JS Repository Stats"));
    panelContainer.addControl(this.Space(this.Vw(0.5)));
    // panelContainer.addControl(textTitle("Top 100 contributors"));
    panelContainer.addControl(this.Space(this.Vw(0.5)));

    // Stats Container && Toggle Button
    const statsContainer = new GUI.StackPanel();
    statsContainer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

    panelContainer.addControl(statsContainer);

    // BUILD TOP STATS
    // 创建一个文本块来显示标题
    this.BuildStats(statsContainer);
  }
  BuildStats(container: GUI.StackPanel) {
    // Clear
    container.clearControls();
    const mainHeight = window.innerHeight;
    // ScrollViewer
    const top = this.GetTop(container);
    const height = mainHeight - top - 100;
    const sv = new GUI.ScrollViewer();
    sv.barSize = this.Vw(0.6);
    sv.thickness = 0;
    sv.color = "grey";
    sv.height = height + "px";
    container.addControl(sv);

    // Container (Scrollviewer wants a single child)
    const subContainer = new GUI.StackPanel();
    subContainer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    subContainer.width = 0.99;
    sv.addControl(subContainer);

    // Fill
    const rect = new GUI.Rectangle();
    rect.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    rect.height = this.Vw(6) + "px";
    rect.thickness = 0;
    // ID
    const id = new GUI.TextBlock();
    id.textVerticalAlignment = 0;
    id.textHorizontalAlignment = 0;
    id.top = "50px";
    id.left = this.Vw(5) + "px";
    id.text = `6666`;
    id.color = "white";
    id.fontSize = this.Vw(1);
    rect.addControl(id);
    subContainer.addControl(rect);
  }

  TextTitle(text: string) {
    const title = new GUI.TextBlock();
    title.height = this.Vw(2.75) + "px";
    title.text = text;
    title.color = "white";
    title.fontSize = this.Vw(1.3);
    return title;
  }
  // Space with thin line
  Space(size: string | number) {
    const rect = new GUI.Rectangle();
    rect.height = size + "px";
    rect.thickness = 0;
    const line = new GUI.Rectangle();
    line.height = "1px";
    line.thickness = 0;
    const colorPanel = "#505050"; // Color of the line
    line.background = colorPanel;
    rect.addControl(line);
    return rect;
  }

  // HTML5 Equivalent of vw
  Vw(value: number) {
    const mainWidth = window.innerWidth;
    return (value / 100) * mainWidth;
  }
  // Compute the top position of this container
  GetTop(container: GUI.StackPanel) {
    let top = 0;
    container.parent!.children.forEach(function (c) {
      if (c != container) {
        top += c.heightInPixels;
      }
    });
    container.children.forEach(function (c) {
      top += c.heightInPixels;
    });
    return top;
  }
}
