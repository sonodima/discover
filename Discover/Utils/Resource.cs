using System.IO;
using System.Reflection;

namespace Discover.Utils
{
    internal static class Resource
    {
        internal static Stream GetStream(string name)
        {
            var assembly = Assembly.GetExecutingAssembly();
            return assembly.GetManifestResourceStream($"Discover.{name}");
        }
    }
}
