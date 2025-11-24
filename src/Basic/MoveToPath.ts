import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Color3,
  Mesh,
  Axis,
  Space,
} from "@babylonjs/core";

import "@babylonjs/inspector";
import Coordinate from "@/components/Coordinate.ts";

export default class BasicScene {
  engine: Engine;
  scene: Scene;
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = this.CreateScene(canvas);

    this.CreateLine();
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  //创建场景
  CreateScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(this.engine);
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2.2,
      Math.PI / 2.5,
      15,
      Vector3.Zero()
    );
    camera.attachControl(canvas, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // 创建调试层
    scene.debugLayer.show();
    // 创建坐标轴
    const coordinate = new Coordinate(this.scene);
    const axis = coordinate.ShowAxis(6);

    const box = this.CreateMesh(); //创建一个立方体
    box.position = new Vector3(2, 0, 2); //设置立方体的位置
    axis.parent = box; //将坐标轴作为立方体的子对象

    class slide {
      turn: number;
      dist: number;
      constructor(turn: number, dist: number) {
        this.turn = turn;
        this.dist = dist;
      }
    }
    const track: {
      dist: number;
      turn: number;
    }[] = [];

    track.push(new slide(Math.PI / 2, 4)); //一开始距离为0，向右转90度，距离为4
    track.push(new slide((3 * Math.PI) / 4, 8)); // 向右转135度，距离为8
    track.push(new slide((3 * Math.PI) / 4, 8 + 4 * Math.sqrt(2))); // 向右转135度，距离为12
    let distance = 0;
    let step = 0.05;
    let p = 0;
    if (distance > track[p].dist) {
      box.rotate(Axis.Y, track[p].turn, Space.LOCAL);
      p += 1;
      p %= track.length;
    }
    scene.onBeforeRenderObservable.add(() => {
      box.movePOV(0, 0, step);
      distance += step;

      if (distance > track[p].dist) {
        box.rotate(Axis.Y, track[p].turn, Space.LOCAL);
        p += 1;
        p %= track.length;
        if (p === 0) {
          distance = 0;
          box.position = new Vector3(2, 0, 2); //回到起点
          box.rotation = Vector3.Zero(); //重置旋转
        }
      }
    });

    return scene;
  }

  //创建物体
  CreateMesh(): Mesh {
    const faceColors: any[] = [];
    faceColors[0] = Color3.Blue().toColor4();
    faceColors[1] = Color3.Teal().toColor4();
    faceColors[2] = Color3.Red().toColor4();
    faceColors[3] = Color3.Purple().toColor4();
    faceColors[4] = Color3.Green().toColor4();
    faceColors[5] = Color3.Yellow().toColor4();

    const box = MeshBuilder.CreateBox(
      "box",
      { size: 1, faceColors: faceColors },
      this.scene
    );
    return box;
  }

  //创建线
  CreateLine(): void {
    const points = [
      new Vector3(2, 0, 2),
      new Vector3(2, 0, -2),
      new Vector3(-2, 0, -2),
      new Vector3(2, 0, 2),
    ];
    MeshBuilder.CreateLines("triangle", { points: points }, this.scene);
  }
}
