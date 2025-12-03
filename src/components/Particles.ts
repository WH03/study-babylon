import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  ParticleSystem,
  Texture,
  Color4,
  PointerEventTypes,
} from "@babylonjs/core";
export default class Particle {
  private scene: Scene;
  constructor(scene: Scene) {
    this.scene = scene;
    this.CreateParticles(scene);
  }

  // 创建粒子
  CreateParticles(scene: Scene) {
    // // 创建轮廓
    const fountainProfile = [
      new Vector3(0, 0, 0),
      new Vector3(0.5, 0, 0),
      new Vector3(0.5, 0.2, 0),
      new Vector3(0.4, 0.2, 0),
      new Vector3(0.4, 0.05, 0),
      new Vector3(0.05, 0.1, 0),
      new Vector3(0.05, 0.8, 0),
      new Vector3(0.15, 0.9, 0),
    ];

    // 创建模型
    const fountain = MeshBuilder.CreateLathe(
      "fountain",
      {
        shape: fountainProfile, //轮廓
        sideOrientation: Mesh.DOUBLESIDE, //双面
      },
      this.scene
    );
    fountain.position = new Vector3(-4, 0, -6);

    // 创建粒子系统：粒子名称，粒子数量，场景
    const particleSystem = new ParticleSystem("particles", 5000, this.scene);
    // 粒子纹理
    particleSystem.particleTexture = new Texture(
      "/Particles/flare.png",
      this.scene
    );
    // 发射位置
    particleSystem.emitter = new Vector3(-4, 0.8, -6);
    particleSystem.minEmitBox = new Vector3(-0.01, 0, -0.01); //发射器最小范围
    particleSystem.maxEmitBox = new Vector3(0.01, 0, 0.01); //发射器最大范围
    // 颜色
    particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
    // particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

    // 粒子大小
    particleSystem.minSize = 0.01;
    particleSystem.maxSize = 0.05;
    // 粒子速率
    particleSystem.emitRate = 1500;
    // 粒子生命周期
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;
    // 混合模式
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
    // 重力
    particleSystem.gravity = new Vector3(0, -9.81, 0);
    // 粒子发射方向
    particleSystem.direction1 = new Vector3(-1, 8, 1);
    particleSystem.direction2 = new Vector3(1, 8, -1);
    // 粒子发射角度
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // 粒子发射速度
    particleSystem.minEmitPower = 0.2;
    particleSystem.maxEmitPower = 0.6;
    particleSystem.updateSpeed = 0.01;

    // 开关控制启停
    let switched = false;
    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
          const pickMesh = pointerInfo.pickInfo?.pickedMesh;
          if (pickMesh === fountain) {
            switched = !switched;
          }
          //开关
          if (switched) {
            // 启动
            particleSystem.start();
          } else {
            // 停止
            particleSystem.stop();
          }
      }
    });
  }
}
