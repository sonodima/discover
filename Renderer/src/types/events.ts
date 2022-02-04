import type { Instruction } from "./instructions";

interface LogEventData {
    content: string;
}

interface UpdateEventData {
    instructions: Instruction[]
}

export {
    LogEventData,
    UpdateEventData
}