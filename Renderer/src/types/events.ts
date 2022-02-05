import type { Instruction } from "./instructions";

enum SocEventType {
    Log,
    Tick,
}

interface SocEvent {
    type: SocEventType,
    data: any,
}

interface LogEventData {
    content: string;
}

interface TickEventData {
    instructions: Instruction[]
}

export {
    SocEventType,
    SocEvent,
    LogEventData,
    TickEventData
}