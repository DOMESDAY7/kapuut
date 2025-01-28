package quiz_creator

import "github.com/gofiber/fiber/v2"

type QuizCreator struct {
}
type QuizCreatorAI struct {
}

func main() {

	app := fiber.New()
	// Create a new Quiz
	app.Post("/quiz")
	// Create a new AI Quiz
	app.Post("/quiz/ai", func(c *fiber.Ctx) error {
		return c.SendString("Create AI quiz")
	})

	app.Listen("0.0.0.0:3000")
}
