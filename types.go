package main

type InstructionType int

const (
	String InstructionType = iota
	Polygon
	Rectangle
	Circle
)

type Instruction struct {
	Type InstructionType `json:"type"`
	Data interface{}     `json:"data"`
}

type RenderQueue struct {
	Instructions []Instruction `json:"instructions"`
}

type StringInstruction struct {
	X               int     `json:"x"`
	Y               int     `json:"y"`
	Text            string  `json:"text"`
	Color           int     `json:"color"`
	Alpha           float32 `json:"alpha"`
	Stroke          bool    `json:"stroke"`
	StrokeColor     int     `json:"strokeColor"`
	StrokeThickness int     `json:"strokeThickness"`
}

type PolygonInstruction struct {
	Path      []int   `json:"path"`
	Color     int     `json:"color"`
	Alpha     float32 `json:"alpha"`
	Fill      bool    `json:"fill"`
	Thickness int     `json:"thickness"`
}

type RectangleInstruction struct {
	X1        int     `json:"x1"`
	Y1        int     `json:"y1"`
	X2        int     `json:"x2"`
	Y2        int     `json:"y2"`
	Color     int     `json:"color"`
	Alpha     float32 `json:"alpha"`
	Fill      bool    `json:"fill"`
	Thickness int     `json:"thickness"`
	Radius    int     `json:"radius"`
}

type CircleInstruction struct {
	X         int     `json:"x"`
	Y         int     `json:"y"`
	Radius    int     `json:"radius"`
	Color     int     `json:"color"`
	Alpha     float32 `json:"alpha"`
	Fill      bool    `json:"fill"`
	Thickness int     `json:"thickness"`
}
