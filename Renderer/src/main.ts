import Log from "./Log";
import Renderer from "./lib/Renderer";
import sleep from "./utils/sleep";

import { LogEventData, SocEvent, SocEventType, TickEventData } from "./types/events";
import { InstructionType, RectangleInstructionData, StringInstructionData } from "./types/instructions";

import "./style.css"


const log = new Log();
log.write("local", "Logger allocated")

const renderer = new Renderer();
log.write("local", "Renderer initialized")

connect();


function handleLogEvent(event: SocEvent) {
    const data = event.data as LogEventData;
    log.write("remote", data.content);
}

function handleTickEvent(event: SocEvent) {
    const data = event.data as TickEventData;

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
async function connect() {
    await new Promise((resolve) => {
        socket = new WebSocket("ws://localhost:3484/connector");

        socket.onopen = () => {
            log.write("local", "Remote connection created");
            resolve(true);
        };

        socket.onclose = async () => {
            log.write("local", "The connection was closed by the remote");
            await sleep(1000);
            connect();
            resolve(false);
        };

        socket.onerror = async () => {
            log.write("local", "An error occurred while attempting to connect");
            await sleep(1000);
            connect();
            resolve(false);
        };

        socket.onmessage = (ev) => {
            console.log(ev);

            const socEvent = JSON.parse(ev.data) as SocEvent;

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
