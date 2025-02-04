package main

import (
	"quiz_creator/internal/Quiz"

	"github.com/gofiber/fiber/v2"
)

func main() {

	app := fiber.New()

	// Create a new Quiz
	app.Post("/quiz", func(c *fiber.Ctx) error {
		c.Accepts("json", "text")

		return Quiz.HandleCreateQuiz(c)
	})

	// Create a new AI Quiz
	app.Post("/quiz/ai", func(c *fiber.Ctx) error {
		return c.SendString("Create AI quiz")
	})

	app.Listen("0.0.0.0:3000")
}
