package quiz

import (
	"errors"
	"fmt"
)

type QuizService struct {
	repo *QuizRepository
}

// Create a new instance of QuizService
func NewQuizService(repo *QuizRepository) *QuizService {
	return &QuizService{repo: repo}
}

// Validate a quiz
func (qs *QuizService) VerifyQuiz(q Quiz) error {
	if q.Name == "" {
		return errors.New("quiz name is required")
	}
	if len(q.Questions) == 0 {
		return errors.New("the quiz must have at least one question")
	}
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

// Create a quiz
func (qs *QuizService) HandleCreateQuiz(q Quiz) error {
	if err := qs.VerifyQuiz(q); err != nil {
		return fmt.Errorf("quiz creation failed: %w", err)
	}

	if err := qs.repo.SaveQuiz(q); err != nil {
		return fmt.Errorf("quiz creation failed: %w", err)
	}

	return nil
}
