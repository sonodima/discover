enum InstructionType {
    String,
    Rectangle
}

interface Instruction {
    type: InstructionType;
    data: any;
}

interface StringInstructionData {
    content: string;
    font: string;
    color: number;
    alpha: number;
    x: number;
    y: number;
    size: number;
}

interface RectangleInstructionData {
    x: number;
    y: number;
    width: number;
    height: number;
    color: number;
    alpha: number;
    fill: boolean;
    thickness: number;
    radius: number;
}

export {
    InstructionType,
    Instruction,
    StringInstructionData,
    RectangleInstructionData
}