import "./css/style.css";
// import BasicScene from "./BasicScene";
// import BasicScene from "./demo/Audio";
// import BasicScene from "./demo/Village";
// import BasicScene from "./CarAnimation";
// import BasicScene from "./demo/VillageAnimation";
// import BasicScene from "./demo/CarAnimation";//汽车动画
// import BasicScene from "./Coordinate";//坐标轴
// import BasicScene from "./demo/MoveToPath"; //沿路径移动
// import BasicScene from "./PeopleWalk"; //沿路径移动
// import BasicScene from "./demo/IntersectsMesh"; //沿路径移动
// import BasicScene from "./demo/GroundHill"; //村庄地面
// import BasicScene from "./demo/VillageCarAnimation"; //沿路径移动
// import BasicScene from "./demo/SkyBox"; //天空盒
// import BasicScene from "@/demo/Sprite"; //精灵材质
// import BasicScene from "./demo/Particles"; //粒子系统
// import BasicScene from "./demo/StreetLight"; //创建路灯
// import BasicScene from "./demo/EntireVillage.ts"; //村庄完整版
// import BasicScene from "./Basic/Shadow.ts"; //阴影

// import BasicScene from "./Audio/Audio";
// import BasicScene from "./Audio/Capture";
// import BasicScene from "./Audio/FromMicroPhone"; //从麦克风获取音频
// import BasicScene from "./Audio/SpatialSound"; //空间音频
// import BasicScene from "./Audio/AttachToMesh"; //空间音频
// import BasicScene from "./Audio/SpatialDirectional"; //空间音频
// import BasicScene from "./Audio/UsingAnalyser"; //声音分析器
// import BasicScene from "./Animation/DesignAnimation"; //动画
// import BasicScene from "./Animation/SequenceAnimation"; //序列动画
// import BasicScene from "./Animation/GroupAnimation"; //分组动画
// import BasicScene from "./Animation/CombineAnimation"; //组合动画
// import BasicScene from "./Animation/CharacterAnimation"; //角色动画
// import BasicScene from "./Animation/AdvanceAnimation"; //高级动画
// import BasicScene from "./Animation/BlendingAnimation"; //混合动画
// import BasicScene from "./Animation/WeightAnimation"; //权重动画
// import BasicScene from "./Animation/AdditiveAnimation"; //附加动画
// import BasicScene from "@/Animation/EasingAnimation"; //缓动动画
// import BasicScene from "@/Animation/RenderLoopAnimation"; //渲染循环动画
// import BasicScene from "@/GUI/GUI"; //GUI
// import BasicScene from "@/GUI/FullscreenMode"; //按钮全屏模式
// import BasicScene from "@/GUI/TextureMode"; //按钮贴图模式
// import BasicScene from "@/GUI/ObservablesExample"; //鼠标交互
// import BasicScene from "@/GUI/ObservablePointClick"; //点击交互
// import BasicScene from "@/GUI/AlignmentsExample"; //布局
// import BasicScene from "@/GUI/PositionAndSize"; //位置和尺寸
// import BasicScene from "@/GUI/TrackableLabel"; //位置跟踪标签
// import BasicScene from "@/GUI/OverlapGroup"; //重叠组
// import BasicScene from "@/GUI/InputText"; //控制输入文本
// import BasicScene from "@/GUI/Button"; //控制按钮
// import BasicScene from "@/GUI/Checkbox"; //控制复选框
// import BasicScene from "@/GUI/RadioButton"; //控制单选按钮
// import BasicScene from "@/GUI/Slider"; //滑块
import BasicScene from "@/GUI/ImageSlider"; //滑块

const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
new BasicScene(canvas);
