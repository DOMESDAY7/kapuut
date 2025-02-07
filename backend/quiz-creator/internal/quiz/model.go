package quiz

type Answer struct {
	Text      string `json:"text"`
	IsCorrect bool   `json:"is_correct"`
}

type Question struct {
	Text    string   `json:"text"`
	Answers []Answer `json:"answers"`
}

type Quiz struct {
	Name      string     `json:"name"`
	Questions []Question `json:"questions"`
}
