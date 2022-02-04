using System.Drawing;

using Discover;
using Example;

var renderer = new Renderer();

while (true)
{
    var mouse = User32.GetCursorPosition();

    for (int i = -500; i <= 500; i += 100)
    {
        for (int j = -500; j <= 500; j += 100)
        {
            renderer.DrawString("Speed", "Arial", Color.Black, new Point(mouse.X + i, mouse.Y + j));
        }
    }

    renderer.Present();

    Thread.Sleep(6);
}
