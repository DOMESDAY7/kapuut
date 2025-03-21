package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"quiz_creator/internal/quiz"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	// Load environment variables from the .env file (if present)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Retrieve the PostgreSQL connection string from the DATABASE_URL environment variable
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("The DATABASE_URL environment variable is not set")
	}

	// Open a connection to PostgreSQL
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Error connecting to the database:", err)
	}
	defer db.Close()

	// Check the database connection
	if err := db.Ping(); err != nil {
		log.Fatal("Error pinging the database:", err)
	}

	// Initialize the repository and service with the database connection
	quizRepo := quiz.NewQuizRepository(db)
	quizService := quiz.NewQuizService(quizRepo)

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Get("/quiz", func(c *fiber.Ctx) error {

		quizzes, err := quizService.HandleGetAllQuizzes()

		if err != nil {
			// show the error in log
			fmt.Println("Error getting the quizzes:", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Failed to get quizzes",
			})
		}

		return c.JSON(quizzes)
	})

	app.Post("/quiz", func(c *fiber.Ctx) error {
		var q quiz.Quiz

		if err := c.BodyParser(&q); err != nil {
			fmt.Println("Error parsing the request body:", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		if err := quizService.HandleCreateQuiz(q); err != nil {
			fmt.Println("Error creating the quiz:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		fmt.Println("Quiz created successfully")
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Quiz created successfully",
		})
	})
	port := "3100"
	fmt.Println("🚀 Server running on http://localhost:", port)
	log.Fatal(app.Listen(":" + port))
}
