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
  Animation,
  CubeTexture,
  Color3,
} from "babylonjs";

import "babylonjs-loaders";

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
      30,
      Vector3.Zero()
    );
    //限制相机上下旋转角度
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.attachControl(canvas, true);
    this.importMeshes(); //导入模型

    this.CreateSkyBox(); //创建天空盒

    return scene;
  }

  // 创建光源
  CreateLight() {
    new HemisphericLight("light", new Vector3(0, 10, 0), this.scene);
  }

  // 创建天空盒
  CreateSkyBox() {
    const skyBox = MeshBuilder.CreateBox("skyBox", { size: 150 }, this.scene);

    const skyBoxMaterial = new StandardMaterial("skyBoxMaterila", this.scene);
    skyBoxMaterial.backFaceCulling = false; //关闭背面剔除
    skyBoxMaterial.reflectionTexture = new CubeTexture(
      "https://playground.babylonjs.com/textures/skybox",
      this.scene
    );
    skyBoxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyBoxMaterial.diffuseColor = new Color3(0, 0, 0); //漫反射颜色
    skyBoxMaterial.specularColor = new Color3(0, 0, 0); //镜面反射颜色

    skyBox.material = skyBoxMaterial;
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

    // 导入车模型
    ImportMeshAsync(
      "https://assets.babylonjs.com/meshes/car.glb",
      this.scene
    ).then(() => {
      const car = this.scene.getMeshByName("car")!;
      car.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
      car.position = new Vector3(-3, 0.16, 8);

      const carAanimation = new Animation(
        "carAnimation",
        "position.z",
        30,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE
      );

      const carKeys = [];
      carKeys.push(
        {
          frame: 0,
          value: 8,
        },
        {
          frame: 150,
          value: -7,
        },
        {
          frame: 200,
          value: -7,
        }
      );

      carAanimation.setKeys(carKeys);
      car.animations.push(carAanimation);
      this.scene.beginAnimation(car, 0, 200, true);
    });
  }
}
