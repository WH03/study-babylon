import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Color3,
  DirectionalLight,
  StandardMaterial,
  CubeTexture,
  Texture,
  ImportMeshAsync,
  ActionManager,
  ExecuteCodeAction,
} from "@babylonjs/core";
import "@babylonjs/loaders"; // 新版加载器（支持 glb/babylon 等格式）
import Coordinate from "@/components/Coordinate";
import { AdvancedDynamicTexture, Control, TextBlock } from "@babylonjs/gui/2D";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  inputMap: any;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = this.CreateScene(canvas);
    this.inputMap = {};

    const coordinate = new Coordinate(this.scene);
    coordinate.ShowAxis(6);

    this.CreateSkyBox();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    // scene.useRightHandedSystem = true;
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2.5,
      10,
      Vector3.Zero()
    );
    // camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 30; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度

    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机
    this.CreateLigtht(); //创建光源
    this.CreateMesh(); //创建物体
    this.ImportMoldes(scene, camera); //导入模型
    this.CreateUI(); //创建UI
    this.AddEvents(scene); //添加事件
    return scene;
  }

  CreateLigtht() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0)
    );
    hemisphericLight.intensity = 0.6;
    hemisphericLight.specular = Color3.Black(); //设置光源的镜面反射颜色

    const directionalLight = new DirectionalLight(
      "directionalLight",
      new Vector3(0, -0.5, -1)
    );
    directionalLight.position = new Vector3(0, 5, 5);
  }

  CreateSkyBox() {
    const skyBox = MeshBuilder.CreateBox("skyBox", { size: 1000 });
    const skyBoxMaterial = new StandardMaterial("skyBoxMaterial"); //创建材质
    skyBoxMaterial.backFaceCulling = false; //禁用材质背面剔除
    skyBoxMaterial.reflectionTexture = new CubeTexture(
      "/textures/skybox2/skybox2_",
      this.scene,
      ["px.jpg", "py.jpg", "pz.jpg", "nx.jpg", "ny.jpg", "nz.jpg"] // 六个方向的
    );
    skyBoxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyBoxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyBoxMaterial.specularColor = new Color3(0, 0, 0);

    skyBox.material = skyBoxMaterial; //设置材质
  }

  //创建物体
  CreateMesh(): void {
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 50, height: 50, subdivisions: 4 },
      this.scene
    );
    ground.position.y = -0.5;
    const groundMaterial = new StandardMaterial("groundMaterial");
    groundMaterial.diffuseTexture = new Texture(
      "/Materials/wood.jpg",
      this.scene
    );
    // groundMaterial.diffuseTexture.uScale = 30;
    // groundMaterial.diffuseTexture.vScale = 30;
    groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
    ground.material = groundMaterial;
  }
  //导入模型
  async ImportMoldes(scene: Scene, camera: ArcRotateCamera): Promise<void> {
    const result = await ImportMeshAsync("/Meshes/HVGirl.glb", this.scene);
    const model = result.meshes[0];
    model.scaling.scaleInPlace(0.1); // 缩放模型,使其适应场景
    camera.target = model.position;
    // const sambaAnim = scene.getAnimationGroupByName("Samba");
    // // sambaAnim?.play();//播放动画
    // sambaAnim?.start(true, 1, sambaAnim.from, sambaAnim.to, false); //播放动画

    // 基本的角色参数
    const speed = 0.03; //角色的移动速度
    const speedBackWords = 0.01; //角色的后退速度
    const rotationSpeed = 0.1; //角色的旋转速度

    let animating = true;
    const walkAnim = scene.getAnimationGroupByName("Walking");
    const walkBackAnim = scene.getAnimationGroupByName("WalkingBack");
    const idleAnim = scene.getAnimationGroupByName("Idle");
    const sambaAnim = scene.getAnimationGroupByName("Samba");

    scene.onBeforeRenderObservable.add(() => {
      let keydown = false;
      if (this.inputMap["w"]) {
        //向前移动
        model.moveWithCollisions(model.forward.scaleInPlace(speed)); //向前移动
        keydown = true;
      }
      if (this.inputMap["s"]) {
        //向后移动
        model.moveWithCollisions(model.forward.scaleInPlace(-speedBackWords)); //向后移动
        keydown = true;
      }
      if (this.inputMap["a"]) {
        //向左旋转
        model.rotate(Vector3.Up(), rotationSpeed);
        keydown = true;
      }
      if (this.inputMap["d"]) {
        //向右旋转
        model.rotate(Vector3.Up(), -rotationSpeed);
        keydown = true;
      }
      if (this.inputMap["b"]) {
        keydown = true;
      }

      //按下任意键
      if (keydown) {
        //如果动画没有在播放
        if (!animating) {
          animating = true; //设置动画正在播放
          //向后移动
          if (this.inputMap["s"]) {
            walkBackAnim?.start(true,1.0, walkBackAnim.from,walkBackAnim.to,false);
          } else if (this.inputMap["b"]) {
            // samba
            sambaAnim?.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
          } else {
            walkAnim?.start(true, 1.0, walkAnim.from, walkAnim.to, false);
          }
        }
      } else {
        if (animating) {
          // 默认情况下，当没有按键按下时，会自动停止
          idleAnim?.start(true, 1.0, idleAnim.from, idleAnim.to, false);
          //   停止其他动画
          walkBackAnim?.stop();
          sambaAnim?.stop();
          walkAnim?.stop();
          animating = false; //设置动画停止
        }
      }
    });
  }

  CreateUI(): void {
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI"); // 创建全屏UI
    const textBlock = new TextBlock(); // 创建文本块
    textBlock.text = "Move w/ WASD keys, B for Samba, look with the mouse"; // 设置文本内容
    textBlock.color = "white"; // 设置文本颜色
    textBlock.fontSize = 16; // 设置文本大小
    textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT; // 设置文本水平对齐方式
    textBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM; // 设置文本垂直对齐方式
    advancedDynamicTexture.addControl(textBlock); // 将文本块添加到UI中
  }

  //  添加事件
  AddEvents(scene: Scene): void {
    scene.actionManager = new ActionManager(scene); // 创建动作管理器
    // 注册动作
    scene.actionManager.registerAction(
      // 注册按键按下事件
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (event) => {
        this.inputMap[event.sourceEvent.key] =
          event.sourceEvent.type === "keydown";
      })
    );
    // 注册按键松开事件
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (event) => {
        this.inputMap[event.sourceEvent.key] =
          event.sourceEvent.type === "keydown";
      })
    );
  }
}
