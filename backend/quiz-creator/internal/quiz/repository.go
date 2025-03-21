package quiz

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
	"github.com/lucsky/cuid"
)

// QuizRepository handles database insertion operations for quizzes.
type QuizRepository struct {
	db *sql.DB
}

// NewQuizRepository returns a new instance of QuizRepository.
func NewQuizRepository(db *sql.DB) *QuizRepository {
	return &QuizRepository{db: db}
}
func (qr *QuizRepository) GetAllQuizzes() ([]Quiz, error) {
	// Requête avec jointure pour récupérer les quizzes et leurs questions en une seule fois
	rows, err := qr.db.Query(`
		SELECT q."quizId", q."quiz", que."questionId", que."question"
		FROM "Quizzes" q
		LEFT JOIN "Questions" que ON q."quizId" = que."quizId"
		ORDER BY q."quizId", que."questionId"
	`)
	if err != nil {
		return nil, fmt.Errorf("failed to query quizzes and questions: %w", err)
	}
	defer rows.Close()

	quizzes := []Quiz{}
	quizMap := make(map[string]*Quiz)

	// Parcours des lignes
	for rows.Next() {
		var quizId, quiz string
		var questionId, question sql.NullString

		// Extraction des données de chaque ligne
		if err := rows.Scan(&quizId, &quiz, &questionId, &question); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}

		// Vérifier si nous avons déjà traité ce quiz
		_, exists := quizMap[quizId]
		if !exists {
			// Création d'un nouveau quiz
			newQuiz := Quiz{
				QuizId:    quizId,
				Quiz:      quiz,
				Questions: []Question{},
			}
			quizzes = append(quizzes, newQuiz)
			quizMap[quizId] = &quizzes[len(quizzes)-1]
			_ = &newQuiz
		}

		// Ajouter la question au quiz si elle existe
		if questionId.Valid && question.Valid {
			questionData := Question{
				QuestionId: questionId.String,
				Question:   question.String,
				QuizId:     quizId,
			}
			quizMap[quizId].Questions = append(quizMap[quizId].Questions, questionData)
		}
	}

	// Vérifie si une erreur s'est produite pendant l'itération
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}
	log.Print("Get quiz from db: ", quizzes)

	return quizzes, nil
}

// SaveQuiz saves a quiz, its questions, and their answers in the database.
// It inserts data into the following tables (named in lowercase as generated by Prisma):
// - Quizzes (columns: quizId, quiz)
// - Questions (columns: questionId, question, quizId)
// - Answers (columns: answerId, answer, isCorrect, questionId)
func (qr *QuizRepository) SaveQuiz(q Quiz) error {
	tx, err := qr.db.Begin()
	if err != nil {
		return err
	}

	// Generate an identifier for the quiz (similar to the @default(cuid()) directive in Prisma)
	quizId := cuid.New()

	// Insert into the quizzes table
	_, err = tx.Exec(`INSERT INTO "Quizzes" ("quizId", "quiz") VALUES ($1, $2)`, quizId, q.Quiz)
	if err != nil {
		tx.Rollback()
		return err
	}

	// For each question in the quiz...
	for _, question := range q.Questions {
		questionId := cuid.New()

		// Insert into the Questions table with the foreign key quizId
		_, err := tx.Exec(`INSERT INTO "Questions" ("questionId", "question", "quizId") VALUES ($1, $2, $3)`, questionId, question.Question, quizId)
		if err != nil {
			tx.Rollback()
			return err
		}

		// For each answer in the question...
		for _, answer := range question.Answers {
			answerId := cuid.New()

			// Insert into the Answers table with the foreign key questionId
			_, err := tx.Exec(`INSERT INTO "Answers" ("answerId", "answer", "isCorrect", "questionId") VALUES ($1, $2, $3, $4)`, answerId, answer.Answer, answer.IsCorrect, questionId)
			if err != nil {
				tx.Rollback()
				return err
			}
		}
	}

	// Commit the transaction
	return tx.Commit()
}
