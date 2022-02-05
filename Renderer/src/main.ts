import Log from "./Log";
import Renderer from "./lib/Renderer";

import { LogEventData, SocEvent, SocEventType, TickEventData } from "./types/events";
import { InstructionType, RectangleInstructionData, StringInstructionData } from "./types/instructions";

import "./style.css"



const sourcePath = "ws://localhost:3484/connector";



const log = new Log();
log.write("local", "Logger allocated")

const renderer = new Renderer();
log.write("local", "Renderer initialized")

const socket = new WebSocket(sourcePath);

socket.addEventListener("open", () => {
    log.write("local", "Remote connection created")
});

socket.addEventListener("error", () => {
    log.write("local", "An error occurred while attempting to connect")
});

socket.addEventListener("message", (event: MessageEvent<SocEvent>) => {

    console.log(event.data);

    switch (event.data.type) {
        case SocEventType.Log:
            handleLogEvent(event);
            break;

        case SocEventType.Tick:
            handleTickEvent(event);
            break;
    }
});

const handleLogEvent = (event: MessageEvent<SocEvent>) => {
    const data = event.data.data as LogEventData;
    log.write("remote", data.content);
}

const handleTickEvent = (event: MessageEvent<SocEvent>) => {
    const data = event.data.data as TickEventData;

    data.instructions.forEach((instruction) => {
        switch (instruction.type) {
            case InstructionType.String:
                renderer.drawString(instruction.data as StringInstructionData);
                break;

            case InstructionType.Rectangle:
                renderer.drawRect(instruction.data as RectangleInstructionData);
                break;
        }
    });
}
