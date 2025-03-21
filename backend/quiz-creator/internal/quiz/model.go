package quiz

type Answer struct {
	AnswerId   string `json:"answerId"`
	Answer     string `json:"answer"`
	IsCorrect  bool   `json:"isCorrect"`
	QuestionId string `json:"questionId"`
}

type Question struct {
	QuizId     string   `json:"quizId"`
	QuestionId string   `json:"questionId"`
	Question   string   `json:"question"`
	Answers    []Answer `json:"answer"`
}

type Quiz struct {
	QuizId    string     `json:"quizId"`
	Quiz      string     `json:"quiz"`
	Questions []Question `json:"questions"`
}
