import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Texture,
  Mesh,
  LinesMesh,
  Matrix,
  UniversalCamera,
  Viewport,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";
import FreeCameraKeyboardRotateInput from "@/components/WalkCameraKeyboard";

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
    // scene.useRightHandedSystem = true;

    scene.gravity = new Vector3(0, -9.81, 0);
    scene.collisionsEnabled = true; //开启碰撞检测

    //第一人称视角
    const universalCamera = new UniversalCamera(
      "universalCamera",
      new Vector3(0, 1, -15)
    );
    universalCamera.minZ = 0.0001; //设置相机最小距离
    universalCamera.speed = 0.02; //设置相机移动速度
    // 移除默认的键盘输入事件
    universalCamera.inputs.removeByType("FreeCameraKeyboardMoveInput");
    // 添加自定义的键盘输入事件
    universalCamera.inputs.add(new FreeCameraKeyboardRotateInput(0.1));
    universalCamera.checkCollisions = true;
    universalCamera.applyGravity = true;
    universalCamera.ellipsoid = new Vector3(1.5, 1, 1.5); //设置相机碰撞体积
    universalCamera.attachControl(canvas, true);
    // 第三人称视角
    const viewCamera = new UniversalCamera(
      "viewCamera",
      new Vector3(0, 10, -20)
    );
    viewCamera.parent = universalCamera;
    viewCamera.setTarget(Vector3.Zero());

    // 添加活动相机
    scene.activeCameras?.push(universalCamera, viewCamera);

    // 添加两个视口，一个用于第一人称视角，一个用于第三人称视角
    universalCamera.viewport = new Viewport(0, 0.5, 1, 0.5); //第一人称视角
    viewCamera.viewport = new Viewport(0, 0, 1, 0.5); //第三人称视角

    this.CreateLight(); //创建光源
    this.CreateMesh(scene, universalCamera); //创建物体
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(1, 1, 0)
    );
  }
  //创建物体
  CreateMesh(scene: Scene, camera: UniversalCamera): void {
    const boxMaterial = new StandardMaterial("boxMaterial");
    boxMaterial.diffuseTexture = new Texture("/Materials/box.png");
    const box = MeshBuilder.CreateBox("box", {
      size: 2,
    });
    box.position = new Vector3(5, 0, 0);
    box.material = boxMaterial;
    box.checkCollisions = true; //开启碰撞检测

    const ground = MeshBuilder.CreateGround("ground", {
      width: 50,
      height: 50,
    });

    const groundMaterial = new StandardMaterial("groundMaterial");
    groundMaterial.diffuseColor = Color3.Gray(); //设置材质颜色
    groundMaterial.backFaceCulling = true; //设置材质背面是否显示
    ground.material = groundMaterial;
    ground.position.y = -1;
    ground.checkCollisions = true; //开启碰撞检测

    // 创建随机位置
    const boxNum = 6; //创建的物体数量
    let theta = 0;
    const radius = 6; //半径
    const boxes: Mesh[] = [box]; //创建一个数组来存储物体

    for (let i = 1; i < boxNum; i++) {
      theta += (2 * Math.PI) / boxNum; //计算每个物体的角度
      const newBox = box.clone("box" + i); //克隆物体
      boxes.push(newBox); //将克隆的物体添加到数组中
      newBox.position = new Vector3(
        (radius + this.CreateRandomNumber(-radius / 2, radius / 2)) *
          Math.cos(theta + this.CreateRandomNumber(-theta / 10, theta / 10)),
        0,
        (radius + this.CreateRandomNumber(-radius / 2, radius / 2)) *
          Math.sin(theta + this.CreateRandomNumber(-theta / 10, theta / 10))
      );
    }

    this.CreatePerson(scene, camera); //创建观察者
  }

  // 创建一个人（模型），作为观察者
  CreatePerson(scene: Scene, camera: UniversalCamera) {
    const forward = new Vector3(0, 0, 1); // 设置前进方向
    const extra = 0.1; //  // 中心点位置

    const base = new Mesh("base");
    base.checkCollisions = true;
    base.parent = camera;
    const headDiameter = 1.5;
    const bodyDiameter = 2;
    const offsetY = (bodyDiameter + headDiameter) / 2 + extra; // 中心点位置
    const head = MeshBuilder.CreateSphere("head", { diameter: headDiameter });
    head.parent = base;
    const body = MeshBuilder.CreateSphere("body", { diameter: bodyDiameter });
    body.parent = base;
    head.position.y = 0.5 * (headDiameter + bodyDiameter) - 0.5;
    base.position.y = 0.5 * bodyDiameter - 1;

    this.VisualizeCollisionBoxes(
      base,
      headDiameter,
      bodyDiameter,
      extra,
      offsetY
    );
    this.CreateDirectionLine(base, headDiameter, 0.1, forward); //创建方向线
    this.AddKeyboardBehavior(scene, base, forward); //添加键盘行为
  }

  // 可视化碰撞盒子
  VisualizeCollisionBoxes(
    base: Mesh,
    headDiameter: number,
    bodyDiameter: number,
    extra: number = 0,
    offsetY: number = 0
  ) {
    base.ellipsoid = new Vector3(
      bodyDiameter / 2,
      (bodyDiameter + headDiameter) / 2 - 0.2,
      bodyDiameter / 2
    );
    // 设置碰撞盒的大小
    base.ellipsoid.addInPlace(new Vector3(extra, extra, extra));
    const x = base.ellipsoid.x;
    const y = base.ellipsoid.y;
    const points: Vector3[] = [];

    for (let i = -Math.PI / 2; i < Math.PI / 2; i += Math.PI / 36) {
      points.push(
        new Vector3(0, y * Math.sin(i) + offsetY - 1.3, x * Math.cos(i))
      );
    }
    // 创建线段
    const ellipsoid: LinesMesh[] = [];
    ellipsoid[0] = MeshBuilder.CreateLines("line", { points: points });
    ellipsoid[0].color = Color3.Red();
    ellipsoid[0].parent = base;
    const steps = 12;
    const theta = (2 * Math.PI) / steps; // 旋转角度
    for (let i = 1; i < steps; i++) {
      ellipsoid[i] = ellipsoid[0].clone("line" + i);
      ellipsoid[i].rotation.y = theta * i;
      ellipsoid[i].parent = base;
    }
  }
  // 创建方向线
  CreateDirectionLine(
    base: Mesh,
    headDiameter: number,
    extra = 0.1,
    forward: Vector3
  ) {
    const pointOffsetB = new Vector3(0, headDiameter + extra, 0);
    const directionalLine = MeshBuilder.CreateLines("directionalLine", {
      points: [
        base.position.add(pointOffsetB),
        base.position.add(pointOffsetB.add(forward.scale(3))),
      ],
    });
    directionalLine.parent = base;
  }
  // 添加键盘行为
  AddKeyboardBehavior(scene: Scene, base: Mesh, forward: Vector3) {
    let angle = 0;
    let matrix = Matrix.Identity(); // 初始化矩阵
    let moveDirectional = new Vector3(0, 0, 1);
    scene.onKeyboardObservable.add((keyboard) => {
      switch (keyboard.event.key) {
        case "A": // 向左移动
        case "a":
          angle -= -0.1;
          base.rotation.y = angle; // 更新旋转角度
          Matrix.RotationYToRef(angle, matrix); // 更新矩阵
          Vector3.TransformNormalToRef(forward, matrix, moveDirectional);
          break;
        case "w": // 向前移动
        case "W":
          base.moveWithCollisions(moveDirectional.scale(0.5));
          break;
        case "d": // 向右移动
        case "D": // 向右移动
          angle -= 0.1;
          base.rotation.y = angle; // 更新旋转角度
          Matrix.RotationYToRef(angle, matrix); // 更新矩阵
          Vector3.TransformNormalToRef(forward, matrix, moveDirectional);
          break;
        case "s": // 向后移动
        case "S":
          base.moveWithCollisions(moveDirectional.scale(-0.5));
      }
    });
  }

  // 创建随机数
  CreateRandomNumber(min: number, max: number): number {
    return min + (max - min) * Math.random();
  }
}
