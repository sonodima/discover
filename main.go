package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

import "C"

var connection *websocket.Conn
var queue *RenderQueue

func upgradeHandler(c *fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(c) {
		c.Locals("allowed", true)
		return c.Next()
	}

	return fiber.ErrUpgradeRequired
}

func queueHandler(c *websocket.Conn) {
	connection = c

	for {
		time.Sleep(200)
	}
}

func listenRoutine(app *fiber.App, port int) {
	app.Listen(fmt.Sprintf(":%d", port))
}

//export Start
func Start(port int) bool {
	queue = &RenderQueue{}

	app := fiber.New()
	app.Static("/", "./renderer/dist")

	app.Use("/ws", upgradeHandler)
	app.Get("/ws/queue", websocket.New(queueHandler))

	go listenRoutine(app, port)

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
func DrawString(x int, y int, text *C.char, color int, alpha float32, stroke bool, strokeColor int, strokeThickness int) {
	converted := C.GoString(text)
	data := StringInstruction{x, y, converted, color, alpha, stroke, strokeColor, strokeThickness}
	instruction := Instruction{String, data}

	queue.Instructions = append(queue.Instructions, instruction)
}

//export DrawPolygon
func DrawPolygon(path []int, color int, alpha float32, fill bool, thickness int) {
	data := PolygonInstruction{path, color, alpha, fill, thickness}
	instruction := Instruction{Polygon, data}

	queue.Instructions = append(queue.Instructions, instruction)
}

//export DrawRectangle
func DrawRectangle(x1 int, y1 int, x2 int, y2 int, color int, alpha float32, fill bool, thickness int, radius int) {
	data := RectangleInstruction{x1, y1, x2, y2, color, alpha, fill, thickness, radius}
	instruction := Instruction{Rectangle, data}

	queue.Instructions = append(queue.Instructions, instruction)
}

//export DrawCircle
func DrawCircle(x int, y int, radius int, color int, alpha float32, fill bool, thickness int) {
	data := CircleInstruction{x, y, radius, color, alpha, fill, thickness}
	instruction := Instruction{Circle, data}

	queue.Instructions = append(queue.Instructions, instruction)
}

func main() {
	if !Start(4001) {
		return
	}

	// Test only

	SubmitQueue()
}
