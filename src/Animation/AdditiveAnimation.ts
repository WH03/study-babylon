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
  AnimationGroup,
  Scalar,
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
    const model = await ImportMeshAsync("/Meshes/Xbot.glb", scene); //导入模型
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

    //站立
    // const idleAnim = scene.animationGroups.find(
    //   (anim) => anim.name === "idle"
    // )!;
    // let idleParam = { name: "Idle", anim: idleAnim, weight: 1 };
    // idleAnim?.setWeightForAllAnimatables(1);
    // idleAnim?.play(true); //播放动画
    const idleAnim = scene.animationGroups.find((a) => a.name === "idle");
    let idleParam = { name: "Idle", anim: idleAnim, weight: 1 };
    idleAnim?.play(true);
    idleAnim?.setWeightForAllAnimatables(1);

    // 行走
    const walkAnim = scene.animationGroups.find(
      (anim) => anim.name === "walk"
    )!;
    let walkParam = { name: "Walk", anim: walkAnim, weight: 1 };
    walkAnim?.play(true);
    walkAnim?.setWeightForAllAnimatables(0);

    // 跑动
    const runAnim = scene.animationGroups.find((anim) => anim.name === "run")!;
    let runParam = { name: "Run", anim: runAnim, weight: 1 };
    runAnim.play(true);
    runAnim.setWeightForAllAnimatables(0);

    // 初始化附加动画
    const sadPoseAnim = AnimationGroup.MakeAnimationAdditive(
      scene.animationGroups.find((a) => a.name === "sad_pose")!
    );
    sadPoseAnim.start(true, 1, 0.03 * 60, 0.03 * 60);
    let sadPoseParam = { name: "Sad Pose", anim: sadPoseAnim, weight: 0 };

    const sneakPoseAnim = AnimationGroup.MakeAnimationAdditive(
      scene.animationGroups.find((a) => a.name === "sneak_pose")!
    );
    sneakPoseAnim.start(true, 1, 0.03 * 60, 0.03 * 60);
    let sneakPoseParam = { name: "sneak Pose", anim: sneakPoseAnim, weight: 0 };

    const headShakeAnim = AnimationGroup.MakeAnimationAdditive(
      scene.animationGroups.find((a) => a.name === "headShake")!
    );
    let headShakeParam = { name: "Head Shake", anim: headShakeAnim, weight: 0 };
    headShakeAnim.play(true);

    const agreeAnim = AnimationGroup.MakeAnimationAdditive(
      scene.animationGroups.find((a) => a.name === "agree")!
    );
    agreeAnim.play(true);
    let agreeParam = { name: "Agree", anim: agreeAnim, weight: 0 };

    // 当前动画
    // 当前动画
    let currentParam: any;
    currentParam = idleParam;

    //
    function onBeforeAnimation() {
      // 增加当前动画的权重
      if (currentParam) {
        currentParam.weight = Scalar.Clamp(currentParam.weight + 0.01, 0, 1);
        currentParam.anim?.setWeightForAllAnimatables(currentParam.weight);
      }

      // 减少所有非当前覆盖动画的权重
      if (currentParam !== idleParam) {
        idleParam.weight = Scalar.Clamp(idleParam.weight - 0.01, 0, 1);
        idleParam.anim?.setWeightForAllAnimatables(idleParam.weight);
      }

      if (currentParam !== walkParam) {
        walkParam.weight = Scalar.Clamp(walkParam.weight - 0.01, 0, 1);
        walkParam.anim?.setWeightForAllAnimatables(walkParam.weight);
      }

      if (currentParam !== runParam) {
        runParam.weight = Scalar.Clamp(runParam.weight - 0.01, 0, 1);
        runParam.anim?.setWeightForAllAnimatables(runParam.weight);
      }

      // 当前动画的权重为1，或者所有动画权限为0，移除回调
      if (
        (currentParam && currentParam.weight == 1) ||
        (idleParam.weight == 0 && walkParam.weight == 0 && runParam.weight == 0)
      ) {
        scene.onBeforeAnimationsObservable.removeCallback(onBeforeAnimation);
      }
    }

    //创建全屏UI
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const uiPanel = new StackPanel(); //创建面板
    uiPanel.width = "220px";
    uiPanel.fontSize = "14px";
    uiPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT; //水平对齐方式
    uiPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER; //垂直对齐方式
    advancedDynamicTexture.addControl(uiPanel); //添加面板到UI
    //创建按钮
    let button = GUI.Button.CreateSimpleButton("button0", "None"); //创建按钮
    button.paddingTop = "10px";
    button.width = "200px";
    button.height = "50px";
    button.background = "green";
    button.color = "white";
    button.onPointerClickObservable.add(() => {
      // 移除当前动画
      currentParam = undefined;
      // 重启动画监视
      scene.onBeforeAnimationsObservable.removeCallback(onBeforeAnimation);
      scene.onBeforeAnimationsObservable.add(onBeforeAnimation);
    });
    uiPanel.addControl(button); //添加到面板中

    // 站立
    button = GUI.Button.CreateSimpleButton("button1", "Idle");
    button.paddingTop = "10px";
    button.width = "200px";
    button.height = "50px";
    button.color = "white";
    button.background = "green";
    button.onPointerClickObservable.add(() => {
      if (currentParam == idleParam) return;
      // 重启动画监视 idle
      scene.onBeforeAnimationsObservable.removeCallback(onBeforeAnimation);
      currentParam = idleParam;
      scene.onBeforeAnimationsObservable.add(onBeforeAnimation);
    });
    uiPanel.addControl(button); //添加到面板中

    // 行走
    button = GUI.Button.CreateSimpleButton("button", "Walk");
    button.paddingTop = "10px";
    button.width = "200px";
    button.height = "50px";
    button.color = "white";
    button.background = "green";
    button.onPointerClickObservable.add(() => {
      if (currentParam == walkParam) return;
      // 同步动画
      if (currentParam) {
        walkParam.anim?.syncAllAnimationsWith(null);
        currentParam.anim?.syncAllAnimationsWith(
          walkParam.anim!.animatables[0]
        );
      }
      // 重启动画监视 walk
      scene.onBeforeAnimationsObservable.removeCallback(onBeforeAnimation);
      currentParam = walkParam;
      scene.onBeforeAnimationsObservable.add(onBeforeAnimation);
    });
    uiPanel.addControl(button); //添加到面板中

    // 跑步
    button = GUI.Button.CreateSimpleButton("button", "Run");
    button.paddingTop = "10px";
    button.width = "200px";
    button.height = "50px";
    button.color = "white";
    button.background = "green";
    button.onPointerClickObservable.add(() => {
      if (currentParam == runParam) return;
      // 同步动画
      if (currentParam) {
        runParam.anim?.syncAllAnimationsWith(null);
        currentParam.anim?.syncAllAnimationsWith(runParam.anim!.animatables[0]);
      }
      // 重启动画监视 run
      scene.onBeforeAnimationsObservable.removeCallback(onBeforeAnimation);
      currentParam = runParam;
      scene.onBeforeAnimationsObservable.add(onBeforeAnimation);
    });
    uiPanel.addControl(button); //添加到面板中

    const params = [sadPoseParam, sneakPoseParam, headShakeParam, agreeParam];
    params.forEach((param) => {
      const header = new TextBlock();
      header.text = param.name + ":" + param.weight.toFixed(2);
      header.height = "40px";
      header.color = "green";
      header.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      header.paddingTop = "10px";
      uiPanel.addControl(header);

      const slider = new Slider();
      slider.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      slider.minimum = 0;
      slider.maximum = 1;
      slider.color = "green";
      slider.height = "20px";
      slider.width = "205px";
      uiPanel.addControl(slider);
      slider.onValueChangedObservable.add((v) => {
        param.anim.setWeightForAllAnimatables(v);
        param.weight = v;
        header.text = param.name + ":" + param.weight.toFixed(2);
      });
      slider.value = param.weight;
    });
  }
}
