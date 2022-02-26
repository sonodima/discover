/**
 * Discover Injector for NVIDIA Share.
 */

async function runNativeCommand(req) {
    return await new Promise((resolve, reject) => {
        window.cefQuery({
            request: JSON.stringify(req),
            persistent: false,
            onSuccess: (res) => {
                resolve(res);
            },
            onFailure: (res, err) => {
                reject(err);
            },
        });
    });
}

async function openOSC(enableInput) {
    return await runNativeCommand({
        command: "QUERY_WIN_OPEN_OSC",
        enableInput: enableInput,
    });
}

const body = document.querySelector("body");

var styles = document.createElement("style");
body.appendChild(styles);
styles.innerText = `
    .nv-btn {
      position: absolute;
      bottom: 10px;
      left: 10px;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 8px;
      background-color: #212121;
      color: #6db823;
      border: 1px solid #6db823;
      transition: all 0.2s ease;
    }
        
    .nv-btn:hover {
      background-color: #6db823;
      color: #212121;
    }

    .overlay {
      display: block;
      position: absolute;
      top: 0px;
      left: 0px;
      margin: 0;
      border: none;
      height: 100vh;
      width: 100vw;
    }
`;

// Create "Inject Discover" button.
let button = document.createElement("button");
body.appendChild(button);
button.innerText = "Inject Discover";
button.classList.add("nv-btn");

button.addEventListener("click", async () => {
    // Hide NVIDIA Share interface.
    body.firstElementChild.style.visibility = "hidden";
    button.style.visibility = "hidden";

    // Disable input handling.
    setInterval(() => {
        try {
            openOSC(false);
        } catch (e) {
            console.log(e);
        }
    }, 1000);

    // Create overlay.
    const overlay = document.createElement("iframe");
    body.appendChild(overlay);
    overlay.src = "http://localhost:18842/";
    overlay.classList.add("overlay");
});