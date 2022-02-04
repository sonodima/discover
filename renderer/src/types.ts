export enum InstructionType {
  String,
  Polygon,
  Rectangle,
  Circle,
}

export interface Instruction {
  type: InstructionType;
  data: any;
}

export interface RenderQueue {
  instructions: Instruction[];
}

export interface StringInstruction {
  x: number;
  y: number;
  text: string;
  color: number;
  alpha: number;
  stroke: boolean | undefined;
  strokeColor: number | undefined;
  strokeThickness: number | undefined;
}

export interface PolygonInstruction {
  path: number[];
  color: number;
  alpha: number;
  fill: boolean;
  thickness: number | undefined;
}

export interface RectangleInstruction {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: number;
  alpha: number;
  fill: boolean;
  thickness: number | undefined;
  radius: number | undefined;
}

export interface CircleInstruction {
  x: number;
  y: number;
  radius: number;
  color: number;
  alpha: number;
  fill: boolean;
  thickness: number | undefined;
}
