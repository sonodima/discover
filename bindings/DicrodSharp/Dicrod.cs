using System;
using System.IO;
using System.Text;
using System.Drawing;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace DicrodSharp
{
    class Dicrod
    {
        [DllImport("dicrod.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
        private static extern bool Start(int port);

        [DllImport("dicrod.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
        private static extern bool SubmitQueue();

        [DllImport("dicrod.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
        private static extern void DrawString(int x, int y, byte[] text, int color, float alpha,
            bool stroke, int strokeColor, int strokeThickness);

        [DllImport("dicrod.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
        private static extern void DrawPolygon(int[] path, int color, float alpha, bool fill, int thickness);

        [DllImport("dicrod.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
        private static extern void DrawRectangle(int x1, int y1, int x2, int y2, int color,
            float alpha, bool fill, int thickness, int radius);

        [DllImport("dicrod.dll", CharSet = CharSet.Unicode, CallingConvention = CallingConvention.StdCall)]
        private static extern void DrawCircle(int x, int y, int radius, int color, float alpha,
            bool fill, int thickness);

        public int Port { get; }

        public Dicrod(int port)
        {
            Port = port;
        }

        public bool Initialize()
        {
            return Start(Port);
        }

        public bool Patch(string address)
        {
            string local = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string discordPath = Path.Combine(local, "Discord");

            bool hasPatchedSomething = false;

            string[] appDirectories = Directory.GetDirectories(discordPath, "app-*");
            foreach (string appDirectory in appDirectories)
            {
                string overlayPath = Path.Combine(appDirectory, "modules\\discord_overlay2-1\\discord_overlay2");
                string hostPath = Path.Combine(overlayPath, "host.js");
                if (!Directory.Exists(overlayPath) || !File.Exists(hostPath))
                {
                    continue;
                }

                List<string> hostData = new(File.ReadAllLines(hostPath));

                for (int i = 0; i < hostData.Count; i++)
                {
                    string currentLine = hostData[i];

                    if (currentLine.Contains("url = urlWithPid.toString();"))
                    {
                        string patch = string.Format("url = \"http://{0}:{1}/\"", address, Port);

                        if ((i + 1) < hostData.Count && hostData[i + 1].Contains("url = \"http://"))
                        {
                            // The file was already patched, update the next line.
                            hostData[i + 1] = patch;
                        }
                        else
                        {
                            // The file is not patched, insert the patch.
                            hostData.Insert(i + 1, patch);
                        }

                        hasPatchedSomething = true;
                    }
                }

                File.WriteAllLines(hostPath, hostData);
            }

            return hasPatchedSomething;
        }

        private static int ConvertColor(Color color)
        {
            return (color.R << 16) + (color.G << 8) + color.B;
        }

#pragma warning disable CA1822 // Mark members as static
        public bool Render()
#pragma warning restore CA1822 // Mark members as static
        {
            return SubmitQueue();
        }

#pragma warning disable CA1822 // Mark members as static
        public void PushString(Point position, string text, Color color)
#pragma warning restore CA1822 // Mark members as static
        {
            byte[] bytes = Encoding.UTF8.GetBytes(text);
            DrawString(position.X, position.Y, bytes, ConvertColor(color), color.A / 255.0f, false,
                0x0, 0);
        }

#pragma warning disable CA1822 // Mark members as static
        public void PushString(Point position, string text, Color color, Color strokeColor,
             int strokeThickness)
#pragma warning restore CA1822 // Mark members as static
        {
            byte[] bytes = Encoding.UTF8.GetBytes(text);
            DrawString(position.X, position.Y, bytes, ConvertColor(color), color.A / 255.0f, true,
                ConvertColor(strokeColor), strokeThickness);
        }

#pragma warning disable CA1822 // Mark members as static
        public void PushRectangle(Rectangle rectangle, Color color, bool fill = true, int thickness = 0, int radius = 0)
#pragma warning restore CA1822 // Mark members as static
        {
            DrawRectangle(rectangle.Left, rectangle.Top, rectangle.Right, rectangle.Bottom, ConvertColor(color),
                color.A / 255.0f, fill, thickness, radius);
        }

#pragma warning disable CA1822 // Mark members as static
        public void PushCircle(Point position, int radius, Color color, bool fill = true, int thickness = 0)
#pragma warning restore CA1822 // Mark members as static
        {
            DrawCircle(position.X, position.Y, radius, ConvertColor(color), color.A / 255.0f, fill, thickness);
        }

#pragma warning disable CA1822 // Mark members as static
        public void PushPolygon(Point[] points, Color color, bool fill = true, int thickness = 0)
#pragma warning restore CA1822 // Mark members as static
        {
            int[] path = new int[points.Length * 2];

            for (int i = 0; i < points.Length; i++)
            {
                Point point = points[i];
                path[i * 2] = point.X;
                path[(i * 2) + 1] = point.Y;
            }

            DrawPolygon(path, ConvertColor(color), color.A / 255.0f, fill, thickness);
        }

    }
}
