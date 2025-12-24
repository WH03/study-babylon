import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  PointLight,
  Color3,
  StandardMaterial,
  Color4,
  ActionManager,
  SetValueAction,
  Mesh,
  IncrementValueAction,
  InterpolateValueAction,
  CombineAction,
  StateCondition,
  SetStateAction,
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
    coordinate.ShowAxis(100);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    scene.clearColor = new Color4(0, 0, 0, 1);
    scene.useRightHandedSystem = true;
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 4,
      300,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 500; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    // camera.attachControl(canvas, true);
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateMeshAction(scene, camera); //创建物体
    return scene;
  }

  CreateLight() {
    const redPointLight = new PointLight(
      "redPointLight",
      new Vector3(0, 50, 0)
    );

    const greenPointLight = new PointLight(
      "greenPointLight",
      new Vector3(0, 50, 0)
    );
    const bluePointLight = new PointLight(
      "bluePointLight",
      new Vector3(0, 50, 0)
    );
    redPointLight.diffuse = Color3.Red();
    greenPointLight.diffuse = Color3.Green();
    bluePointLight.diffuse = Color3.Blue();

    return { redPointLight, greenPointLight, bluePointLight };
  }
  //创建物体
  CreateMeshAction(scene: Scene, camera: ArcRotateCamera) {
    scene.actionManager = new ActionManager();
    let { redPointLight, greenPointLight, bluePointLight } = this.CreateLight(); //创建光源

    const ground = MeshBuilder.CreateGround("ground", {
      width: 1000,
      height: 1000,
      updatable: false,
    });
    const groundMaterial = new StandardMaterial("groundMaterial");
    groundMaterial.specularColor = Color3.Black();
    ground.material = groundMaterial;

    // 创建一个红色立方体
    const redBox = MeshBuilder.CreateBox("redBox", {
      size: 20,
      updatable: false, //是否可更新
    });
    redBox.position = new Vector3(-50, 0, -50);

    // 创建一个红色立方体的材质
    const redBoxMaterial = new StandardMaterial("redBoxMaterial");
    redBoxMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
    redBoxMaterial.specularColor = new Color3(0.5, 0.5, 0.5);
    redBoxMaterial.emissiveColor = Color3.Red();
    redBox.material = redBoxMaterial;

    // 创建一个绿色立方体
    const greenBox = MeshBuilder.CreateBox("greenBox", {
      size: 20,
    });
    greenBox.position = new Vector3(-50, 0, 50);
    const greenBoxMaterial = new StandardMaterial("greenBoxMaterial");
    greenBoxMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
    greenBoxMaterial.specularColor = new Color3(0.5, 0.5, 0.5);
    greenBoxMaterial.emissiveColor = Color3.Green();
    greenBox.material = greenBoxMaterial;

    // 创建一个蓝色立方体
    const blueBox = MeshBuilder.CreateBox("blueBox", {
      size: 20,
    });
    blueBox.position = new Vector3(50, 0, 50);
    const blueBoxMaterial = new StandardMaterial("blueBoxMaterial");
    blueBoxMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
    blueBoxMaterial.specularColor = new Color3(0.5, 0.5, 0.5);
    blueBoxMaterial.emissiveColor = Color3.Blue();
    blueBox.material = blueBoxMaterial;
    // 创建一个紫色球体
    const purpleSphere = MeshBuilder.CreateSphere("purpleSphere", {
      diameter: 20,
    });
    purpleSphere.position = new Vector3(50, 1, -50);
    const purpleSphereMaterial = new StandardMaterial("purpleSphereMaterial");
    purpleSphereMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
    purpleSphereMaterial.specularColor = new Color3(0.5, 0.5, 0.5);
    purpleSphereMaterial.emissiveColor = Color3.Purple();
    purpleSphere.material = purpleSphereMaterial; //设置材质
    purpleSphere.actionManager = new ActionManager(); //创建一个ActionManager
    // 条件
    const conditionOff = new StateCondition(
      purpleSphere.actionManager as ActionManager,
      redPointLight,
      "off"
    );
    const conditionOn = new StateCondition(
      purpleSphere.actionManager as ActionManager,
      redPointLight,
      "on"
    );
    (purpleSphere.actionManager as ActionManager).registerAction(
      new InterpolateValueAction(
        ActionManager.OnLeftPickTrigger,
        camera,
        "alpha",
        0,
        500,
        conditionOff
      )
    );
    (purpleSphere.actionManager as ActionManager).registerAction(
      new InterpolateValueAction(
        ActionManager.OnLeftPickTrigger,
        camera,
        "alpha",
        Math.PI,
        500,
        conditionOn
      )
    );
    // 创建一个圆环
    const torus = MeshBuilder.CreateTorus("torus", {
      diameter: 20, //圆环的直径
      thickness: 5, //圆环的厚度
      tessellation: 100, //圆环的细分程度
      updatable: false, //是否可更新
    });
    torus.position = new Vector3(0, 5, 0);

    // 圆环与立方体相交动作
    torus.actionManager = new ActionManager();
    torus.actionManager.registerAction(
      new SetValueAction(
        {
          trigger: ActionManager.OnIntersectionEnterTrigger,
          parameter: purpleSphere,
        },
        torus,
        "scaling",
        new Vector3(1.5, 1.5, 1.5)
      )
    );
    torus.actionManager.registerAction(
      new SetValueAction(
        {
          trigger: ActionManager.OnIntersectionExitTrigger,
          parameter: purpleSphere,
        },
        torus,
        "scaling",
        new Vector3(1, 1, 1)
      )
    );

    this.Rotate(redBox, scene);
    this.Rotate(greenBox, scene);
    this.Rotate(blueBox, scene);

    this.PickMesh(redBox, Color3.Red(), redPointLight);
    this.PickMesh(greenBox, Color3.Green(), greenPointLight);
    this.PickMesh(blueBox, Color3.Blue(), bluePointLight);

    this.MouseOverOut(redBox);
    this.MouseOverOut(greenBox);
    this.MouseOverOut(blueBox);
    this.MouseOverOut(purpleSphere);
    // 圆环圆周运动
    let alpha = 0;
    scene.registerBeforeRender(() => {
      torus.position = new Vector3(
        Math.cos(alpha) * 70,
        5,
        Math.sin(alpha) * 70
      );
      alpha += 0.02;
    });
  }

  // 盒子自传
  Rotate = (mesh: Mesh, scene: Scene) => {
    mesh.actionManager = new ActionManager();
    scene.actionManager.registerAction(
      new IncrementValueAction(
        ActionManager.OnEveryFrameTrigger,
        mesh,
        "rotation.y",
        0.01
      )
    );
  };

  // 鼠标滑过圆环动作
  MouseOverOut = (mesh: Mesh) => {
    // 鼠标滑过
    mesh.actionManager?.registerAction(
      // 变为白色
      new SetValueAction(
        ActionManager.OnPointerOverTrigger,
        mesh,
        "material.emissiveColor",
        Color3.White()
      )
    );
    //放大
    mesh.actionManager?.registerAction(
      // 放大
      new InterpolateValueAction(
        ActionManager.OnPointerOverTrigger,
        mesh,
        "scaling",
        new Vector3(1.2, 1.2, 1.2),
        200
      )
    );
    // 鼠标离开
    mesh.actionManager?.registerAction(
      new SetValueAction(
        ActionManager.OnPointerOutTrigger,
        mesh,
        "material.emissiveColor",
        (mesh.material as StandardMaterial).emissiveColor
      )
    );
    // 缩小
    mesh.actionManager?.registerAction(
      new InterpolateValueAction(
        ActionManager.OnPointerOutTrigger,
        mesh,
        "scaling",
        new Vector3(1, 1, 1),
        200
      )
    );
  };

  // 点击圆环改变颜色
  PickMesh = (mesh: Mesh, color: Color3, light: PointLight) => {
    // 点击控制灯光
    mesh.actionManager
      ?.registerAction(
        new CombineAction(ActionManager.OnPickTrigger, [
          new InterpolateValueAction(
            ActionManager.NothingTrigger,
            light,
            "diffuse",
            Color3.Black(),
            1000
          ),
          new SetStateAction(ActionManager.NothingTrigger, light, "off"),
          // 改为线框模式
          new SetValueAction(
            ActionManager.NothingTrigger,
            mesh.material,
            "wireframe",
            true
          ),
        ])
      )
      ?.then(
        new CombineAction(ActionManager.OnPickTrigger, [
          // 点击恢复
          new InterpolateValueAction(
            ActionManager.NothingTrigger,
            light,
            "diffuse",
            color,
            1000
          ),
          new SetStateAction(ActionManager.NothingTrigger, light, "on"),
          new SetValueAction(
            ActionManager.NothingTrigger,
            mesh.material,
            "wireframe",
            false
          ),
        ])
      );
  };
}
