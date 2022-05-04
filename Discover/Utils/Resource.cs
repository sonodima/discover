using System;
using System.IO;
using System.Reflection;

namespace Discover.Utils
{
    internal static class Resource
    {
        /// <summary>
        ///     Obtains a data stream from an embedded resource.
        /// </summary>
        /// <param name="name">The name of the embedded resource file.</param>
        /// <returns>The data stream of the resource.</returns>
        /// <exception cref="FileLoadException">A file that was found could not be loaded.</exception>
        /// <exception cref="FileNotFoundException">A resource with this name was not found.</exception>
        /// <exception cref="BadImageFormatException">This name is not a valid assembly.</exception>
        internal static Stream GetStream(string name)
        {
            var assembly = Assembly.GetExecutingAssembly();
            return assembly.GetManifestResourceStream($"Discover.{name}")!;
        }
    }
}