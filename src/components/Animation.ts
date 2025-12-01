import { Scene, Vector3, Animation, Mesh, Quaternion } from "@babylonjs/core";

export default class Animations {
  private scene: Scene;
  private framePerSecond = 30;
  constructor(scene: Scene) {
    this.scene = scene;
    this.framePerSecond = scene.getEngine().getFps(); // 30;
  }
  //  移动动画
  public move(
    box: Mesh,
    start: Vector3,
    end: Vector3,
    time: number,
    onComplete?: (node: Mesh) => void
  ) {
    const animation = new Animation(
      `${box.id}_positionAnimation`,
      "position",
      this.framePerSecond,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const keyFrames = this.generateKeyFrames(start, end, time);
    animation.setKeys(keyFrames.keyFrames); // 设置动画帧
    box.animations.push(animation); // 添加动画
    this.scene?.beginAnimation(box, 0, keyFrames.total, false, 1, () => {
      box.position = end;
      removeAnim(box, animation);
      onComplete?.call(null, box);
    });
  }

  //    缩放动画
  public scaling(
    box: Mesh,
    start: Vector3,
    end: Vector3,
    time: number,
    onComplete?: (node: Mesh) => void
  ) {
    const animation = new Animation(
      `${box.id}_scalingAnimation`,
      "scaling",
      this.framePerSecond,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const keyFrames = this.generateKeyFrames(start, end, time);
    animation.setKeys(keyFrames.keyFrames); // 设置动画帧
    box.animations.push(animation); // 添加动画
    this.scene?.beginAnimation(box, 0, keyFrames.total, false, 1, () => {
      box.scaling = end;
      removeAnim(box, animation);
      onComplete?.call(null, box);
    });
  }
  // 旋转动画
  // public rotation(
  //   box: Mesh,
  //   start: Vector3,
  //   end: Vector3,
  //   time: number,
  //   onComplete?: (node: Mesh) => void
  // ) {
  //   const animation = new Animation(
  //     `${box.id}_rotationAnimation`,
  //     "rotation",
  //     this.framePerSecond,
  //     Animation.ANIMATIONTYPE_VECTOR3,
  //     Animation.ANIMATIONLOOPMODE_CONSTANT
  //   );
  //   const keyFrames = this.generateKeyFrames(start, end, time);
  //   animation.setKeys(keyFrames.keyFrames); // 设置动画帧
  //   box.animations.push(animation); // 添加动画
  //   this.scene?.beginAnimation(box, 0, keyFrames.total, false, 1, () => {
  //     box.rotation = new Vector3(
  //       end.x % (Math.PI * 2),
  //       end.y % (Math.PI * 2),
  //       end.z % (Math.PI * 2)
  //     );
  //     removeAnim(box, animation);
  //     onComplete?.call(null, box);
  //   });
  // }
  // 🔥 优化后的四元数旋转方法
  public rotation(
    box: Mesh,
    start: Vector3, // 起始欧拉角（弧度），保持原参数类型兼容
    end: Vector3, // 结束欧拉角（弧度），保持原参数类型兼容
    time: number,
    onComplete?: (node: Mesh) => void
  ) {
    // 1. 初始化 rotationQuaternion（若物体未设置，需手动创建）
    if (!box.rotationQuaternion) {
      box.rotationQuaternion = new Quaternion();
    }

    // 2. 欧拉角 → 四元数转换（核心步骤）
    const startQuat = Quaternion.FromEulerVector(start); // 起始四元数
    const endQuat = Quaternion.FromEulerVector(
      new Vector3(
        end.x % (Math.PI * 2),
        end.y % (Math.PI * 2),
        end.z % (Math.PI * 2)
      )
    ); // 结束四元数（角度取模）

    // 3. 创建四元数旋转动画
    const animation = new Animation(
      `${box.id}_rotationQuaternionAnimation`, // 动画名称区分原旋转动画
      "rotationQuaternion", // 目标属性：四元数旋转
      this.framePerSecond,
      Animation.ANIMATIONTYPE_QUATERNION, // 动画类型：四元数
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // 4. 生成四元数关键帧
    const keyFrames = this.generateQuaternionKeyFrames(
      startQuat,
      endQuat,
      time
    );
    animation.setKeys(keyFrames.keyFrames);

    // 5. 执行动画
    box.animations.push(animation);
    this.scene?.beginAnimation(box, 0, keyFrames.total, false, 1, () => {
      // 动画结束后强制设置目标四元数（确保精准）
      box.rotationQuaternion!.copyFrom(endQuat);
      removeAnim(box, animation);
      onComplete?.call(null, box);
    });
  }

  //   创建动画帧
  private generateKeyFrames(
    from: Vector3,
    to: Vector3,
    duration: number,
    delay: number = 0
  ) {
    const total = ((duration + delay) * this.framePerSecond) / 1000;
    const result: Array<{ frame: number; value: Vector3 }> = [];
    if (delay > 0) {
      result.push({ frame: 0, value: from });
    }
    result.push({ frame: (delay * this.framePerSecond) / 1000, value: from });
    result.push({ frame: total, value: to });
    return { keyFrames: result, total };
  }

  // 🔥 新增：四元数关键帧生成方法
  private generateQuaternionKeyFrames(
    from: Quaternion,
    to: Quaternion,
    duration: number,
    delay: number = 0
  ) {
    const total = ((duration + delay) * this.framePerSecond) / 1000;
    const result: Array<{ frame: number; value: Quaternion }> = [];

    // 延迟逻辑与原方法一致
    if (delay > 0) {
      result.push({ frame: 0, value: from });
    }
    result.push({ frame: (delay * this.framePerSecond) / 1000, value: from });
    result.push({ frame: total, value: to });

    return { keyFrames: result, total };
  }
}
// 移除动画
function removeAnim(box: Mesh, animation: Animation) {
  const index = box.animations.findIndex((item) => {
    return item.name == animation.name;
  });
  if (index > -1) {
    box.animations.splice(index, 1);
  }
}
