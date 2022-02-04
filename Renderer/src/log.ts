class Log {
    private container: HTMLDivElement;
    private content: HTMLSpanElement;
    private closeTimeout: NodeJS.Timeout | undefined;

    constructor() {
        this.container = document.createElement("div");
        this.container.classList.add("log-container");

        const title = document.createElement("span");
        title.classList.add("log-title");
        title.textContent = "Discover Log";
        this.container.appendChild(title);

        this.content = document.createElement("span");
        this.content.classList.add("log-content");
        this.container.appendChild(this.content);

        document.querySelector<HTMLDivElement>("#app")?.appendChild(this.container);
    }

    write(source: "local" | "remote",  message: string) {
        this.content.innerText = `[${source}] ${message}\n${this.content.innerText}`;

        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
        }

        this.show();
        this.closeTimeout = setTimeout(() => {
            this.hide();
        }, 5000);
    }

    clear() {
        this.content.innerText = "";
    }

    show() {
        this.container.style.opacity = "1";
    }

    hide() {
        this.container.style.opacity = "0";
    }
}

export default Log;