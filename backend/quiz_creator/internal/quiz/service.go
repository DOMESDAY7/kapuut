package quiz

import (
	"errors"
	"fmt"
)

type QuizService struct {
	repo *QuizRepository
}

// Créer une nouvelle instance de QuizService
func NewQuizService(repo *QuizRepository) *QuizService {
	return &QuizService{repo: repo}
}

// Vérifier la validité d'un quiz
func (qs *QuizService) VerifyQuiz(q Quiz) error {
	if q.Name == "" {
		return errors.New("le nom du quiz est requis")
	}
	if len(q.Questions) == 0 {
		return errors.New("le quiz doit contenir au moins une question")
	}
	for _, question := range q.Questions {
		if question.Text == "" {
			return errors.New("chaque question doit avoir un texte")
		}
		if len(question.Answers) == 0 {
			return errors.New("chaque question doit contenir au moins une réponse")
		}
		correctAnswerFound := false
		for _, answer := range question.Answers {
			if answer.Text == "" {
				return errors.New("chaque réponse doit avoir un texte")
			}
			if answer.IsCorrect {
				correctAnswerFound = true
			}
		}
		if !correctAnswerFound {
			return errors.New("chaque question doit contenir au moins une réponse correcte")
		}
	}
	return nil
}

// Créer un quiz
func (qs *QuizService) HandleCreateQuiz(q Quiz) error {
	if err := qs.VerifyQuiz(q); err != nil {
		return fmt.Errorf("la création du quiz a échoué : %w", err)
	}

	if err := qs.repo.SaveQuiz(q); err != nil {
		return err
	}

	return nil
}
