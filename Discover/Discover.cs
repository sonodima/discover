using System.Net;
using System.Linq;
using System.Text;
using System;
using System.Collections.Generic;
using System.Threading;
using WebSocketSharp;
using WebSocketSharp.Server;
using System.IO;

using System.Reflection;
using System.IO.Compression;

using Discover.Net;
using Discover.Utils;

namespace Discover
{

    public class Discover
    {
        public void Test()
        {
            var stream = Resource.GetStream("renderer.zip");

            var systemTemp = Path.GetTempPath();
            var tempPath = Path.Combine(systemTemp, "Discover");
            if (!Directory.Exists(tempPath))
            {
                Directory.CreateDirectory(tempPath);
            }

            LazyExtractor.ExtractZipFromStream(stream, tempPath);


            Server server = new Server(3484, Path.Combine(tempPath, "dist"));
            server.Start();

            while (true)
            {
                Thread.Sleep(1000);
            }
        }
    }
}
