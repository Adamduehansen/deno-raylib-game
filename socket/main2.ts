import {
  beginDrawing,
  closeWindow,
  DarkGray,
  drawText,
  endDrawing,
  getFPS,
  initWindow,
  setTargetFPS,
  windowShouldClose,
} from "../src/raylib-bindings.ts";

initWindow({
  title: "Socket test 2",
  height: 450,
  width: 800,
});

setTargetFPS(60);

async function* frames() {
  while (true) {
    const restTime = 1000 / getFPS();
    await new Promise((r) => setTimeout(r, restTime));
    yield windowShouldClose();
  }
}

let socket: WebSocket | null = null;
socket = new WebSocket("ws://localhost:8000/ws");
socket.addEventListener("open", () => {
  console.log("Connect established!");
});
socket.addEventListener("close", () => {
  console.log("Connection closed!");
});
socket.addEventListener("message", (event) => {
  console.log("Connection message", event.data);
});

for await (const shouldClose of frames()) {
  if (shouldClose) {
    break;
  }

  beginDrawing();

  drawText({
    text: "Hello, World!",
    posX: 10,
    posY: 10,
    color: DarkGray,
    fontSize: 32,
  });

  endDrawing();
}

closeWindow();
socket.close();
