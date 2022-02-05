using System;
using System.IO;
using System.Net;

namespace Discover.Net
{
    internal class Static : Handler
    {
        internal string Directory { get; }

        internal Static(string directory)
        {
            Directory = directory;
        }

        internal override bool HandleRequest(HttpListenerRequest req, ref HttpListenerResponse res)
        {
            var filename = req.Url.AbsolutePath;
            Console.WriteLine($"[static] {filename}");

            // Replace '/' with '/index.html'
            filename = filename[1..];
            if (string.IsNullOrEmpty(filename))
            {
                filename = "index.html";
            }

            filename = Path.Combine(Directory, filename);

            if (!File.Exists(filename))
            {
                return false;
            }

            try
            {
                var input = new FileStream(filename, FileMode.Open);

                res.ContentType =
                    Mime.Types.TryGetValue(Path.GetExtension(filename), out var mime)
                    ? mime
                    : "text/event-stream";
                res.ContentLength64 = input.Length;

                int nbytes;
                var buffer = new byte[1024 * 32];
                while ((nbytes = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    res.OutputStream.Write(buffer, 0, nbytes);
                }

                input.Close();

                res.OutputStream.Flush();
                res.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception)
            {
                res.StatusCode = (int)HttpStatusCode.InternalServerError;
            }

            res.OutputStream.Close();
            return true;
        }
    }
}
