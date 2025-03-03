import H1 from "@/components/ui/H1";
import { Button } from "@/components/ui/button";

export default function CreateQuizPage() {
    const questions = [
        {
            id: "izurhf",
            question: "Que boivent les vaches ?",
            answers: [
                "du lait",
                "du l'eau",
                "du chocolat"
            ]

        },
        {
            id: "izurhf",
            question: "Que boivent les vaches ?",
            answers: [
                "du lait",
                "du l'eau",
                "du chocolat"
            ]

        },
        {
            id: "izurhf",
            question: "Que boivent les vaches ?",
            answers: [
                "du lait",
                "du l'eau",
                "du chocolat"
            ]

        }
    ]
    return (
        <div className="h-svh w-svw flex flex-col items-center justify-center gap-5">
            <H1>Create your quiz !</H1>

            <div>

                {
                    questions.length == 0 && (
                        <Button>
                            Add question
                        </Button>
                    )
                }

                {
                    questions?.map((question) => (

                        <div className="flex flex-col items-center justify-center">

                            <p className="text-accent">{question.question}</p>
                            <div>
                                {question.answers.map((answer) => (
                                    <div className="text-accent">
                                        {answer}
                                    </div>
                                ))}
                                <Button>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    )

                    )
                }

            </div>
        </div>

    )
}