using System.IO;
using System.IO.Compression;

namespace Discover.Utils
{
    internal static class LazyExtractor
    {
        internal static void ExtractZipFromStream(Stream stream, string destination)
        {
            var zip = new ZipArchive(stream);

            foreach (var entry in zip.Entries)
            {
                if (entry.FullName.Contains("../"))
                {
                    continue; // bruh
                }

                var relative = Path.GetDirectoryName(entry.FullName);
                var absolute = Path.Combine(destination, relative);
                if (!Directory.Exists(absolute))
                {
                    Directory.CreateDirectory(absolute);
                }

                entry.ExtractToFile(Path.Combine(destination, entry.FullName), true);
            }
        }
    }
}
