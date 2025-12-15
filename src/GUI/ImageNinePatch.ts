/* 
  九宫格拉伸：让图片在缩放时，边角区域保持原始比例不变，而中间区域根据需要拉伸，从而避免图片的边框、圆角等细节变形。例如：按钮、面板的边框，拉伸时边缘和角落不会模糊或变形。  
*/
/* 
假设原始图片的尺寸为 (原始宽度W, 原始高度H)，四个切片属性的含义：
  sliceTop = 10：从图片顶部向下截取 10 像素高度 的区域（顶部边缘），该区域在拉伸时高度不变，宽度会随控件宽度拉伸。
  sliceBottom = 45：从图片底部向上截取 45 像素高度 的区域（底部边缘），该区域在拉伸时高度不变，宽度会随控件宽度拉伸。
  sliceLeft = 10：从图片左侧向右截取 10 像素宽度 的区域（左侧边缘），该区域在拉伸时宽度不变，高度会随控件高度拉伸。
  sliceRight = 75：从图片右侧向左截取 75 像素宽度 的区域（右侧边缘），该区域在拉伸时宽度不变，高度会随控件高度拉伸。
 */
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
} from "@babylonjs/core";
import "@babylonjs/loaders";
// import * as GUI from "@babylonjs/gui";

import Coordinate from "@/components/Coordinate";
import { AdvancedDynamicTexture, Grid, Image } from "@babylonjs/gui/2D";

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
      30,
      Vector3.Zero()
    );
    camera.lowerRadiusLimit = 2; //相机最小距离
    camera.upperRadiusLimit = 30; //相机最大距离
    camera.wheelDeltaPercentage = 0.01; //鼠标滚轮缩放速度
    scene.activeCamera = camera; //激活相机
    scene.activeCamera.attachControl(canvas, true); //激活相机

    this.CreateLight(); //创建光源
    this.CreateMeshes(); //创建物体
    this.CreateImageNinePatch(); //创建九宫格图片
    return scene;
  }

  CreateLight() {
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this.scene
    );
  }
  // 创建物体
  async CreateMeshes() {
    const box = MeshBuilder.CreateBox("box", { size: 2 });
    const ground = MeshBuilder.CreateGround("ground", {
      width: 6,
      height: 6,
      subdivisions: 2,
    });
    ground.position = new Vector3(0, -3, 0);
  }
  // 创建GUI
  CreateImageNinePatch() {
    // 创建全屏 2D UI 根容器：名称 "UI"，覆盖整个 Canvas 画布
    const advancedDynamicTexture =
      AdvancedDynamicTexture.CreateFullscreenUI("UI");
    // 创建 Grid 网格布局容器（用于分栏排列图片）
    const grid = new Grid();
    // 添加 3 列，每列宽度占总宽度的 1/3（三等分）
    grid.addColumnDefinition(1 / 3); // 添加列定义
    grid.addColumnDefinition(1 / 3); // 添加列定义
    grid.addColumnDefinition(1 / 3); // 添加列定义e
    advancedDynamicTexture.addControl(grid);
    // 创建图片
    const image1 = new Image("image1", "/GUI/panel_blue2x.9.png");
    image1.width = "100px";
    image1.height = "200px";
    image1.populateNinePatchSlicesFromImage = true; // 自动从图片元数据/命名解析九宫格切片
    image1.stretch = Image.STRETCH_NINE_PATCH; // 启用九宫格拉伸模式（边缘不拉伸，中间拉伸）
    grid.addControl(image1, 0, 0); // 挂载到 Grid 的第 0 行、第 0 列

    // 创建图片
    const image2 = new Image("image2", "/GUI/panel_blue2x.9.inv.png");
    image2.width = "100px";
    image2.height = "200px";
    image2.populateNinePatchSlicesFromImage = true;
    image2.stretch = Image.STRETCH_NINE_PATCH;
    grid.addControl(image2, 0, 1); // 挂载到 Grid 的第 0 行、第 1 列

    // 创建图片:
    /* 
    左侧切片（sliceLeft）：从图片左边开始，宽度为 sliceLeft 的区域，这部分在拉伸时宽度不变，高度会随图片高度拉伸。
    右侧切片（sliceRight）：从图片右边开始，宽度为 sliceRight 的区域，同样宽度不变，高度拉伸。
    顶部切片（sliceTop）：从图片顶部开始，高度为 sliceTop 的区域，高度不变，宽度随图片宽度拉伸。
    底部切片（sliceBottom）：从图片底部开始，高度为 sliceBottom 的区域，高度不变，宽度拉伸。
    切片值是像素单位，基于原始图片的尺寸。
    */
    const image3 = new Image("image3", "/GUI/panel_blue2x.9.direct.png");
    image3.width = "100px";
    image3.height = "200px";
    // 手动设置四个方向的切片距离（单位：像素）
    image3.sliceTop = 10; // 顶部切片高度:意味着从图片顶部向下 10 像素的区域是顶部切片，这部分在图片高度变化时，高度保持 10 像素，宽度会拉伸以适应 image3 的宽度。
    image3.sliceBottom = 45; // 底部切片高度：sliceBottom=45 是从底部向上 45 像素的区域，高度不变。
    image3.sliceLeft = 10; // 左侧切片宽度
    image3.sliceRight = 75; // 右侧切片宽度
    image3.stretch = Image.STRETCH_NINE_PATCH; //自动填充九宫格
    grid.addControl(image3, 0, 2); // 挂载到 Grid 的第 0 行、第 2 列
  }
}
