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
import BasicScene from "./Audio/UsingAnalyser"; //声音分析器

const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
new BasicScene(canvas);
