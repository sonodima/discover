package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

import "C"

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

type Point struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type StringInstruction struct {
	Position Point  `json:"position"`
	Text     string `json:"text"`
}

type PolygonInstruction struct {
	Points    []Point `json:"points"`
	Color     int     `json:"color"`
	Alpha     float32 `json:"alpha"`
	Fill      bool    `json:"fill"`
	Thickness int     `json:"thickness"`
}

type RectangleInstruction struct {
	Start     Point   `json:"start"`
	End       Point   `json:"end"`
	Color     int     `json:"color"`
	Alpha     float32 `json:"alpha"`
	Fill      bool    `json:"fill"`
	Thickness int     `json:"thickness"`
	Radius    int     `json:"radius"`
}

type CircleInstruction struct {
	Position  Point   `json:"position"`
	Radius    int     `json:"radius"`
	Color     int     `json:"color"`
	Alpha     float32 `json:"alpha"`
	Fill      bool    `json:"fill"`
	Thickness int     `json:"thickness"`
}

func handleUpgrade(c *fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(c) {
		c.Locals("allowed", true)
		return c.Next()
	}

	return fiber.ErrUpgradeRequired
}

var connection *websocket.Conn
var queue *RenderQueue

func handleQueue(c *websocket.Conn) {
	connection = c

	for {
		time.Sleep(200)
	}
}

//export Start
func Start(port int) bool {
	queue = &RenderQueue{}

	app := fiber.New()
	app.Static("/", "./renderer/dist")

	app.Use("/ws", handleUpgrade)
	app.Get("/ws/queue", websocket.New(handleQueue))

	go app.Listen(fmt.Sprintf(":%d", port))

	/*
		err := app.Listen(fmt.Sprintf(":%d", port))
		if err != nil {
			fmt.Println("[dicrod]", err.Error())
			return false
		}

		fmt.Println("[dicrod] server listening on port ", port)
	*/

	return true
}

//export SubmitQueue
func SubmitQueue() bool {
	if connection == nil {
		return false
	}

	marshaled, err := json.Marshal(queue)
	if err != nil {
		fmt.Println("[dicord]", err)
		return false
	}

	err = connection.WriteMessage(1, marshaled)
	if err != nil {
		fmt.Println("[dicord]", err)
		connection = nil
		return false
	}

	queue.Instructions = nil
	return true
}

//export DrawString
func DrawString(x int, y int, text *C.char) {
	converted := C.GoString(text)
	data := StringInstruction{Point{x, y}, converted}
	instruction := Instruction{String, data}

	queue.Instructions = append(queue.Instructions, instruction)
}

//export DrawPolygon
func DrawPolygon(a []int, color int, alpha float32, fill bool, thickness int) {
	points := make([]Point, len(a)/2)

	for i := 0; i < len(a)/2; i++ {
		point := Point{a[i*2], a[(i*2)+1]}
		points = append(points, point)
	}

	data := PolygonInstruction{points, color, alpha, fill, thickness}
	instruction := Instruction{Polygon, data}

	queue.Instructions = append(queue.Instructions, instruction)
}

//export DrawRectangle
func DrawRectangle(x1 int, y1 int, x2 int, y2 int, color int, alpha float32, fill bool, thickness int, radius int) {
	data := RectangleInstruction{Point{x1, y1}, Point{x2, y2}, color, alpha, fill, thickness, radius}
	instruction := Instruction{Rectangle, data}

	queue.Instructions = append(queue.Instructions, instruction)
}

func main() {
	if !Start(4001) {
		return
	}

	// Test only

	SubmitQueue()
}
