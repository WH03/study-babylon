import {
  Vector3,
  MeshBuilder,
  Texture,
  NodeMaterial,
  Scene,
  AbstractAudioAnalyzer,
} from "@babylonjs/core";

export default class Visualizer {
  constructor(scene: Scene, analyzer: AbstractAudioAnalyzer) {
    this.CreateVisualizer(analyzer, scene);
  }

  async CreateVisualizer(
    analyzer: AbstractAudioAnalyzer,
    scene: Scene
  ): Promise<any> {
    const ShaderUrl = "/data/visualizerShader.json";
    const TextureUrl = "/images/visualizerMask_mask.png";

    NodeMaterial.IgnoreTexturesAtLoadTime = true;// 忽略加载纹理
    const material = await NodeMaterial.ParseFromFileAsync(// 解析文件
      "Visualizer.material",
      ShaderUrl,
      scene
    );
    material.build(false);// 构建材质

    const texture = new Texture(TextureUrl, scene, false, true);// 创建纹理
    texture.uOffset = texture.vOffset = 0.08;// 设置纹理偏移
    texture.uScale = texture.vScale = 0.84;// 设置纹理缩放
    texture.vScale = 0.84;// 设置纹理缩放

    const mask = material.getBlockByName("visualizerMask") as any;// 获取材质块
    mask.texture = texture;// 设置纹理

    const mesh = MeshBuilder.CreatePlane(
      "Visualizer.mesh",
      { width: 4, height: 2 },
      scene
    );
    mesh.material = material;// 设置材质
    mesh.scaling = new Vector3(2, 4, 1);// 设置缩放
    mesh.visibility = 0.1;// 设置可见性

    const columns: any[] = [];
    for (let i = 1; i < 17; i++) {
      columns.push(material.getBlockByName(`col${i}`));// 获取材质块
    }

    scene.registerBeforeRender(() => {
      var frequencies = analyzer.getByteFrequencyData();// 获取频率数据
      for (let i = 0; i < 16; i++) {
        columns[i].value = frequencies[i] / 255;// 设置材质块值
      }
    });
  }
}
