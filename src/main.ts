import "./style.css";
// import BasicScene from "./BasicScene";
// import BasicScene from "./Village";
import BasicScene from "./VillageAnimation";

const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
new BasicScene(canvas);
