import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  FreeCamera,
  Camera,
  Mesh,
  StandardMaterial,
  Color3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import Coordinate from "@/components/Coordinate";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
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
    scene.useRightHandedSystem = true;
    const freeCamera = new FreeCamera("freeCamera", new Vector3(5, 6, 30));
    freeCamera.setTarget(Vector3.Zero());
    freeCamera.attachControl(canvas, true);

    this.CreateLight(); //创建光源
    this.CreateMesh(); //创建物体
    this.AddGunSight(scene); //添加准星
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
  }
  //创建物体
  CreateMesh(): void {
    const box = MeshBuilder.CreateBox("box", { size: 1 });
    const ground = MeshBuilder.CreateGround("ground", {
      width: 20,
      height: 20,
    });
    ground.position = new Vector3(0, -1, 0);
  }

  // 创建枪准星
  AddGunSight(scene: Scene) {
    if (scene.activeCameras?.length == 0) {
      scene.activeCameras.push(scene.activeCamera!);
    }

    // 添加一个正交相机，用于显示准星
    const freeCamera2 = new FreeCamera("freeCamera2", new Vector3(0, 0, -200));
    freeCamera2.mode = Camera.ORTHOGRAPHIC_CAMERA; //设置相机模式为正交相机
    freeCamera2.layerMask = 0x20000000; //设置相机可见层
    scene.activeCameras?.push(freeCamera2);

    // 创建十字准星
    const meshes: Mesh[] = [];
    const width = 250;
    const height = 250;

    const y = MeshBuilder.CreateBox("y", { size: height * 0.2 });
    y.scaling = new Vector3(0.05, 1, 1);
    y.position = Vector3.Zero();
    meshes.push(y);

    const x = MeshBuilder.CreateBox("x", { size: width * 0.2 });
    x.scaling = new Vector3(1, 0.05, 1);
    x.position = Vector3.Zero();
    meshes.push(x);

    const lineTop = MeshBuilder.CreateBox("lineTop", { size: width * 0.8 });
    lineTop.scaling = new Vector3(1, 0.005, 1);
    lineTop.position = new Vector3(0, height * 0.5, 0);
    meshes.push(lineTop);

    //
    const gunSight = Mesh.MergeMeshes(meshes) as Mesh;
    gunSight.name = "gunSight";
    gunSight.layerMask = 0x20000000; //设置准星可见层

    const gunSightMaterial = new StandardMaterial("standardMaterial");
    gunSightMaterial.checkReadyOnlyOnce = true;
    gunSightMaterial.emissiveColor = new Color3(0, 1, 0);

    gunSight.material = gunSightMaterial;
  }
}
