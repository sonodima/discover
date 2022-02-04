enum InstructionType {
    String,
    Rectangle
}

interface Instruction {
    type: InstructionType;
    data: any;
}

interface StringInstruction {
    content: string;
    font: string;
    color: number;
    x: number;
    y: number;
    size: number;
}

interface RectangleInstruction {
    x: number;
    y: number;
    width: number;
    height: number;
    color: number;
    fill: boolean;
    thickness: number;
    radius: number;
    alpha: number;
}

export {
    InstructionType,
    Instruction,
    StringInstruction,
    RectangleInstruction
}