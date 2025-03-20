import H1 from "@/components/ui/H1";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { baseUrlAPI } from "@/consts";
import { Answers, Questions } from "@/types/model";
import { useEffect, useState } from "react";



export function AnswerButton({
    icon,
    value,
    isCorrect,
    onChange,
    onCorrectToggle,
    onDelete
}: {
    icon: string;
    value: string;
    isCorrect: boolean;
    onChange: (value: string) => void;
    onCorrectToggle: () => void;
    onDelete: () => void;
}) {
    return (
        <div className={`relative flex items-center justify-between border-2 ${isCorrect ? 'border-green-500' : 'border-accent'} rounded-xl h-10 px-1 text-accent`}>
            <div className="flex items-center flex-1">
                <span className="px-1">{icon}</span>
                <input
                    className="w-full h-full rounded-r-xl text-accent bg-transparent outline-none px-1"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Réponse..."
                />
            </div>
            <div className="flex items-center">
                <Button
                    variant="ghost"
                    className="p-1 size-7 hover:text-green-500"
                    onClick={onCorrectToggle}
                    title={isCorrect ? "Réponse correcte" : "Marquer comme correcte"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-5 ${isCorrect ? 'text-green-500' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </Button>
                <Button
                    variant="ghost"
                    className="p-1 size-7 hover:text-red-500"
                    onClick={onDelete}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>

                </Button>
            </div>
        </div>
    );
}

const QUIZ_STORAGE_KEY = 'quiz_draft';
const ICONS = ["🥚", "🐔", "🦕", "🍗", "🦄", "🐙", "🦊", "🐶", "🐱", "🐭", "🐹", "🐰"];

export default function CreateQuizPage() {
    const [quizTitle, setQuizTitle] = useState<string>('');
    const [questions, setQuestions] = useState<Questions[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Charger les données du localStorage au chargement du composant
    useEffect(() => {
        const savedQuiz = localStorage.getItem(QUIZ_STORAGE_KEY);
        if (savedQuiz) {
            try {
                const parsedData = JSON.parse(savedQuiz);
                setQuizTitle(parsedData.title || '');
                setQuestions(parsedData.questions || []);
            } catch (error) {
                console.error("Erreur lors du chargement du quiz:", error);
            }
        }
    }, []);

    // Sauvegarder dans le localStorage à chaque changement
    useEffect(() => {
        localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify({
            title: quizTitle,
            questions
        }));
    }, [quizTitle, questions]);

    // Mise à jour du texte d'une question
    const updateQuestionText = (questionId: string, text: string) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question =>
                question.questionId === questionId
                    ? { ...question, question: text }
                    : question
            )
        );
    };

    // Ajouter une question
    const addQuestion = () => {
        setQuestions(prevQuestions => [
            ...prevQuestions,
            {
                questionId: Date.now().toString(),
                question: '',
                answer: [],
            },
        ]);
    };

    // Supprimer une question
    const deleteQuestion = (questionId: string) => {
        setQuestions(prevQuestions =>
            prevQuestions.filter(question => question.questionId !== questionId)
        );
    };

    // Ajouter une réponse à une question
    const addAnswer = (questionId: string) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question => {
                if (question.questionId === questionId) {
                    const iconIndex = question.answer.length % ICONS.length;
                    const newAnswer: Answers = {
                        answerId: `ans_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                        answer: '',
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

    // Mettre à jour le texte d'une réponse
    const updateAnswerText = (questionId: string, answerId: string, text: string) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question => {
                if (question.questionId === questionId) {
                    return {
                        ...question,
                        answer: question.answer.map(ans =>
                            ans.answerId === answerId
                                ? { ...ans, answer: text }
                                : ans
                        ),
                    };
                }
                return question;
            })
        );
    };

    // Changer l'état correct/incorrect d'une réponse
    const toggleAnswerCorrect = (questionId: string, answerId: string) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question => {
                if (question.questionId === questionId) {
                    return {
                        ...question,
                        answer: question.answer.map(ans =>
                            ans.answerId === answerId
                                ? { ...ans, isCorrect: !ans.isCorrect }
                                : ans
                        ),
                    };
                }
                return question;
            })
        );
    };

    // Supprimer une réponse
    const deleteAnswer = (questionId: string, answerId: string) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question => {
                if (question.questionId === questionId) {
                    return {
                        ...question,
                        answer: question.answer.filter(ans => ans.answerId !== answerId),
                    };
                }
                return question;
            })
        );
    };

    // Validation avant envoi
    const validateQuiz = () => {
        if (!quizTitle.trim()) {
            alert("Veuillez ajouter un titre au quiz");
            return false;
        }

        if (questions.length === 0) {
            alert("Ajoutez au moins une question");
            return false;
        }

        for (const question of questions) {
            if (!question.question.trim()) {
                alert("Toutes les questions doivent avoir un texte");
                return false;
            }

            if (question.answer.length < 2) {
                alert(`La question "${question.question}" doit avoir au moins deux réponses`);
                return false;
            }

            if (!question.answer.some(ans => ans.isCorrect)) {
                alert(`La question "${question.question}" doit avoir au moins une réponse correcte`);
                return false;
            }

            for (const answer of question.answer) {
                if (!answer.answer.trim()) {
                    alert("Toutes les réponses doivent avoir un texte");
                    return false;
                }
            }
        }

        return true;
    };

    // Créer le quiz
    const handleCreateQuiz = async () => {
        if (!validateQuiz()) return;

        setIsSubmitting(true);

        try {
            const quizData = {
                name: quizTitle,
                questions: questions
            };
            
            const response = await fetch(`${baseUrlAPI}/api/quiz`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quizData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Quiz créé avec succès !');
                // Nettoyer les données après envoi réussi
                localStorage.removeItem(QUIZ_STORAGE_KEY);
                setQuizTitle('');
                setQuestions([]);
            } else {
                alert(`Erreur lors de la création du quiz: ${data.message || 'Erreur inconnue'}`);
            }
        } catch (error) {
            console.error('Erreur lors de la création du quiz:', error);
            alert('Une erreur est survenue lors de la création du quiz');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center mt-5 gap-5 pb-16">
            <H1>Create your quiz !</H1>

            <div className="flex flex-col items-center gap-y-5 w-full max-w-2xl px-4">
                <Input
                    placeholder="Titre du quiz..."
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="text-lg font-bold"
                />

                {questions.length === 0 ? (
                    <div className="text-center text-accent/70 my-8">
                        <p>Aucune question pour le moment</p>
                        <p>Cliquez sur "Ajouter une question" pour commencer</p>
                    </div>
                ) : (
                    questions.map((question, qIndex) => (
                        <div
                            key={question.questionId}
                            className="flex flex-col justify-center border-2 bg-accent/10 border-accent backdrop-blur-sm rounded-2xl p-5 gap-y-5 w-full relative"
                        >
                            <div
                                className="absolute -top-2 -right-2 rounded-full cursor-pointer hover:text-accent hover:bg-destructive text-destructive bg-accent transition-all border border-accent"
                                onClick={() => deleteQuestion(question.questionId)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="font-bold text-accent">{qIndex + 1}.</span>
                                <Input
                                    placeholder="Votre question..."
                                    value={question.question}
                                    onChange={(e) => updateQuestionText(question.questionId, e.target.value)}
                                    className="text-lg"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                {question.answer.length === 0 ? (
                                    <p className="text-center text-accent/70 my-2">Ajoutez des réponses</p>
                                ) : (
                                    question.answer.map((answer, index) => (
                                        <AnswerButton
                                            key={answer.answerId}
                                            icon={ICONS[index % ICONS.length]}
                                            value={answer.answer}
                                            isCorrect={answer.isCorrect}
                                            onChange={(value) => updateAnswerText(question.questionId, answer.answerId, value)}
                                            onCorrectToggle={() => toggleAnswerCorrect(question.questionId, answer.answerId)}
                                            onDelete={() => deleteAnswer(question.questionId, answer.answerId)}
                                        />
                                    ))
                                )}

                                <Button
                                    variant="outline"
                                    onClick={() => addAnswer(question.questionId)}
                                    className="mt-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Ajouter une réponse
                                </Button>
                            </div>
                        </div>
                    ))
                )}

                <Button
                    onClick={addQuestion}
                    className="w-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Ajouter une question
                </Button>

                <Button
                    onClick={handleCreateQuiz}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Création en cours...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            Créer le quiz
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}