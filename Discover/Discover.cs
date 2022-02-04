using System.Threading;

namespace Discover
{
    public class Discover
    {
        public void Test()
        {
            var renderer = new Renderer();

            int i = 0;
            while (true)
            {
                renderer.DrawRectangle(new System.Drawing.Rectangle(i++, 10, 50, 50), System.Drawing.Color.Red);
                renderer.Present();

                if (i == 1000)
                {
                    i = 0;
                }

                Thread.Sleep(6);
            }
        }
    }
}
