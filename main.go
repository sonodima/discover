package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

import "C"

//export DoubleIt
func DoubleIt(x int) int {
	return x * 2
}

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

func main() {
	app := fiber.New()

	app.Static("/", "./renderer/dist")

	app.Use("/ws", func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws/queue", websocket.New(func(c *websocket.Conn) {
		var (
			mt  int
			msg []byte
			err error
		)

		for {
			if mt, msg, err = c.ReadMessage(); err != nil {
				log.Println("read:", err)
				break
			}
			log.Printf("recv: %s", msg)

			queue := RenderQueue{}
			/*
				instruction := StringInstruction{Position: Point{X: 40, Y: 40}, Text: "niggers"}
				a := Instruction{Type: String, Data: instruction}
			*/

			/*
				points := make([]Point, 0)
				points = append(points, Point{X: 40, Y: 40})
				points = append(points, Point{X: 200, Y: 40})
				points = append(points, Point{X: 200, Y: 200})
				points = append(points, Point{X: 40, Y: 200})

				instruction := PolygonInstruction{Points: points, Color: 0xFF0000, Alpha: 1.0, Fill: false, Thickness: 4}
				a := Instruction{Type: Polygon, Data: instruction}
			*/

			instruction := RectangleInstruction{Start: Point{X: 40, Y: 40}, End: Point{X: 100, Y: 140}, Color: 0xFF00FF, Alpha: 1.0, Fill: true, Radius: 30}
			a := Instruction{Type: Rectangle, Data: instruction}

			queue.Instructions = append(queue.Instructions, a)

			b, err := json.Marshal(queue)
			if err != nil {
				fmt.Println(err)
				return
			}
			fmt.Println(string(b))

			if err = c.WriteMessage(mt, b); err != nil {
				log.Println("write:", err)
				break
			}
		}
	}))

	app.Listen(":4001")
}
