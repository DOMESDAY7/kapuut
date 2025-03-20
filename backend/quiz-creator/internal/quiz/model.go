package quiz

type Answer struct {
	AnswerId   string `json:"answerId"`
	Answer     string `json:"answer"`
	IsCorrect  bool   `json:"isCorrect"`
	QuestionId string `json:"questionId"`
}

type Question struct {
	QuestionId string   `json:"questionId"`
	Question   string   `json:"question"`
	Answers    []Answer `json:"answer"`
}

type Quiz struct {
	Name      string     `json:"name"`
	Questions []Question `json:"questions"`
}
