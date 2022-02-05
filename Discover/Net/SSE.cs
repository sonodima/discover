using System;
using System.Net;

namespace Discover.Net
{
    internal class SSE : Handler
    {
        internal string Endpoint { get; }

        internal SSE(string endpoint)
        {
            Endpoint = endpoint;
        }

        internal override bool HandleRequest(HttpListenerRequest req, ref HttpListenerResponse res)
        {
            var currentEndpoint = req.Url.AbsolutePath;
            if (currentEndpoint != Endpoint)
            {
                return false;
            }

            Console.WriteLine($"[sse] {Endpoint}");

            return true;
        }
    }
}
