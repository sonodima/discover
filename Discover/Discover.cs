using System.Net;
using System.Linq;
using System.Text;
using System;
using System.Collections.Generic;
using System.Threading;
using WebSocketSharp;
using WebSocketSharp.Server;
using System.IO;
using System.Text.Json;
using System.Reflection;
using System.IO.Compression;

using Discover.Net;
using Discover.Utils;
using static Discover.Types.Events;

namespace Discover
{

    public class Discover
    {
        public void Test()
        {
            var systemTemp = Path.GetTempPath();
            var tempPath = Path.Combine(systemTemp, "Discover");
            if (!Directory.Exists(tempPath))
            {
                Directory.CreateDirectory(tempPath);
            }

            var stream = Resource.GetStream("renderer.zip");
            LazyExtractor.ExtractZipFromStream(stream, tempPath);

            Server server = new Server(3484, Path.Combine(tempPath, "dist"));
            server.Start();

            while (true)
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                };
                var raw = JsonSerializer.Serialize(new SocEvent()
                {
                    Type = SocEventType.Log,
                    Data = new LogEventData()
                    {
                        Content = "Hello World"
                    }
                }, options);

                server.Send(raw);

                Thread.Sleep(1000);
            }
        }
    }
}
