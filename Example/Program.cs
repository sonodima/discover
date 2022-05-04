using System.Drawing;
using Discover;
using Example;

var renderer = new Renderer(18842);

renderer.WriteLog("Hello from Discover.Net");

while (true)
{
    var mouse = User32.GetCursorPosition();

    // renderer.DrawRectangle(new Rectangle(mouse.X, mouse.Y, 100, 100), Color.FromArgb(50, 170, 80, 20), true, 0, 15);
    renderer.DrawString("Discover.Net", "Arial", Color.White, new Point(mouse.X, mouse.Y));

    renderer.Present();

    Thread.Sleep(6);
}