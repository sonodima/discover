<h1 align="center">Discover 👁</h1>
<p>
</p>

> Internal Discord drawing, externally. (very externally, you can even use a different device to draw on the target one)

### Proof of concept

![could not load the poc](/media/poc.gif?raw=true)

# Wait what?

After hooking the target process, Discord initializes an Electron window that loads a URL similar to this `https://discord.com/overlay?build_id=x&rpc=y&rpc_auth_token=z&pid=w`
<br>
It then copies the frame buffer from this window and draws it over the game's window.
Then it copies this window's frame buffer and draws it on the game window.

By having Discord load a locally hosted WebGL 2.0 renderer, we can communicate with it to draw on games and (potentially) get keyboard input.

# Setup

You can set up the overlay using two different methods:

- [Patching the executable.](#patching-the-executable)
- [Proxying the requests.](#proxying-the-requests)

## Patching the executable

Replace Discord's request URL with your loopback URL in the file `AppData\Local\Discord\app*\modules\discord_overlay2-1\discord_overlay2\host.js`

```javascript
function createRenderer(pid, url) {
  ...
  urlWithPid.searchParams.append('pid', pid.toString());
  url = urlWithPid.toString();
  // Begin page hijacking.
  url = "http://127.0.0.1:4001/";
  // End page hijacking.
  renderers[pid] = {
    pid: pid,
  ...
}
```
In the CSharp project, there is a method that automatically patches Discord with a given IP address and port.
To unpatch it (and restore the original overlay) you just have to remove the `url = "xxx";` line from `host.js`.

## Proxying the requests

This is the recommended method because you are not touching Discord's files, and the result will be maintained, even after software updates.

# Build

You can build this project on either Windows or Linux.
<br>
The shared library build allows you to use it within your existing projects. An example of how to use it this way is DiscoverSharp inside the bindings folder.

### Prerequisites

- [GoLang](https://golang.org/dl/)
- [Node.js](https://nodejs.org/)
- [MinGW-W64](https://netix.dl.sourceforge.net/project/mingw-w64/Toolchains%20targetting%20Win32/Personal%20Builds/mingw-builds/installer/mingw-w64-install.exe) (Windows only)
- [Discord](https://golang.org/dl/) (only required on the guest machine)

### Compile

- Run `setup.sh`
- Run the build script for the output you desire.

# Usage

- Make sure Discord is closed and launch the program.
- Open Discord.
- Enable `GameOverlay` if it's not enabled yet.
- Launch any game and enjoy internal drawing.
