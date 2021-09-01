import * as PIXI from "pixi.js";

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundAlpha: 0,
  antialias: true,
});
document.body.appendChild(app.view);

enum InstructionType {
  String,
  Polygon,
  Rectangle,
  Circle,
}

interface Point {
  x: number;
  y: number;
}

interface Instruction {
  type: InstructionType;
  data: any;
}

interface RenderQueue {
  instructions: Instruction[];
}

interface StringInstruction {
  position: Point;
  text: string;
}

interface PolygonInstruction {
  points: Point[];
  color: number;
  alpha: number;
  fill: boolean;
  thickness: number | undefined;
}

interface RectangleInstruction {
  start: Point;
  end: Point;
  color: number;
  alpha: number;
  fill: boolean;
  thickness: number | undefined;
  radius: number | undefined;
}

interface CircleInstruction {
  position: Point;
  radius: number;
  color: number;
  alpha: number;
  fill: boolean;
  thickness: number | undefined;
}

const drawString = (data: StringInstruction) => {
  const child = new PIXI.Text(data.text);
  child.x = data.position.x;
  child.y = data.position.y;
  app.stage.addChild(child);
};

const drawPolygon = (graphics: PIXI.Graphics, data: PolygonInstruction) => {
  if (data.points.length < 2) {
    return;
  }

  let path: number[] = [];
  data.points.forEach((point) => {
    path.push(point.x, point.y);
  });

  if (data.fill) {
    graphics.beginFill(data.color, data.alpha);
    graphics.lineStyle(0);
  } else if (data.thickness) {
    graphics.lineStyle(data.thickness, data.color, data.alpha);
  }

  graphics.drawPolygon(path);

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
      data.start.x,
      data.start.y,
      data.end.x - data.start.x,
      data.end.y - data.start.y,
      data.radius
    );
  } else {
    graphics.drawRect(
      data.start.x,
      data.start.y,
      data.end.x - data.start.x,
      data.end.y - data.start.y
    );
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

  graphics.drawCircle(data.position.x, data.position.y, data.radius);

  if (data.fill) {
    graphics.endFill();
  }
};

const socket = new WebSocket("ws://localhost:4001/ws/queue");

socket.addEventListener("open", (event) => {});

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
