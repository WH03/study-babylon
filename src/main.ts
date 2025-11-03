import "./style.css";
// import BasicScene from "./BasicScene";
// import BasicScene from "./Village";
// import BasicScene from "./CarAnimation";
import BasicScene from "./VillageAnimation";
// import BasicScene from "./Coordinate";
// import BasicScene from "./MoveToPath"; //沿路径移动
// import BasicScene from "./PeopleWalk"; //沿路径移动
// import BasicScene from "./IntersectsMesh"; //沿路径移动

const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
new BasicScene(canvas);
