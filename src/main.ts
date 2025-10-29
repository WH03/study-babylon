import "./style.css";
// import BasicScene from "./BasicScene";
import BasicScene from "./Village";
const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
new BasicScene(canvas);
