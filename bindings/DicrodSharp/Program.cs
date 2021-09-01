using System;
using System.Drawing;

namespace DicrodSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            Dicrod renderer = new(4001);

            if (!renderer.Patch("127.0.0.1"))
            {
                Console.WriteLine("could not patch discord");
                return;
            }

            if (!renderer.Initialize())
            {
                return;
            }

            while (true)
            {
                renderer.PushString(new Point(20, 20), "Hello World", Color.White, Color.Black, 3);
                renderer.PushRectangle(new Rectangle(100, 100, 100, 100), Color.FromArgb(255, 0, 0));
                renderer.PushCircle(new Point(400, 400), 70, Color.LightPink);
                renderer.PushCircle(new Point(200, 300), 30, Color.Red, false, 5);

                renderer.Render();
                System.Threading.Thread.Sleep(17);
            }
        }
    }
}
