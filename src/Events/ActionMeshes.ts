import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ActionManager,
  InterpolateValueAction,
  Color3,
  SetValueAction,
  StandardMaterial,
  PredicateCondition,
  ExecuteCodeAction,
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
      20,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 30; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    // camera.attachControl(canvas, true);
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    let light = this.CreateLight(); //创建光源

    this.CreateMeshAction(light, camera, scene);
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
    return hemisphericLight;
  }
  //创建物体
  CreateMeshAction(
    light: HemisphericLight,
    camera: ArcRotateCamera,
    scene: Scene
  ) {
    const box = MeshBuilder.CreateBox("box", { size: 1 }, this.scene);
    box.material = new StandardMaterial("boxMaterial");
    // 添加事件
    box.actionManager = new ActionManager();
    // 点击事件链式触发器:当鼠标点击物体时触发,
    box.actionManager
      .registerAction(
        new InterpolateValueAction( //插值动作
          ActionManager.OnPickTrigger, //点击触发
          light,
          "diffuse",
          Color3.Blue(),
          1000
        )
      )
      ?.then(
        new SetValueAction(
          ActionManager.NothingTrigger,
          box,
          "material.wireframe",
          true
        )
      )
      .then(
        new SetValueAction(
          ActionManager.NothingTrigger,
          box,
          "material.wireframe",
          false
        )
      )
      .then(
        new InterpolateValueAction(
          ActionManager.OnPickTrigger,
          light,
          "diffuse",
          Color3.Red(),
          1000
        )
      );

    //再次注册一个事件
    box.actionManager.registerAction(
      new InterpolateValueAction(
        ActionManager.OnPickTrigger,
        camera,
        "alpha",
        0,
        500,
        new PredicateCondition(box.actionManager as ActionManager, () => {
          return light.diffuse.equals(Color3.Red()); //当light的颜色为红色时，执行这个动作
        }),
        true //是否停止其他动作
      )
    );

    // 创建一个球体
    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1 });
    sphere.position = new Vector3(3, 0, 0);
    // 立方体和球体接触时，将立方体沿Y轴拉长
    box.actionManager.registerAction(
      new SetValueAction(
        {
          trigger: ActionManager.OnIntersectionEnterTrigger, //当鼠标进入球体时触发
          parameter: {
            //
            mesh: sphere,
            usePreciseIntersection: true, //使用精确的碰撞检测
          },
        },
        box,
        "scaling",
        new Vector3(1, 3, 1)
      )
    );
    // 立方体和球体分离时，将立方体恢复原状
    box.actionManager.registerAction(
      new SetValueAction(
        {
          trigger: ActionManager.OnIntersectionExitTrigger, //当鼠标离开球体时触发
          parameter: {
            mesh: sphere,
            usePreciseIntersection: true,
          },
        },
        box,
        "scaling",
        new Vector3(1, 1, 1)
      )
    );

    // 添加渲染监测
    let delta = 0;
    scene.registerBeforeRender(() => {
      box.position.x = Math.sin(delta) * 3;
      delta += 0.01;
    });

    // 场景触发器，添加键盘事件
    scene.actionManager = new ActionManager();
    scene.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnKeyUpTrigger,
          parameter: "r",
        },
        () => {
          alert("你按下了r键");
        }
      )
    );
  }
}
