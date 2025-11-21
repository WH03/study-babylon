import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  SpotLight,
  Color3,
  Mesh,
  StandardMaterial,
} from "babylonjs";

import "babylonjs-inspector";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = this.CreateScene(canvas);
    this.CreateMesh();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);

    // 打开调试层
    scene.debugLayer.show();

    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      50,
      Vector3.Zero()
    );
    camera.attachControl(canvas, true);
    const hemisphericLight = new HemisphericLight(
      "light",
      new Vector3(0, 50, 0),
      scene
    );
    hemisphericLight.intensity = 0.5;

    return scene;
  }

  //创建物体
  CreateMesh(): void {
    // 创建点光源
    /* 
    SpotLight:点光源
    参数1：名称
    参数2：位置
    参数3：方向
    参数4：角度
    参数5：距离
    参数6：场景
  */
    const sportLight = new SpotLight(
      "spotLight",
      new Vector3(0, 10, 0),
      new Vector3(0, -1, 0),
      Math.PI,
      1,
      this.scene
    );
    sportLight.diffuse = Color3.Yellow();
    // 创建一个球体
    const lampShape = [];
    for (let i = 0; i < 20; i++) {
      lampShape.push(
        new Vector3(
          Math.cos((i * Math.PI) / 10),
          Math.sin((i * Math.PI) / 10),
          0
        )
      );
    }
    lampShape.push(lampShape[0]);

    //创建形状
    const lampPath = [];
    lampPath.push(new Vector3(0, 0, 0));
    lampPath.push(new Vector3(0, 10, 0));
    for (let i = 0; i < 20; i++) {
      lampPath.push(
        new Vector3(
          1 + Math.cos(Math.PI - (i * Math.PI) / 40),
          10 + Math.sin(Math.PI - (i * Math.PI) / 40),
          0
        )
      );
    }
    lampPath.push(new Vector3(3, 11, 0));

    // 创建一个灯杆
    const lamp = MeshBuilder.ExtrudeShape("lamp", {
      cap: Mesh.CAP_END,
      shape: lampShape,
      path: lampPath,
      scale: 0.5,
    });
    // 创建灯泡
    const bulb = MeshBuilder.CreateSphere("bulb", {
      diameterX: 1.5,
      diameterZ: 0.8,
    });
    bulb.position = new Vector3(2, 10.5, 0);

    // 创建材质
    const yellowMat = new StandardMaterial("yellowMat");
    yellowMat.emissiveColor = Color3.Yellow();
    bulb.material = yellowMat;

    const ground = MeshBuilder.CreateGround("ground", {
      width: 50,
      height: 50,
    });
  }
}
