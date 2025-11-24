import {
  Scene,
  Color3,
  DynamicTexture,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  TransformNode,
  Vector3,
} from "@babylonjs/core";

export default class Coordinate {
  private scene: Scene;
  constructor(scene: Scene) {
    this.scene = scene;
  }

  ShowAxis(size: number) {
    // 创建坐标轴
    const makeTextPlane = (text: string, color: string, size: number) => {
      // 1. 大幅增大纹理尺寸和字体，确保文字清晰
      const textureSize = 512; // 纹理尺寸（像素）
      // 创建一个动态纹理
      const dynamicTexture = new DynamicTexture(
        "DynamicTexture", //纹理名称
        textureSize, //纹理尺寸
        this.scene, //场景
        true //是否可写
      );
      //定义纹理是否具有可用的 alpha 值（例如，可用于透明度或光泽度）。
      dynamicTexture.hasAlpha = true;
      // 2. 调整文本绘制参数，让文字居中显示在纹理中
      dynamicTexture.drawText(
        text, //文本内容
        textureSize / 4, // x坐标：左移1/4，避免文字偏右
        (textureSize * 3) / 4, // y坐标：下移1/4，确保文字在纹理可视区
        "bold 120px Arial", // 大幅增大字体
        color, //字体颜色
        "transparent", //背景颜色
        true //是否自动调整大小
      );
      // 3. 创建更大的文本平面
      const plane = MeshBuilder.CreatePlane(
        "TextPlane",
        { size: size, updatable: true },
        this.scene
      );
      // 4. 关键：设置平面始终面向相机（正面朝向屏幕）
      plane.billboardMode = Mesh.BILLBOARDMODE_ALL; // 全方位面向相机
      // 5. 材质设置
      const planeMaterial = new StandardMaterial(
        "TextPlaneMaterial",
        this.scene
      );
      planeMaterial.backFaceCulling = false; // 关闭背面剔除，确保正反都能看到
      planeMaterial.specularColor = new Color3(0, 0, 0); // 无镜面反射，避免眩光
      planeMaterial.diffuseTexture = dynamicTexture; //漫反射颜色
      plane.material = planeMaterial;
      return plane;
    };

    // 创建x轴
    const axisX = MeshBuilder.CreateLines(
      "axisX",
      {
        points: [
          Vector3.Zero(),
          new Vector3(size, 0, 0),
          new Vector3(size * 0.95, 0.05 * size, 0),
          new Vector3(size, 0, 0),
          new Vector3(size * 0.95, -0.05 * size, 0),
        ],
      },
      this.scene
    );
    // 设置x轴颜色
    axisX.color = new Color3(1, 0, 0);
    const axisXChar = makeTextPlane("X", "red", size / 2); //平面尺寸
    axisXChar.position = new Vector3(size, 0, 0); // 位置调整到轴末端外侧

    // 创建y轴
    const axisY = MeshBuilder.CreateLines("axisY", {
      points: [
        Vector3.Zero(),
        new Vector3(0, size, 0),
        new Vector3(-0.05 * size, size * 0.95, 0),
        new Vector3(0, size, 0),
        new Vector3(0.05 * size, size * 0.95, 0),
      ],
    });
    axisY.color = new Color3(0, 1, 0);
    const axisYChar = makeTextPlane("Y", "green", size / 2);
    axisYChar.position = new Vector3(0, size, 0); // 位置调整到轴末端外侧
    // 创建z轴
    const axisZ = MeshBuilder.CreateLines("axisZ", {
      points: [
        Vector3.Zero(),
        new Vector3(0, 0, size),
        new Vector3(0, -0.05 * size, size * 0.95),
        new Vector3(0, 0, size),
        new Vector3(0, 0.05 * size, size * 0.95),
      ],
    });
    axisZ.color = new Color3(0, 0, 1);
    const axisZChar = makeTextPlane("Z", "blue", size / 2);
    axisZChar.position = new Vector3(0, 0, size); // 位置调整到轴末端外侧

    const local_origin = new TransformNode("local_origin");

    axisX.parent = local_origin; //轴的父级
    axisY.parent = local_origin; //轴的父级
    axisZ.parent = local_origin; //轴的父级

    axisXChar.parent = local_origin; //文字的父级
    axisYChar.parent = local_origin; //文字的父级
    axisZChar.parent = local_origin; //文字的父级

    return local_origin;
  }
}
