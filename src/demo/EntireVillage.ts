// 新代码（正确）
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
  SpriteManager,
  Sprite,
  SpotLight,
} from "@babylonjs/core";
import "@babylonjs/loaders"; // 新版加载器（支持 glb/babylon 等格式）
import "@babylonjs/inspector"; // 新版调试器

import * as GUI from "@babylonjs/gui"; // GUI

import Particle from "@/components/Particles";
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
    scene.debugLayer.show();
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 1.5,
      Math.PI / 2.5,
      15,
      Vector3.Zero()
    );
    //限制相机上下旋转角度
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.attachControl(canvas, true);

    const hemisphereLight = this.CreateLight(); //创建光源
    this.ImportMeshes(); //导入模型

    this.CreateSkyBox(); //创建天空盒
    this.CreateSpriteTree(); //创建精灵树
    this.CreateSpriteUFO(); //创建精灵UFO
    this.CreateStreetLamp(); //创建路灯

    this.CreateGUI(hemisphereLight); //创建GUI
    // 添加粒子系统喷泉
    const particleSystem = new Particle(scene);

    return scene;
  }

  // 创建光源
  CreateLight() {
    const hemisphereLight = new HemisphericLight(
      "hemisphereLight",
      new Vector3(1, 10, 0),
      this.scene
    );
    hemisphereLight.intensity = 0.1;

    return hemisphereLight;
  }

  // 创建天空盒
  CreateSkyBox() {
    const skyBox = MeshBuilder.CreateBox("skyBox", { size: 1500 }, this.scene);
    // 设置天空盒跟随相机
    skyBox.infiniteDistance = true;

    const skyBoxMaterial = new StandardMaterial("skyBoxMaterila", this.scene);
    skyBoxMaterial.backFaceCulling = false; //关闭背面剔除，让我们能看到立方体的内侧
    // skyBoxMaterial.reflectionTexture = new CubeTexture(
    //   // "https://playground.babylonjs.com/textures/skybox",
    //   this.scene
    // );
    // 加载本地图片的两种方式：1.直接加载本地图片，2.加载本地图片的路径
    // 1、名字没有前缀的时候，默认是skybox/
    skyBoxMaterial.reflectionTexture = new CubeTexture(
      "/textures/skybox/",
      this.scene,
      ["px.jpg", "py.jpg", "pz.jpg", "nx.jpg", "ny.jpg", "nz.jpg"] // 六个方向的后缀
    );
    // 2、名字有前缀的时候，前缀+后缀
    // skyBoxMaterial.reflectionTexture = new CubeTexture(
    //   "/textures/skybox/skybox_", // 图片前缀（文件夹+文件名前缀）
    //   this.scene,
    //   ["px.jpg", "py.jpg", "pz.jpg", "nx.jpg", "ny.jpg", "nz.jpg"] // 六个方向的后缀
    // );
    skyBoxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyBoxMaterial.diffuseColor = new Color3(0, 0, 0); //漫反射颜色
    skyBoxMaterial.specularColor = new Color3(0, 0, 0); //镜面反射颜色

    skyBox.material = skyBoxMaterial;
  }
  // 创建精灵UFO
  CreateSpriteUFO() {
    const spriteManageUFO = new SpriteManager(
      "UFOManager",
      "/images/ufo.png",
      1,
      {
        width: 128,
        height: 76,
      },
      this.scene
    );
    const ufo = new Sprite("ufo", spriteManageUFO);
    ufo.position = new Vector3(0, 5, 0);
    ufo.width = 2;
    ufo.height = 1;
    //播放动画
    ufo.playAnimation(0, 16, true, 125); // 参数：开始帧，结束帧，是否循环，每秒帧数
  }

  // 创建精灵树
  CreateSpriteTree() {
    const spriteManagerTrees = new SpriteManager(
      "spriteManageTrees",
      "/images/palm.png",
      2000,
      { width: 512, height: 1024 },
      this.scene
    );

    // 创建精灵树
    for (let i = 0; i < 500; i++) {
      const tree = new Sprite("tree", spriteManagerTrees);
      tree.position = new Vector3(
        Math.random() * -30,
        0.5,
        Math.random() * 20 + 8
      );

      const tree2 = new Sprite("tree2", spriteManagerTrees);
      tree2.position = new Vector3(
        Math.random() * 25 + 7,
        0.5,
        Math.random() * -30 + 8
      );
    }
  }

  //导入模型
  async ImportMeshes() {
    const groundMaterial = new StandardMaterial("groundMaterial");
    groundMaterial.diffuseTexture = new Texture(
      // "https://assets.babylonjs.com/environments/villagegreen.png"
      "/images/villagegreen.png"
    );
    groundMaterial.diffuseTexture.hasAlpha = true; //开启透明

    const ground = MeshBuilder.CreateGround("ground", {
      width: 24,
      height: 24,
    });
    ground.material = groundMaterial;

    const largeGroundMaterial = new StandardMaterial("largeGroundMaterial");
    largeGroundMaterial.diffuseTexture = new Texture(
      // "https://assets.babylonjs.com/environments/valleygrass.png"
      "/images/valleygrass.png"
    );
    // 加载地面
    const largeGround = MeshBuilder.CreateGroundFromHeightMap(
      "largeGround",
      // "https://assets.babylonjs.com/environments/villageheightmap.png",
      "/images/villageheightmap.png",
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
    ImportMeshAsync("/models/valleyvillage.glb", this.scene);

    // 导入车模型
    ImportMeshAsync("/models/car.glb", this.scene).then(() => {
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

  // 创建路灯
  CreateStreetLamp() {
    ImportMeshAsync("/models/lamp.babylon", this.scene).then(() => {
      const lampLight = new SpotLight(
        "lampLight",
        Vector3.Zero(),
        new Vector3(0, -1, 0),
        0.8 * Math.PI,
        0.01,
        this.scene
      );
      lampLight.diffuse = Color3.Yellow();
      // 将点光源的父元素设置为灯泡
      lampLight.parent = this.scene.getMeshByName("bulb");

      const lamp = this.scene.getMeshByName("lamp")!;
      lamp.position = new Vector3(2, 0, 2);
      lamp.rotation = Vector3.Zero();
      lamp.rotation.y = -Math.PI / 4;

      let lamp1 = lamp.clone("lamp1", null)!;
      lamp1.position.x = -8;
      lamp1.position.z = 1.2;
      lamp1.rotation.y = Math.PI / 2;

      let lamp2 = lamp1.clone("lamp2", null)!;
      lamp2.position.x = -2.7;
      lamp2.position.z = 0.8;
      lamp2.rotation.y = -Math.PI / 2;

      let lamp3 = lamp.clone("lamp3", null)!;
      lamp3.position.z = -8;
    });
  }

  //创建gui
  CreateGUI(light: HemisphericLight) {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // 创建一个StackPanel
    const panel = new GUI.StackPanel();
    panel.width = "220px";
    panel.top = "0";
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT; //水平对齐方式
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP; //垂直对齐方式
    advancedTexture.addControl(panel);

    // 创建一个文本
    const header = new GUI.TextBlock();
    header.text = "Night to Day";
    header.color = "white";
    header.height = "30px";
    panel.addControl(header);

    // 创建一个滑块
    const slider = new GUI.Slider();
    slider.minimum = 0; //最小值
    slider.maximum = 1; //最大值
    slider.value = 0.1; //初始值
    slider.borderColor = "black"; //边框颜色
    slider.color = "white"; //滑块颜色
    slider.background = "black"; //背景颜色
    slider.height = "20px"; //高度
    slider.width = "200px"; //宽度

    slider.onValueChangedObservable.add((value) => {
      if (light) {
        light.intensity = value;
      }
    });
    panel.addControl(slider);
  }
}
