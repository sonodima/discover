namespace Discover.Types
{
    public class Instructions
    {
        public enum InstructionType
        {
            String,
            Rectangle
        }

        public struct Instruction
        {
            public InstructionType Type { get; set; }
            public object Data { get; set; }
        }

        public struct StringInstructionData
        {
            public string Content { get; set; }
            public string Font { get; set; }
            public int Color { get; set; }
            public int X { get; set; }
            public int Y { get; set; }
            public int Size { get; set; }
        }

        public struct RectangleInstructionData
        {
            public int X { get; set; }
            public int Y { get; set; }
            public int Width { get; set; }
            public int Height { get; set; }
            public int Color { get; set; }
            public bool Fill { get; set; }
            public int Thickness { get; set; }
            public int Radius { get; set; }
        }
    }
}
