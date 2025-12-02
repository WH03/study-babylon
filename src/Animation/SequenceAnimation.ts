import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  DirectionalLight,
  UniversalCamera,
  StandardMaterial,
  Color3,
  SpotLight,
  Animation,
} from "@babylonjs/core";

import Coordinate from "@/components/Coordinate";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = this.CreateScene(canvas);

    const coordinate = new Coordinate(this.scene);
    coordinate.ShowAxis(15);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    const camera = new UniversalCamera(
      "universalCamera",
      new Vector3(0, 3, -30)
    );
    camera.attachControl(canvas, true);
    this.CreateLigtht(); //创建光源
    this.CreateMesh(scene, camera); //创建物体

    return scene;
  }

  // 创建光源
  CreateLigtht() {
    const directionalLight = new DirectionalLight(
      "directionalLight",
      new Vector3(0, -1, 0),
      this.scene
    );
    directionalLight.intensity = 0.25;
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, -1),
      this.scene
    );
    hemisphericLight.intensity = 0.5;
  }
  //创建物体
  CreateMesh(scene: Scene, camera: UniversalCamera): void {
    // 地面
    const ground = MeshBuilder.CreateGround("ground", {
      width: 50,
      height: 50,
    });
    ground.position.y = -2;

    let wall1 = MeshBuilder.CreateBox(
      "door",
      { width: 8, height: 6, depth: 0.1 },
      scene
    );
    wall1.position.x = -6;
    wall1.position.y = 3;

    let wall2 = MeshBuilder.CreateBox(
      "door",
      { width: 4, height: 6, depth: 0.1 },
      scene
    );
    wall2.position.x = 2;
    wall2.position.y = 3;

    let wall3 = MeshBuilder.CreateBox(
      "door",
      { width: 2, height: 2, depth: 0.1 },
      scene
    );
    wall3.position.x = -1;
    wall3.position.y = 5;

    let wall4 = MeshBuilder.CreateBox(
      "door",
      { width: 14, height: 6, depth: 0.1 },
      scene
    );
    wall4.position.x = -3;
    wall4.position.y = 3;
    wall4.position.z = 7;

    let wall5 = MeshBuilder.CreateBox(
      "door",
      { width: 7, height: 6, depth: 0.1 },
      scene
    );
    wall5.rotation.y = Math.PI / 2;
    wall5.position.x = -10;
    wall5.position.y = 3;
    wall5.position.z = 3.5;

    let wall6 = MeshBuilder.CreateBox(
      "door",
      { width: 7, height: 6, depth: 0.1 },
      scene
    );
    wall6.rotation.y = Math.PI / 2;
    wall6.position.x = 4;
    wall6.position.y = 3;
    wall6.position.z = 3.5;

    let roof = MeshBuilder.CreateBox(
      "door",
      { width: 14, height: 7, depth: 0.1 },
      scene
    );
    roof.rotation.x = Math.PI / 2;
    roof.position.x = -3;
    roof.position.y = 6;
    roof.position.z = 3.5;

    // 门
    const door = MeshBuilder.CreateBox("box", {
      width: 2,
      height: 4,
      depth: 0.1,
    });
    // 门轴
    const hinge = MeshBuilder.CreateBox("hinge");
    hinge.isVisible = false; //隐藏
    door.parent = hinge;
    hinge.position.y = 2;
    door.position.x = -1;

    // 灯光实体，模拟灯泡
    const sphereLight = MeshBuilder.CreateSphere("sphereLight", {
      diameter: 0.2,
    });
    sphereLight.material = new StandardMaterial("lightMaterial"); //材质
    (sphereLight.material as StandardMaterial).emissiveColor = new Color3(
      1,
      1,
      1
    );
    sphereLight.position = new Vector3(2, 3, 0.1);

    // 灯光实体数组
    const sphereLights = [sphereLight]; //灯光实体数组
    sphereLights.push(sphereLight.clone()); //克隆灯光实体
    sphereLights[1].position = new Vector3(-2, 3, 6.9);

    // 灯光
    const spotLights = [];
    const lightDirections = [
      new Vector3(-0.5, -0.25, 1),
      new Vector3(0, 0, -1),
    ];
    // 循环创建灯光
    for (let i = 0; i < sphereLights.length; i++) {
      spotLights[i] = new SpotLight(
        "spotLight" + i,
        sphereLights[i].position, // 灯光位置
        lightDirections[i], //灯光方向
        Math.PI / 8, //灯光角度
        5 //灯光强度
      );
      spotLights[i].diffuse = new Color3(1, 1, 1); //灯光颜色
      spotLights[i].specular = new Color3(0.5, 0.5, 0.5); //灯光高光颜色
      spotLights[i].intensity = 0; //灯光强度
    }
    /* ****************动画过程************ */
    // 1、门动画
    const frameRate = 20; //帧率
    const doorAnimation = new Animation(
      "doorAnimation",
      "rotation.y",
      frameRate,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const doorAnimKeys = [
      {
        frame: 0,
        value: 0,
      },
      {
        frame: 3 * frameRate,
        value: 0,
      },
      {
        frame: 5 * frameRate,
        value: Math.PI / 3,
      },
      {
        frame: 13 * frameRate,
        value: Math.PI / 3,
      },
      {
        frame: 15 * frameRate,
        value: 0,
      },
    ];
    doorAnimation.setKeys(doorAnimKeys);

    // 2、摄像机前进动画
    const cameraAnimation = new Animation(
      "cameraAnimation",
      "position",
      frameRate,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const cameraAnimKeys = [
      {
        frame: 0,
        value: new Vector3(0, 3, -30),
      },
      {
        frame: 3 * frameRate,
        value: new Vector3(0, 2, -10),
      },
      {
        frame: 5 * frameRate,
        value: new Vector3(0, 2, -10),
      },
      {
        frame: 8 * frameRate,
        value: new Vector3(-2, 2, 3),
      },
    ];
    cameraAnimation.setKeys(cameraAnimKeys);

    // 3、摄像机旋转动画
    const cameraRotation = new Animation(
      "cameraRotationAnimation",
      "rotation.y",
      frameRate,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const cameraRotationAnimKeys = [
      {
        frame: 0,
        value: 0,
      },
      {
        frame: 9 * frameRate,
        value: 0,
      },
      {
        frame: 14 * frameRate,
        value: Math.PI,
      },
    ];
    cameraRotation.setKeys(cameraRotationAnimKeys);

    // 4、灯光动画
    const lightAnimation = new Animation(
      "lightAnimation",
      "intensity",
      frameRate,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const lightAnimKeys = [
      {
        frame: 0,
        value: 0,
      },
      {
        frame: 7 * frameRate,
        value: 0,
      },
      {
        frame: 10 * frameRate,
        value: 1,
      },
      {
        frame: 14 * frameRate,
        value: 1,
      },
      {
        frame: 15 * frameRate,
        value: 0,
      },
    ];
    lightAnimation.setKeys(lightAnimKeys);

    scene.beginDirectAnimation(
      hinge,
      [doorAnimation],
      0,
      25 * frameRate,
      false
    );
    scene.beginDirectAnimation(
      camera,
      [cameraAnimation, cameraRotation],
      0,
      25 * frameRate,
      false
    );
    scene.beginDirectAnimation(
      spotLights[0],
      [lightAnimation],
      0,
      25 * frameRate,
      false
    );
    scene.beginDirectAnimation(
      spotLights[1],
      [lightAnimation.clone()],
      0,
      25 * frameRate,
      false
    );
  }
}
