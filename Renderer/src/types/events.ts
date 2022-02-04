import type { Instruction } from "./instructions";

interface LogEventData {
    content: string;
}

interface TickEventData {
    instructions: Instruction[]
}

export {
    LogEventData,
    TickEventData
}