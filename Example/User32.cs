using System.Drawing;
using System.Runtime.InteropServices;

namespace Example
{
    public static class User32
    {
        public struct WinPoint
        {
            public int X { get; set; }
            public int Y { get; set; }

            public static implicit operator Point(WinPoint point)
            {
                return new Point(point.X, point.Y);
            }
        }

        [DllImport("user32.dll")]
        private static extern bool GetCursorPos(out WinPoint point);

        public static Point GetCursorPosition()
        {
            GetCursorPos(out var point);
            return point;
        }
    }
}
