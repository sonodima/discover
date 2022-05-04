using System;
using System.Collections.Generic;

namespace Discover.Net
{
    internal static class Mime
    {
        internal static IDictionary<string, string> Types { get; } =
            new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase)
            {
                {".html", "text/html"},
                {".js", "application/x-javascript"},
                {".css", "text/css"}
            };
    }
}