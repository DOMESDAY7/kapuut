package QuizzCreator

import "errors"

type Answer struct {
	Answer    string
	IsCorrect bool
}

type Question struct {
	Question string
	Answer   []Answer
}

type Quiz struct {
	QuizName  string
	Questions []Question
}

type QuizCreator struct {
	quiz Quiz
}

func (q QuizCreator) HandleCreateQuiz(quiz Quiz) {
	// verify the content of the quiz
	quiz.VerifyQuiz()

	//
}

func (q QuizCreator) VerifyQuiz() {
	// verify the content of the quiz
	// check if the quiz has a name
	if q.quiz.QuizName == "" {
		return errors.New("Quiz name is required")
	}
	// check if the quiz has questions and there is no empty question
	if len(q.quiz.Questions) == 0 {
		return errors.New("Quiz must have at least one question")
	}
	// check if the questions have answers and there is no empty answer
	// check if the answers have a correct answer

	// if the quiz is not valid, return an error
	// if the quiz is valid, return the quiz

}

func CreateQuiz() {

}
