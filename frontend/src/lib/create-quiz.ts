import { Questions } from "@/types/model"

export function saveQuestions(questions: Questions) {
    window.localStorage.setItem("questions", JSON.stringify(questions))
}

export function clearQuestions() {
    window.localStorage.removeItem("questions")
}