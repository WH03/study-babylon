import "./css/style.css";
// import BasicScene from "./BasicScene";
// import BasicScene from "./demo/Village";
// import BasicScene from "./CarAnimation";
// import BasicScene from "./demo/VillageAnimation";
// import BasicScene from "./demo/CarAnimation";
// import BasicScene from "./Coordinate";
// import BasicScene from "./MoveToPath"; //沿路径移动
// import BasicScene from "./PeopleWalk"; //沿路径移动
// import BasicScene from "./demo/IntersectsMesh"; //沿路径移动
// import BasicScene from "./demo/GroundHill"; //村庄地面
// import BasicScene from "./demo/VillageCarAnimation"; //沿路径移动
// import BasicScene from "./demo/SkyBox"; //天空盒
import BasicScene from "./demo/Sprite"; //精灵材质

const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
new BasicScene(canvas);
