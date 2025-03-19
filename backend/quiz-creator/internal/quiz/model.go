package quiz

type Answer struct {
	answer    string `json:"answer"`
	IsCorrect bool   `json:"is_correct"`
}

type Question struct {
	question string   `json:"question"`
	Answers  []Answer `json:"answers"`
}

type Quiz struct {
	Name      string     `json:"name"`
	Questions []Question `json:"questions"`
}
