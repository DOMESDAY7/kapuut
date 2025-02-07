package quiz

import (
	"database/sql"

	_ "github.com/lib/pq"
	"github.com/lucsky/cuid"
)

type QuizRepository struct {
	db *sql.DB
}

func NewQuizRepository(db *sql.DB) *QuizRepository {
	return &QuizRepository{db: db}
}

// Enregistrer un quiz dans la base de données PostgreSQL
func (qr *QuizRepository) SaveQuiz(q Quiz) error {
	tx, err := qr.db.Begin()
	if err != nil {
		return err
	}

	quizId := cuid.New()
	_, err = tx.Exec("INSERT INTO Quizzes (quizId, quiz) VALUES ($1, $2)", quizId, q.Name)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Insérer les questions et les réponses
	for _, question := range q.Questions {
		questionId := cuid.New()
		_, err := tx.Exec("INSERT INTO Questions (questionId, question, quizId) VALUES ($1, $2, $3)", questionId, question.Text, quizId)
		if err != nil {
			tx.Rollback()
			return err
		}
		for _, answer := range question.Answers {
			answerId := cuid.New()
			_, err := tx.Exec("INSERT INTO Answers (answerId, answer, isCorrect, questionId) VALUES ($1, $2, $3, $4)", answerId, answer.Text, answer.IsCorrect, questionId)
			if err != nil {
				tx.Rollback()
				return err
			}
		}
	}

	return tx.Commit()
}
