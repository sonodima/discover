# Wait what?

After hooking the target process, Discord initializes an Electron window that loads a URL that looks something like this `https://discord.com/overlay?build_id=x&rpc=y&rpc_auth_token=z&pid=w`
<br>
It then copies the frame buffer from this window and draws it over the game's window.

By making Discord load a local hosted WebGL 2.0 renderer, we can communicate with it in order to draw over games and (potentially) get keyboard inputs.

# Setup.

You can set up the overlay using two different methods:

- [Proxying the requests.](#proxying-the-requests)
- [Patching the executable.](#patching-the-executable)

## Proxying the requests.

This is the recommended method because you are not touching Discord's files, and the result will be maintained, even after software updates.

## Patching the executable.

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
