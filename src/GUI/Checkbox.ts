import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ImportMeshAsync,
  Mesh,
  AbstractMesh,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";
import {
  AdvancedDynamicTexture,
  Checkbox,
  Control,
  InputText,
  StackPanel,
  TextBlock,
} from "@babylonjs/gui/2D";

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
      30,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 30; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateLight(); //创建光源
    this.CreateMeshes(camera); //创建物体

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
  async CreateMeshes(camera: ArcRotateCamera) {
    let models = await ImportMeshAsync("/Meshes/skull.babylon", this.scene);
    let skull = models.meshes[0];
    skull.scaling = new Vector3(0.1, 0.1, 0.1);
    camera.target = skull.position; //设置相机目标
    this.CreateGUI(skull); //创建GUI
  }
  // 创建GUI
  async CreateGUI(skull: AbstractMesh) {
    // 创建高级动态纹理
    const advancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI(
      "advancedDynamicTexture"
    );
    // 创建面板
    const panel = new StackPanel();
    advancedDynamicTexture.addControl(panel);

    panel.width = "200px";
    panel.isVertical = false; //设置面板为垂直布局
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

    // 创建复选框
    const checkbox = new Checkbox();
    checkbox.width = "20px";
    checkbox.height = "20px";
    checkbox.isChecked = true;
    checkbox.color = "green";
    checkbox.onIsCheckedChangedObservable.add((value) => {
      if (skull) {
        skull.useVertexColors = value;
      }

      console.log("@@ skull.useVertexColors", skull.useVertexColors);
    });
    panel.addControl(checkbox);

    // 创建文本
    const text = new TextBlock();
    text.text = "复选框";
    text.color = "white";
    text.height = "30px";
    text.width = "80px";
    text.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.addControl(text);
  }
}
function ImportMesh(arg0: string, scene: Scene) {
  throw new Error("Function not implemented.");
}
