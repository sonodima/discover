using System.Net;
using System.Threading.Tasks;

namespace Discover
{
    public class HttpServer
    {
        private readonly HttpListener _server;
        private static readonly string url = "http://localhost:8000/";

        public HttpServer()
        {
            _server = new HttpListener();
            _server.Prefixes.Add(url);
            _server.Start();

            var handler = HandleConnections();
            handler.GetAwaiter().GetResult();

            _server.Close();
        }

        public async Task HandleConnections()
        {
            while(true)
            {
                // Wait until a connection gets created
                var context = await _server.GetContextAsync();

                var req = context.Request;
                var res = context.Response;


            }
        }
    }
}
