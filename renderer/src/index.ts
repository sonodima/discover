import * as PIXI from "pixi.js";
import {
  StringInstruction,
  PolygonInstruction,
  RectangleInstruction,
  CircleInstruction,
  RenderQueue,
  InstructionType,
} from "./types";

document.body.style.overflow = "hidden";
document.body.style.margin = "0px";

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundAlpha: 0,
  antialias: true,
});
document.body.appendChild(app.view);

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const drawString = (data: StringInstruction) => {
  const style = new PIXI.TextStyle({
    fill: data.color,
  });

  if (data.stroke) {
    style.stroke = data.strokeColor;
    style.strokeThickness = data.strokeThickness;
  }

  const child = new PIXI.Text(data.text, style);
  child.alpha = data.alpha;
  child.x = data.x;
  child.y = data.y;
  app.stage.addChild(child);
};

const drawPolygon = (graphics: PIXI.Graphics, data: PolygonInstruction) => {
  if (data.fill) {
    graphics.beginFill(data.color, data.alpha);
    graphics.lineStyle(0);
  } else if (data.thickness) {
    graphics.lineStyle(data.thickness, data.color, data.alpha);
  }

  graphics.drawPolygon(data.path);

  if (data.fill) {
    graphics.endFill();
  }
};

const drawRectangle = (graphics: PIXI.Graphics, data: RectangleInstruction) => {
  if (data.fill) {
    graphics.beginFill(data.color, data.alpha);
    graphics.lineStyle(0);
  } else if (data.thickness) {
    graphics.lineStyle(data.thickness, data.color, data.alpha);
  }

  if (data.radius) {
    graphics.drawRoundedRect(
      data.x1,
      data.y2,
      data.x2 - data.x1,
      data.y2 - data.y1,
      data.radius
    );
  } else {
    graphics.drawRect(data.x1, data.y2, data.x2 - data.x1, data.y2 - data.y1);
  }

  if (data.fill) {
    graphics.endFill();
  }
};

const drawCircle = (graphics: PIXI.Graphics, data: CircleInstruction) => {
  if (data.fill) {
    graphics.beginFill(data.color, data.alpha);
    graphics.lineStyle(0);
  } else if (data.thickness) {
    graphics.lineStyle(data.thickness, data.color, data.alpha);
  }

  graphics.drawCircle(data.x, data.y, data.radius);

  if (data.fill) {
    graphics.endFill();
  }
};

const connect = async () => {
  let socket: WebSocket;

  await new Promise((resolve) => {
    socket = new WebSocket("ws://localhost:4001/ws/queue");

    socket.addEventListener("open", (event) => {
      console.log("opened");
      resolve(true);
    });

    socket.addEventListener("close", async () => {
      app.stage.removeChildren();
      await sleep(1000);
      connect();
      resolve(false);
    });

    socket.addEventListener("error", async () => {
      app.stage.removeChildren();
      await sleep(1000);
      connect();
      resolve(false);
    });

    socket.addEventListener("message", (event: MessageEvent<string>) => {
      const queue: RenderQueue = JSON.parse(event.data);
      app.stage.removeChildren();

      const graphics = new PIXI.Graphics();

      queue.instructions.forEach((instruction) => {
        switch (instruction.type) {
          case InstructionType.String:
            drawString(instruction.data);
            break;

          case InstructionType.Polygon:
            drawPolygon(graphics, instruction.data);
            break;

          case InstructionType.Rectangle:
            drawRectangle(graphics, instruction.data);
            break;

          case InstructionType.Circle:
            drawCircle(graphics, instruction.data);

          default:
            break;
        }
      });

      app.stage.addChild(graphics);
    });
  });
};

connect();
