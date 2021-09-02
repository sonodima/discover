using System;
using System.Drawing;

namespace DiscoverSharp
{
    class Program
    {
        static void Main(string[] _)
        {
            Discover renderer = new(4001);

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
                // Do your drawing here.
                renderer.PushString(new Point(100, 100), "Hello World!", Color.White, Color.Black, 3);

                renderer.Render();
                System.Threading.Thread.Sleep(7); // To be changed with better synchronization method.
            }
        }
    }
}
