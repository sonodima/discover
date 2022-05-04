using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text.Json;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace Discover.Net
{
    internal class Server
    {
        private readonly HttpServer _http;

        /// <summary>
        ///     Creates a new WebServer with the given parameters.
        /// </summary>
        /// <param name="port">The port on which to listen for connections.</param>
        /// <param name="root">The path to the document folder for this server.</param>
        /// <exception cref="ArgumentOutOfRangeException ">The port is less than 1 or greater than 65535.</exception>
        /// <exception cref="ArgumentNullException">The root parameter is null.</exception>
        /// <exception cref="ArgumentException">The root parameter is an invalid (or absolute) path or an empty string.</exception>
        internal Server(int port, string root)
        {
            _http = new HttpServer(IPAddress.Any, port)
            {
                DocumentRootPath = root
            };

            // Little reflection hack to disable Nagle's algorithm.
            try
            {
                var listener = typeof(WebSocketServer).GetField("_listener").GetValue(_http) as TcpListener;
                if (listener != null)
                {
                    listener.Server.NoDelay = true;
                }
            }
            catch (Exception)
            {
                // ignored
            }

            _http.OnGet += Server_OnGet;
            _http.AddWebSocketService<SocketService>("/connector");
        }

        /// <summary>
        ///     Starts the WebServer.
        ///     Does nothing if the server has already been started.
        /// </summary>
        /// <exception cref="InvalidOperationException">The underlying HttpListener has failed to start.</exception>
        internal void Start()
        {
            _http.Start();
        }

        /// <summary>
        ///     Stops the WebServer and closes all active connections.
        ///     Does nothing if the server has not been started.
        /// </summary>
        internal void Stop()
        {
            _http.Stop();
        }

        /// <summary>
        ///     Broadcasts an object to all clients, using JSON serialization with camelCase naming policy.
        /// </summary>
        /// <param name="data">The object to send.</param>
        /// <exception cref="NotSupportedException">The object is not serializable.</exception>
        /// <exception cref="InvalidOperationException">The server has not been started.</exception>
        /// <exception cref="ArgumentException">The serialized data could not be UTF-8-encoded.</exception>
        internal void Send(object data)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var raw = JsonSerializer.Serialize(data, options);
            if (!raw.IsNullOrEmpty())
            {
                _http.WebSocketServices["/connector"].Sessions.Broadcast(raw);
            }
        }

        /// <summary>
        ///     Handles Http::Get requests.
        /// </summary>
        /// <param name="_"></param>
        /// <param name="args">Arguments of the HttpRequest.</param>
        /// <exception cref="ArgumentException">Request path contains invalid characters.</exception>
        /// <exception cref="InvalidDataException">The mime type is not registered for this file extension.</exception>
        private static void Server_OnGet(object _, HttpRequestEventArgs args)
        {
            var req = args.Request;
            var res = args.Response;

            var path = req.RawUrl;
            if (path == "/" || path.IsNullOrEmpty())
            {
                path = "index.html";
            }

            if (!args.TryReadFile(path, out var data))
            {
                res.StatusCode = (int) HttpStatusCode.NotFound;
                return;
            }

            Mime.Types.TryGetValue(Path.GetExtension(path), out var mime);
            if (mime.IsNullOrEmpty())
            {
                throw new InvalidDataException("The mime type is not registered for this file extension.");
            }

            res.ContentType = mime;
            res.ContentLength64 = data.Length;

            res.Close(data, true);
        }
    }
}