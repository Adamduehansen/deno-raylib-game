import {
  beginDrawing,
  closeWindow,
  DarkGray,
  drawText,
  endDrawing,
  initWindow,
  setTargetFPS,
  windowShouldClose,
} from "../src/raylib-bindings.ts";

if (import.meta.main) {
  const worker = new Worker(
    new URL("./worker.ts", import.meta.url).href,
    {
      type: "module",
    },
  );

  initWindow({
    title: "Socket test",
    width: 800,
    height: 450,
  });

  setTargetFPS(60);

  // CANT DO
  // const intervalId = setInterval(() => {
  //   worker.postMessage({
  //     name: "World",
  //   });
  // }, 1000);

  while (windowShouldClose() === false) {
    worker.postMessage("ping");

    const _messageQueueFile = await Deno.readTextFile(
      "./socket/message-queue.json",
    );
    // console.log(messageQueueFile);

    // Draw
    // ------------------------------------------------------------------------

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
  worker.postMessage({
    type: "close",
  });
  worker.terminate();
  // clearInterval(intervalId);
}
