﻿using System.Collections.Generic;
using static Discover.Types.Instructions;

namespace Discover.Types
{
    public static class Events
    {
        public enum SocEventType
        {
            Log,
            Tick
        }

        public struct SocEvent
        {
            public SocEventType Type { get; set; }
            public object Data { get; set; }
        }

        public struct LogEventData
        {
            public string Content { get; set; }
        }

        public struct TickEventData
        {
            public Queue<Instruction> Instructions { get; set; }
        }
    }
}