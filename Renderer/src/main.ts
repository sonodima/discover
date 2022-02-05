import Log from "./Log";
import Renderer from "./lib/Renderer";

import type { LogEventData, TickEventData } from "./types/events";
import { InstructionType, RectangleInstruction, StringInstruction } from "./types/instructions";

import "./style.css"

// const sourcePath = "//localhost:3484/connector";


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

socket.addEventListener("log", (event) => {
    const message = event as MessageEvent;
    const data = JSON.parse(message.data) as LogEventData;

    log.write("remote", data.content);
});

socket.addEventListener("tick", (event) => {
    const message = event as MessageEvent;
    const data = JSON.parse(message.data) as TickEventData;

    data.instructions.forEach((instruction) => {
        switch (instruction.type) {
            case InstructionType.String:
                renderer.drawString(instruction.data as StringInstruction);
                break;

            case InstructionType.Rectangle:
                renderer.drawRect(instruction.data as RectangleInstruction);
                break;
        }
    });
});

