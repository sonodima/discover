using System.IO;
using System.Net;
using System.Text;
using WebSocketSharp.Server;

namespace Discover.Net
{
    internal class Server
    {
        private readonly HttpServer _http;

        internal Server(int port, string root)
        {
            _http = new HttpServer(IPAddress.Any, port)
            {
                DocumentRootPath = root,
            };

            _http.OnGet += Server_OnGet;

            _http.AddWebSocketService<SocketService>("/connector");
        }

        internal void Start()
        {
            if (!_http.IsListening)
            {
                _http.Start();
            }
        }

        internal void Stop()
        {
            if (_http.IsListening)
            {
                _http.Stop();
            }
        }

        internal void Send(string data)
        {
            var bytes = Encoding.UTF8.GetBytes(data);
            _http.WebSocketServices["/connector"].Sessions.Broadcast(bytes);
        }

        private void Server_OnGet(object sender, HttpRequestEventArgs e)
        {
            var req = e.Request;
            var res = e.Response;

            var path = req.RawUrl;
            if (path == "/")
            {
                path = "index.html";
            }

            if (!e.TryReadFile(path, out var data))
            {
                res.StatusCode = (int)HttpStatusCode.NotFound;
                return;
            }

            Mime.Types.TryGetValue(Path.GetExtension(path), out var mime);
            res.ContentType = mime;
            res.ContentLength64 = data.Length;

            res.Close(data, true);
        }
    }
}
