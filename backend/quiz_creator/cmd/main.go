package quiz_creator

import "github.com/gofiber/fiber/v2"

func main() {

	app := fiber.New()
	app.Get("/create-quiz", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})
	app.Listen(":3000")
}
