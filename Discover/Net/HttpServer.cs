using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace Discover.Net
{
    internal class HttpServer
    {
        private readonly HttpListener _server;

        internal HttpServer(string host, int port)
        {
            _server = new HttpListener();
            _server.Prefixes.Add($"http://{host}:{port}/");
            _server.Start();

            var handler = HandleConnections();
            handler.GetAwaiter().GetResult();

            _server.Close();
        }

        internal async Task HandleConnections()
        {
            while(true)
            {
                try
                {
                    // Wait until a connection gets created
                    var context = await _server.GetContextAsync();

                    Process(context); 
                }
                catch (Exception)
                {
                }
            }
        }

        private void Process(HttpListenerContext context)
        {
            var req = context.Request;
            var res = context.Response;

            var handlers = new List<Handler>
            {
                new SSE("/connector"),
                new Static("C:\\Users\\User\\Desktop\\Projects\\discover\\Renderer\\dist"),
            };


            foreach (var handler in handlers)
            {
                if (handler.HandleRequest(req, ref res))
                {
                    return;
                }
            }

            res.StatusCode = (int)HttpStatusCode.NotFound;
        }
    }
}
