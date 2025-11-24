import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  ImportMeshAsync,
  DirectionalLight,
  Mesh,
  ShadowGenerator,
} from "@babylonjs/core";
import "@babylonjs/loaders"; // 新版加载器（支持 glb/babylon 等格式）
import "@babylonjs/inspector";

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
    this.CreateGround(); //创建地面

    const directionalLight = this.CreateLigtht(); //创建光源
    const shadowGenerator = new ShadowGenerator(1024, directionalLight);
    this.ImportMeshes(shadowGenerator); //导入模型
    return scene;
  }

  // 创建光源
  CreateLigtht(): DirectionalLight {
    const directionalLight = new DirectionalLight(
      "directionalLight",
      new Vector3(0, -1, 1)
    );
    directionalLight.position = new Vector3(0, 15, -30);
    return directionalLight;
  }
  // 创建地面
  CreateGround(): Mesh {
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 100, height: 100, subdivisions: 1 },
      this.scene
    );
    ground.receiveShadows = true; //接收阴影
    return ground;
  }

  //导入模型
  async ImportMeshes(shadowGenerator: ShadowGenerator) {
    let modelResult = await ImportMeshAsync("/models/Dude.babylon", this.scene);
    modelResult.meshes[0].position = new Vector3(0, 0, 0);
    modelResult.meshes[0].scaling = new Vector3(0.2, 0.2, 0.2);
    //添加阴影投射者
    shadowGenerator.addShadowCaster(modelResult.meshes[0], true);
    // 动画
    this.scene.beginAnimation(modelResult.skeletons[0], 0, 100, true);
  }
}
