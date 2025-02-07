package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"quiz_creator/internal/quiz"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	// Charger les variables d'environnement depuis le fichier .env (si présent)
	if err := godotenv.Load(); err != nil {
		log.Println("Aucun fichier .env trouvé, utilisation des variables d'environnement système")
	}

	// Récupérer la chaîne de connexion PostgreSQL depuis la variable DATABASE_URL
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("La variable d'environnement DATABASE_URL n'est pas définie")
	}

	// Ouvrir la connexion à PostgreSQL
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Erreur lors de la connexion à la base de données :", err)
	}
	defer db.Close()

	// Vérifier la connexion à la base
	if err := db.Ping(); err != nil {
		log.Fatal("Erreur lors du ping de la base de données :", err)
	}

	// Initialiser le repository et le service avec la connexion DB
	quizRepo := quiz.NewQuizRepository(db)
	quizService := quiz.NewQuizService(quizRepo)

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Quiz creation service")
	})

	app.Post("/quiz", func(c *fiber.Ctx) error {
		var q quiz.Quiz

		if err := c.BodyParser(&q); err != nil {
			fmt.Println("Erreur lors de l'analyse du corps de la requête :", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Corps de la requête invalide",
			})
		}

		if err := quizService.HandleCreateQuiz(q); err != nil {
			fmt.Println("Erreur lors de la création du quiz :", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		fmt.Println("Quiz créé avec succès")
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Quiz créé avec succès",
		})
	})

	fmt.Println("🚀 Serveur en écoute sur http://localhost:3100")
	log.Fatal(app.Listen(":3100"))
}
