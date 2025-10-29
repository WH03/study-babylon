import { defineConfig } from "vite";
export default defineConfig({
  server: {
    port: 8000, // 设置端口号为 3000
    host: "0.0.0.0", // 可选：监听所有地址
    open: true, // 可选：启动后自动打开浏览器
  },
});
