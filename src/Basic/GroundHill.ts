import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
  ImportMeshAsync,
} from "@babylonjs/core";

import "@babylonjs/loaders";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = this.CreateScene(canvas);
    this.CreateLight(); //创建光源
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      15,
      Vector3.Zero()
    );
    camera.attachControl(canvas, true);

    this.importMeshes();

    return scene;
  }

  // 创建光源
  CreateLight() {
    new HemisphericLight("light", new Vector3(0, 10, 0), this.scene);
  }

  //导入模型
  async importMeshes() {
    const groundMaterial = new StandardMaterial("groundMaterial");
    groundMaterial.diffuseTexture = new Texture(
      "https://assets.babylonjs.com/environments/villagegreen.png"
    );
    groundMaterial.diffuseTexture.hasAlpha = true; //开启透明

    const ground = MeshBuilder.CreateGround("ground", {
      width: 24,
      height: 24,
    });
    ground.material = groundMaterial;

    const largeGroundMaterial = new StandardMaterial("largeGroundMaterial");
    largeGroundMaterial.diffuseTexture = new Texture(
      "https://assets.babylonjs.com/environments/valleygrass.png"
    );
    // 加载地面
    const largeGround = MeshBuilder.CreateGroundFromHeightMap(
      "largeGround",
      "https://assets.babylonjs.com/environments/villageheightmap.png",
      {
        width: 150,
        height: 150,
        subdivisions: 20, // 分辨率,subdivisions越大,生成的地形越精细
        minHeight: 0,
        maxHeight: 10,
      }
    );
    largeGround.material = largeGroundMaterial;
    largeGround.position.y = -0.01;

    // 导入村庄模型
    ImportMeshAsync(
      "https://assets.babylonjs.com/meshes/valleyvillage.glb",
      this.scene
    );

  }
}
