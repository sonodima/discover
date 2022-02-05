using System.Net;

namespace Discover.Net
{
    internal abstract class Handler
    {
        internal abstract bool HandleRequest(HttpListenerRequest req, ref HttpListenerResponse res);
    }
}
