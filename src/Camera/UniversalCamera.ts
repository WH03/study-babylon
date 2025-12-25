/* 
    UniversalCamera 通用相机：适合第一人称射击类游戏的首选配置，兼容所有键盘、鼠标、、触摸屏和游戏手柄。适用于2D、3D、VR、AR场景。
*/
import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  UniversalCamera,
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
    coordinate.ShowAxis(5);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    scene.useRightHandedSystem = true;
    /* 
    UniversalCamera 通用相机：
      参数：   
        name:相机名称
        position:相机位置
        scene?:场景
    */
    const universalCamera = new UniversalCamera(
      "universalCamera",
      new Vector3(3, 10, 20)
    );
    universalCamera.setTarget(Vector3.Zero()); //设置相机目标点

    universalCamera.inputs.addMouseWheel(); //添加鼠标滚轮(默认状态下操作滚轮是不响应的)
    universalCamera.attachControl(canvas, true);

    this.CreateLight(); //创建光源

    this.CreateMesh();
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
}
