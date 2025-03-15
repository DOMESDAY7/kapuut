import H1 from "@/components/ui/H1";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { baseUrlAPI } from "@/consts";
import { Answers, Questions } from "@/types/model";
import { useState } from "react";

export function AnswerButton({ icon }: { icon: string }) {
    const [value, setValue] = useState<string>('');

    return (
        <div className="relative flex items-center justify-center border-2 border-accent rounded-xl h-10 px-1 text-accent">
            <span className="px-1">{icon}</span>
            <input
                className="w-full h-full rounded-r-xl text-accent"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            {/* <Button variant={"ghost"}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </Button> */}
        </div>

    )
}



export default function CreateQuizPage() {
    const initialQuestions: Questions[] = [];

    const [questions, setQuestions] = useState<Questions[]>(initialQuestions);
    const [addingAnswerForQuestionId, setAddingAnswerForQuestionId] = useState<string | null>(null);
    const [newAnswerText, setNewAnswerText] = useState('');

    const addAnswer = (questionId: string, answerText: string) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question => {
                if (question.questionId === questionId) {
                    const newAnswer: Answers = {
                        answerId: Math.random().toString(),
                        answer: answerText,
                        isCorrect: false,
                        questionId: questionId,
                    };
                    return {
                        ...question,
                        answer: [...question.answer, newAnswer],
                    };
                }
                return question;
            })
        );
    };

    // const handleAddAnswerSubmit = () => {
    //     if (addingAnswerForQuestionId && newAnswerText.trim()) {
    //         addAnswer(addingAnswerForQuestionId, newAnswerText.trim());
    //         setAddingAnswerForQuestionId(null);
    //         setNewAnswerText('');
    //     }
    // };

    // const deleteAnswer = (questionId: string, answerId: string) => {

    //     setQuestions(prevQuestions =>
    //         prevQuestions.map(question => {
    //             if (question.questionId === questionId) {
    //                 return {
    //                     ...question,
    //                     answer: question.answer.filter(a => a.answerId !== answerId),
    //                 };
    //             }
    //             return question;
    //         })
    //     );
    // };

    const addQuestion = () => {
        setQuestions(prevQuestions => [
            ...prevQuestions,
            {
                questionId: Math.random().toString(),
                question: '',
                answer: [],
            },
        ]);
    }

    const deleteQuestion = () => {
        setQuestions(prevQuestions => {
            const newQuestions = [...prevQuestions];
            newQuestions.pop();
            return newQuestions;
        });
    }

    const handleCreateQuiz = async () => {
        const reqCreatequiz = await fetch(baseUrlAPI + "/quizzes", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await reqCreatequiz.json();

        if (data.success) {
            console.log('Quiz created');
        }

    }

    return (
        <div className="w-svw flex flex-col items-center mt-5 gap-5">
            <H1>Create your quiz !</H1>

            <div className="flex flex-col items-center gap-y-5 w-1/2">
                {
                    questions?.map((question) => (
                        <div
                            key={question.questionId}
                            className="flex flex-col justify-center border-2 border-accent backdrop-blur-sm rounded-2xl p-5 gap-y-5  w-full relative">
                            <div className="absolute -top-2 -right-2 rounded-full cursor-pointer hover:text-accent hover:bg-destructive text-destructive bg-accent transition-all border border-accent" onClick={() => deleteQuestion()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                            </div>

                            {
                                question.question ? <h3 className="text-accent text-xl mb-5">{question.question}</h3> : <Input placeholder="Your question..."/>
                            }


                            <div className="grid grid-cols-2 gap-5">
                                <AnswerButton icon={"🥚"} />
                                <AnswerButton icon="🐔" />
                                <AnswerButton icon="🦕" />
                                <AnswerButton icon="🍗" />
                            </div>
                        </div>
                    ))
                }
                <Button onClick={() => addQuestion()} className="w-full">Add question</Button>
                <Button onClick={() => handleCreateQuiz()} className="w-full">Create the quiz</Button>
            </div>


        </div>

    )
}