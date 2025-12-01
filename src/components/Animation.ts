import { Scene, Vector3, Animation, Mesh } from "@babylonjs/core";

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
  public rotation(
    box: Mesh,
    start: Vector3,
    end: Vector3,
    time: number,
    onComplete?: (node: Mesh) => void
  ) {
    const animation = new Animation(
      `${box.id}_rotationAnimation`,
      "rotation",
      this.framePerSecond,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const keyFrames = this.generateKeyFrames(start, end, time);
    animation.setKeys(keyFrames.keyFrames); // 设置动画帧
    box.animations.push(animation); // 添加动画
    this.scene?.beginAnimation(box, 0, keyFrames.total, false, 1, () => {
      box.rotation = new Vector3(
        end.x % (Math.PI * 2),
        end.y % (Math.PI * 2),
        end.z % (Math.PI * 2)
      );
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
