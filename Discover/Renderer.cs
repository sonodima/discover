using System.IO;
using System.Drawing;
using System.Collections.Generic;

using Discover.Utils;
using Discover.Net;

using static Discover.Types.Events;
using static Discover.Types.Instructions;

namespace Discover
{
    public class Renderer
    {
        private readonly List<Instruction> _instructions;
        private readonly Server _server;

        public Renderer(int port)
        {
            _instructions = new List<Instruction>();

            var systemTemp = Path.GetTempPath();
            var tempPath = Path.Combine(systemTemp, "Discover");
            if (!Directory.Exists(tempPath))
            {
                Directory.CreateDirectory(tempPath);
            }

            var stream = Resource.GetStream("renderer.zip");
            LazyExtractor.ExtractZipFromStream(stream, tempPath);

            _server = new Server(port, Path.Combine(tempPath, "dist"));
            _server.Start();
        }

        public void DrawRectangle(Rectangle rect, Color color, bool fill = true, int thickness = 0, int radius = 0)
        {
            var data = new RectangleInstructionData()
            {
                X = rect.X,
                Y = rect.Y,
                Width = rect.Width,
                Height = rect.Height,
                Color = ConvertColor(color),
                Alpha = color.A / 255.0f,
                Fill = fill,
                Thickness = thickness,
                Radius = radius,
            };

            var instruction = new Instruction()
            {
                Type = InstructionType.Rectangle,
                Data = data,
            };

            _instructions.Add(instruction);
        }

        public void DrawString(string content, string font, Color color, Point point, int size = 16)
        {
            var data = new StringInstructionData()
            {
                Content = content,
                Font = font,
                Color = ConvertColor(color),
                Alpha = color.A / 255.0f,
                X = point.X,
                Y = point.Y,
                Size = size,
            };

            var instruction = new Instruction()
            {
                Type = InstructionType.String,
                Data = data,
            };

            _instructions.Add(instruction);
        }

        public void Present()
        {
            _server.Send(new SocEvent()
            {
                Type = SocEventType.Tick,
                Data = new TickEventData()
                {
                    Instructions = _instructions
                }
            });

            _instructions.Clear();
        }

        public void WriteLog(string content)
        {
            _server.Send(new SocEvent()
            {
                Type = SocEventType.Log,
                Data = new LogEventData()
                {
                    Content = content
                }
            });
        }

        /// <summary>
        /// Converts a System.Drawing.Color to an integer usable by WebGL.
        /// </summary>
        /// <param name="color">The color to convert.</param>
        /// <returns>The converted color.</returns>
        private static int ConvertColor(Color color)
        {
            return (color.R << 16) + (color.G << 8) + color.B;
        }
    }
}
