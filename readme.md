# Patching Discord

Replace Discord's url with your loopback url in the file `AppData\Local\Discord\app*\modules\discord_overlay2-1\discord_overlay2\host.js`

```javascript
function createRenderer(pid, url) {
  ...
  urlWithPid.searchParams.append('pid', pid.toString());
  url = "http://127.0.0.1:4001/";
  renderers[pid] = {
  ...
}
```
