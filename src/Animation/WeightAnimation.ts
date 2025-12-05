import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  ImportMeshAsync,
  Color3,
  DirectionalLight,
  ShadowGenerator,
} from "@babylonjs/core";

import "@babylonjs/loaders";
import "@babylonjs/inspector";
import * as GUI from "@babylonjs/gui"; // GUI

// import Coordinate from "@/components/Coordinate";
import {
  AdvancedDynamicTexture,
  Control,
  Slider,
  StackPanel,
  TextBlock,
} from "@babylonjs/gui/2D";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  // 新增：用于存储当前动画过渡的监听引用，避免多个监听冲突
  private animationObs: any = null;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    // this.engine.displayLoadingUI(); //显示加载界面
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
    // scene.useRightHandedSystem = true;
    scene.debugLayer.show();
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 4,
      15,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 10; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    // camera.attachControl(canvas, true);
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    const shadowGenerator = this.CreateLight(); //创建光源

    this.ImportMeshes(scene, shadowGenerator);

    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
    hemisphericLight.intensity = 0.6;
    hemisphericLight.specular = Color3.Black(); //设置光源的镜面反射颜色

    const directionalLight = new DirectionalLight(
      "directionalLight",
      new Vector3(0, -0.5, -1),
      this.scene
    );
    directionalLight.position = new Vector3(0, 5, 5);
    const shadowGenerator = new ShadowGenerator(1024, directionalLight);

    shadowGenerator.useBlurExponentialShadowMap = true; //开启模糊
    shadowGenerator.blurKernel = 32; //模糊程度

    return shadowGenerator;
  }

  //导入模型
  async ImportMeshes(scene: Scene, shadowGenerator: ShadowGenerator) {
    const model = await ImportMeshAsync("/Meshes/dummy2.babylon", scene); //导入模型
    const skeleton = model.skeletons[0];
    shadowGenerator?.addShadowCaster(scene.meshes[0], true); //添加阴影
    model.meshes.forEach((mesh) => {
      mesh.receiveShadows = false; //设置模型不接收阴影
    });

    //
    const helper = scene.createDefaultEnvironment({
      enableGroundShadow: true, // 开启地面阴影
    })!;

    helper?.setMainColor(Color3.Gray()); //设置环境颜色
    // 强制地面接收阴影
    if (helper.ground) {
      helper.ground.receiveShadows = true;
      helper.ground.position.y -= 0.01; // 轻微下移，避免模型穿透
    }

    //设置动画
    const idleAnim = scene.beginWeightedAnimation(skeleton, 0, 89, 1, true);
    const walkAnim = scene.beginWeightedAnimation(skeleton, 90, 118, 0, true);
    const runAnim = scene.beginWeightedAnimation(skeleton, 119, 135, 0, true);
    const params: any[] = [
      { name: "Idle", anim: idleAnim },
      { name: "Walk", anim: walkAnim },
      { name: "Run", anim: runAnim },
    ];
    //创建全屏UI
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const uiPanel = new StackPanel(); //创建面板
    uiPanel.width = "220px";
    uiPanel.fontSize = "14px";
    uiPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT; //水平对齐方式
    uiPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER; //垂直对齐方式
    params.forEach((param) => {
      const header = new TextBlock(); //创建文本块
      header.text = param.name + ":" + param.anim.weight.toFixed(2); //文本内容
      header.height = "40px";
      header.color = "green";
      header.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      header.paddingTop = "10px";
      uiPanel.addControl(header); //添加到面板中

      // 创建滑块
      const slider = new Slider(); //创建滑块
      slider.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT; //水平对齐方式
      slider.minimum = 0; //最小值
      slider.maximum = 1; //最大值
      slider.color = "green"; //滑块颜色
      slider.value = param.anim.weight; //滑块初始值
      slider.height = "20px";
      slider.width = "200px";
      uiPanel.addControl(slider); //添加到面板中
      slider.onValueChangedObservable.add((value) => {
        param.anim.weight = value; //更新动画权重
        header.text = param.name + ":" + param.anim.weight.toFixed(2); //更新文本内容
      });
      param.anim._slider = slider; //保存滑块引用
    });

    //创建按钮
    let button = GUI.Button.CreateSimpleButton("button", "From idle to walk"); //创建按钮
    button.paddingTop = "10px";
    button.width = "200px";
    button.height = "50px";
    button.background = "green";
    button.color = "white";
    button.onPointerClickObservable.add(() => {
      // 1. 清理上一次的动画监听（关键：解决多次点击/切换按钮冲突）
      if (this.animationObs) {
        scene.onBeforeAnimationsObservable.remove(this.animationObs);
        this.animationObs = null;
      }
      idleAnim._slider.value = 1.0;
      walkAnim._slider.value = 0.0;
      runAnim._slider.value = 0.0;

      this.animationObs = scene.onBeforeAnimationsObservable.add(() => {
        //监听动画开始
        idleAnim._slider.value -= 0.01; //每帧减少0.01
        if (idleAnim._slider.value < 0) {
          //如果idleAnim的权重小于0
          scene.onBeforeAnimationsObservable.remove(this.animationObs);
          idleAnim._slider.value = 0.0; //将idleAnim的权重设置为0
          walkAnim._slider.value = 1.0; //将walkAnim的权重设置为1
        } else {
          walkAnim._slider.value = 1.0 - idleAnim._slider.value;
        }
      });
    });

    let button2 = GUI.Button.CreateSimpleButton("button2", "From walk to run");
    button2.paddingTop = "10px";
    button2.width = "200px";
    button2.height = "50px";
    button2.color = "white";
    button2.background = "green";
    button2.onPointerDownObservable.add(() => {
      // 1. 清理上一次的动画监听（关键）
      if (this.animationObs) {
        scene.onBeforeAnimationsObservable.remove(this.animationObs);
        this.animationObs = null;
      }
      idleAnim._slider.value = 0;
      walkAnim._slider.value = 1.0;
      runAnim._slider.value = 0.0;

      const obs = scene.onBeforeAnimationsObservable.add(() => {
        walkAnim._slider.value -= 0.01; //每帧减少0.01

        if (walkAnim._slider.value <= 0) {
          scene.onBeforeAnimationsObservable.remove(obs);
          walkAnim._slider.value = 0;
          runAnim._slider.value = 1.0;
        } else {
          runAnim._slider.value = 1.0 - walkAnim._slider.value;
        }
      });
    });

    uiPanel.addControl(button); //添加到面板中
    uiPanel.addControl(button2); //添加到面板中

    advancedDynamicTexture.addControl(uiPanel);
  }
}
