import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Texture,
  Vector4,
  Mesh,
  ImportMeshAsync,
} from "babylonjs";

import "babylonjs-loaders";

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
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      15,
      Vector3.Zero()
    );
    camera.attachControl(canvas, true);
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    // const ground = this.CreateGround();

    this.BuildDwelling();

    return scene;
  }

  //  批量创建房屋
  BuildDwelling() {
    // 导入glb模型创建房屋
    ImportMeshAsync(
      "https://assets.babylonjs.com/meshes/village.glb",
      this.scene
    );
    // const detached_house = this.CreateHouse(1)!;
    // detached_house.rotation.y = -Math.PI / 16;
    // detached_house.position.x = -6.8;
    // detached_house.position.z = 2.5;

    // const semi_house = this.CreateHouse(2)!;
    // semi_house.rotation.y = -Math.PI / 16;
    // semi_house.position.x = -4.5;
    // semi_house.position.z = 3;

    // // 批量创建房子
    // const places = []; //each entry is an array [house type, rotation, x, z]
    // places.push([1, -Math.PI / 16, -6.8, 2.5]);
    // places.push([2, -Math.PI / 16, -4.5, 3]);
    // places.push([2, -Math.PI / 16, -1.5, 4]);
    // places.push([2, -Math.PI / 3, 1.5, 6]);
    // places.push([2, (15 * Math.PI) / 16, -6.4, -1.5]);
    // places.push([1, (15 * Math.PI) / 16, -4.1, -1]);
    // places.push([2, (15 * Math.PI) / 16, -2.1, -0.5]);
    // places.push([1, (5 * Math.PI) / 4, 0, -1]);
    // places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
    // places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
    // places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
    // places.push([2, Math.PI / 1.9, 4.75, -1]);
    // places.push([1, Math.PI / 1.95, 4.5, -3]);
    // places.push([2, Math.PI / 1.9, 4.75, -5]);
    // places.push([1, Math.PI / 1.9, 4.75, -7]);
    // places.push([2, -Math.PI / 3, 5.25, 2]);
    // places.push([1, -Math.PI / 3, 6, 4]);

    // //Create instances from the first two that were built
    // const houses = [];
    // for (let i = 0; i < places.length; i++) {
    //   if (places[i][0] === 1) {
    //     houses[i] = detached_house.createInstance("house" + i);
    //   } else {
    //     houses[i] = semi_house.createInstance("house" + i);
    //   }
    //   houses[i].rotation.y = places[i][1];
    //   houses[i].position.x = places[i][2];
    //   houses[i].position.z = places[i][3];
    // }
  }

  CreateHouse(width: number) {
    const roof = this.CreateRoof(width);
    const box = this.CreateBox(width);
    return Mesh.MergeMeshes([roof, box], true, true, undefined, false, true);
  }

  CreateRoof(width: number) {
    // 创建房顶材质
    const roofMaterial = new StandardMaterial("roofMaterial");
    roofMaterial.diffuseTexture = new Texture(
      "https://assets.babylonjs.com/environments/roof.jpg",
      this.scene
    );
    const roof = MeshBuilder.CreateCylinder(
      "roof",
      { diameter: 1.4, height: 1.2, tessellation: 3 },
      this.scene
    );
    roof.scaling.x = 0.75;
    roof.scaling.y = width;
    roof.position.y = 1.22;
    roof.rotation.z = Math.PI / 2;
    roof.material = roofMaterial;

    return roof;
  }

  //创建物体
  CreateBox(width: number): Mesh {
    // 墙体材质
    const boxMaterial = new StandardMaterial("boxMaterial");
    const faceUVs = [];
    if (width === 2) {
      boxMaterial.diffuseTexture = new Texture(
        "https://assets.babylonjs.com/environments/semihouse.png"
      );
      faceUVs[0] = new Vector4(0.6, 0.0, 1, 1); //背面
      faceUVs[1] = new Vector4(0.0, 0.0, 0.4, 1); //正面
      faceUVs[2] = new Vector4(0.4, 0.0, 0.6, 1); //右面
      faceUVs[3] = new Vector4(0.4, 0.0, 0.6, 1); //右面
    } else {
      boxMaterial.diffuseTexture = new Texture(
        "https://assets.babylonjs.com/environments/cubehouse.png"
      );
      faceUVs[0] = new Vector4(0.5, 0.0, 0.75, 1); //背面
      faceUVs[1] = new Vector4(0.0, 0.0, 0.25, 1); //正面
      faceUVs[2] = new Vector4(0.25, 0.0, 0.5, 1); //右面
      faceUVs[3] = new Vector4(0.75, 0.0, 1, 1); //右面
    }

    // 创建一个立方体
    const box = MeshBuilder.CreateBox(
      "box",
      { width, faceUV: faceUVs, wrap: true },
      this.scene
    );
    box.position.y = 0.5;
    box.material = boxMaterial;

    return box;
  }
  CreateGround() {
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 15, height: 16 },
      this.scene
    );
    // 地面材质
    const groundMaterial = new StandardMaterial("ground", this.scene);
    groundMaterial.diffuseColor = new Color3(0, 1, 0);
    ground.material = groundMaterial;

    return ground;
  }
}
