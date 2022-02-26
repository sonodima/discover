using System.Drawing;

using Discover;
using Example;

var renderer = new Renderer(18842);

renderer.WriteLog("Hello from Discover.Net");

while (true)
{
    var mouse = User32.GetCursorPosition();

    renderer.DrawString("Speed", "Arial", Color.Black, new Point(mouse.X, mouse.Y));


    renderer.Present();

    Thread.Sleep(4);
}
