import {
  Vector3,
  MeshBuilder,
  Texture,
  NodeMaterial,
  Scene,
  AbstractAudioAnalyzer,
} from "@babylonjs/core";

export default class Visualizer {
  private scene: Scene;
  private analyzer: AbstractAudioAnalyzer;
  constructor(scene: Scene, analyzer: AbstractAudioAnalyzer) {
    this.scene = scene;
    this.analyzer = analyzer;
    this.CreateVisualizer(analyzer, scene);
  }

  async CreateVisualizer(
    analyzer: AbstractAudioAnalyzer,
    scene: Scene
  ): Promise<any> {
    const ShaderUrl = "/data/visualizerShader.json";
    const TextureUrl = "/images/visualizerMask_mask.png";

    NodeMaterial.IgnoreTexturesAtLoadTime = true;
    const material = await NodeMaterial.ParseFromFileAsync(
      "Visualizer.material",
      ShaderUrl,
      scene
    );
    material.build(false);

    const texture = new Texture(TextureUrl, scene, false, true);
    texture.uOffset = texture.vOffset = 0.08;
    texture.uScale = texture.vScale = 0.84;
    texture.vScale = 0.84;

    const mask = material.getBlockByName("visualizerMask") as any;
    mask.texture = texture;

    const mesh = MeshBuilder.CreatePlane(
      "Visualizer.mesh",
      { width: 4, height: 2 },
      scene
    );
    mesh.material = material;
    mesh.scaling = new Vector3(2, 4, 1);
    mesh.visibility = 0.1;

    const columns: any[] = [];
    for (let i = 1; i < 17; i++) {
      columns.push(material.getBlockByName(`col${i}`));
    }

    scene.registerBeforeRender(() => {
      var frequencies = analyzer.getByteFrequencyData();
      for (let i = 0; i < 16; i++) {
        columns[i].value = frequencies[i] / 255;
      }
    });
  }
}
