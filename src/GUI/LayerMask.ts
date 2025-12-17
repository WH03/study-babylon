import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  ImportMeshAsync,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";
import {
  AdvancedDynamicTexture,
  Checkbox,
  Control,
  StackPanel,
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
    camera.layerMask = 1;
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 30; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度

    const camera2 = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 4,
      15,
      Vector3.Zero()
    );
    camera2.layerMask = 2;

    scene.activeCameras = [camera]; //激活相机
    scene.activeCamera!.attachControl(canvas, true); //激活相机

    this.CreateLight(); //创建光源
    this.CreateMeshes(); //创建物体
    this.CreateGUI(scene, camera, camera2); //创建GUI
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
  async CreateMeshes() {
    let models = await ImportMeshAsync("/Meshes/Ducky_2.glb", this.scene);
    let duky = models.meshes[1]; //获取模型
    duky.layerMask = 1;
  }
  // 创建GUI
  CreateGUI(scene: Scene, camera: ArcRotateCamera, camera2: ArcRotateCamera) {
    // 创建高级动态纹理
    const advancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI(
      "advancedDynamicTexture"
    );
    // 创建面板
    const panel = new StackPanel();
    advancedDynamicTexture.addControl(panel);

    panel.width = "300px";
    panel.isVertical = true; //设置面板为垂直布局
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

    // 创建复选框
    const checkbox = new Checkbox();
    checkbox.width = "20px";
    checkbox.height = "20px";
    checkbox.isChecked = true;
    checkbox.color = "green";
    checkbox.onIsCheckedChangedObservable.add((value) => {
      if (value) {
        // 让相机1和相机2交替激活
        scene.activeCameras = [camera]; // 设置激活的相机1
      } else {
        scene.activeCameras = [camera2]; // 设置激活的相机2
      }
    });
    panel.addControl(checkbox);

    // 创建标题
    const header = Checkbox.AddHeader(
      checkbox,
      "测试layerMask使用,相机1和相机2交替激活",
      "300px",
      {
        isHorizontal: true,
        controlFirst: true,
      }
    );
    header.width = "300px";
    header.height = "20px";
    header.color = "skyblue";
    header.fontSize = 14;
    header.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.addControl(header);
  }
}
