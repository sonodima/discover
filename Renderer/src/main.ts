import Log from "./utils/Log";
import Renderer from "./lib/Renderer";
import sleep from "./utils/sleep";

import { LogEventData, SocEvent, SocEventType, TickEventData } from "./types/events";
import { InstructionType, RectangleInstructionData, StringInstructionData } from "./types/instructions";

import "./style.css"


const log = new Log();
log.write("local", "Logger created")

const renderer = new Renderer();
log.write("local", "Renderer initialized")


function handleLogEvent(event: SocEvent) {
    const data = event.data as LogEventData;
    log.write("remote", data.content);
}

function handleTickEvent(event: SocEvent) {
    const data = event.data as TickEventData;

    renderer.clear();
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

let socket: WebSocket | undefined;
const connect = async () => {
    await new Promise((resolve) => {
        socket = new WebSocket(`ws://${location.host}/connector`);
        
        
        socket.onopen = () => {
            log.write("local", "Remote connection created");
            resolve(true);
        };

        socket.onclose = async () => {
            log.write("local", "The connection was closed by the remote");
            await sleep(1000);
            await connect();
            resolve(false);
        };

        socket.onerror = async () => {
            log.write("local", "An error occurred while attempting to connect");
            await sleep(1000);
            await connect();
            resolve(false);
        };

        socket.onmessage = (event: MessageEvent<string>) => {
            const socEvent = JSON.parse(event.data) as SocEvent;

            switch (socEvent.type) {
                case SocEventType.Log:
                    handleLogEvent(socEvent);
                    break;

                case SocEventType.Tick:
                    handleTickEvent(socEvent);
                    break;
            }
        };
    });
};

connect();