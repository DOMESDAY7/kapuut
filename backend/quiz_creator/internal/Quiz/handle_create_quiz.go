package Quiz

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/lucsky/cuid"
	_ "github.com/mattn/go-sqlite3"
)

type Answer struct {
	Text      string
	IsCorrect bool
}

type Question struct {
	Text    string
	Answers []Answer
}

type Quiz struct {
	Name      string
	Questions []Question
}

type QuizCreator struct {
	quiz Quiz
}

// HandleCreateQuiz validates and sets up the quiz.
func (qc *QuizCreator) HandleCreateQuiz(quiz interface{}) error {

	// Verify the quiz
	if err := qc.VerifyQuiz(quiz); err != nil {
		return fmt.Errorf("quiz creation failed: %w", err)
	}

	// Set the quiz
	qc.quiz = quiz

	// Post the quiz to the database
	if err := qc.quiz.PostQuizToDb(); err != nil {
		return fmt.Errorf("quiz creation failed: %w", err)
	}

	return nil
}

func (q *Quiz) PostQuizToDb() error {
	// Open the connection to the SQlite database
	db, err := sql.Open("sqlite3", "file:../../../db/database.db")
	if err != nil {
		return fmt.Errorf("erreur lors de l'ouverture de la base de données : %w", err)
	}
	defer db.Close()

	// Start a transaction
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("erreur lors du début de la transaction : %w", err)
	}

	// Create unique identifiers for the quiz, questions, and answers.
	quizId := cuid.New()

	// Insert the quiz into the database
	quizInsertQuery := "INSERT INTO Quizzes (quizId, quiz) VALUES (?, ?)"
	_, err = tx.Exec(quizInsertQuery, quizId, q.Name)
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("erreur lors de l'insertion du quiz : %w", err)
	}

	// Insert the questions and answers into the database
	for _, question := range q.Questions {
		// Générer un identifiant pour la question.
		questionId := cuid.New()
		questionInsertQuery := "INSERT INTO Questions (questionId, question, quizId) VALUES (?, ?, ?)"
		_, err = tx.Exec(questionInsertQuery, questionId, question.Text, quizId)
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("erreur lors de l'insertion de la question : %w", err)
		}

		// Insert the answers into the database
		for _, answer := range question.Answers {
			// Générer un identifiant pour la réponse.
			answerId := cuid.New()
			answerInsertQuery := "INSERT INTO Answers (answerId, answer, isCorrect, questionId) VALUES (?, ?, ?, ?)"
			_, err = tx.Exec(answerInsertQuery, answerId, answer.Text, answer.IsCorrect, questionId)
			if err != nil {
				tx.Rollback()
				return fmt.Errorf("erreur lors de l'insertion de la réponse : %w", err)
			}
		}
	}

	// Commit the transaction
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("erreur lors de la validation de la transaction : %w", err)
	}

	fmt.Println("Quiz, questions et réponses enregistrés avec succès dans la base de données.")
	return nil
}

// VerifyQuiz checks if the quiz is valid and returns an error if it is not.
func (q *Quiz) VerifyQuiz(probablyQuiz interface{}) error {
	if q.Name == "" {
		return errors.New("quiz name is required")
	}

	if len(q.Questions) == 0 {
		return errors.New("quiz must have at least one question")
	}

	// For each question with verify :
	// 1. Question text is not empty
	// 2. Question has at least one answer
	// 3. Each answer has a text
	// 4. Each question has at least one correct answer
	for _, question := range q.Questions {
		if question.Text == "" {
			return errors.New("each question must have a text")
		}
		if len(question.Answers) == 0 {
			return errors.New("each question must have at least one answer")
		}

		correctAnswerFound := false
		for _, answer := range question.Answers {
			if answer.Text == "" {
				return errors.New("each answer must have a text")
			}
			if answer.IsCorrect {
				correctAnswerFound = true
			}
		}
		if !correctAnswerFound {
			return errors.New("each question must have at least one correct answer")
		}
	}
	return nil
}
