import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useWebSocket, WebSocketProvider } from '@/services/ws';
import { WsMessageType } from '@/types/ws.d';
import H1 from '@/components/ui/H1';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Question {
    questionId: string;
    question: string;
}

interface Answer {
    answerId: string;
    answer: string;
    isCorrect?: boolean;
}

interface QuestionState {
    current: number;
    end: number;
}

interface QuestionData {
    type: WsMessageType.question;
    question: Question;
    answers: Answer[];
    time: string;
    state: QuestionState;
}

export default function GamePage() {
    const params = useParams();
    const lobbyCode = params.id as string;

    return (
        <WebSocketProvider lobbyCode={lobbyCode}>
            <Game lobbyCode={lobbyCode} />
        </WebSocketProvider>
    );
}

function Game({ lobbyCode }: { lobbyCode: string }) {
    const { sendMessage, lastMessage } = useWebSocket();
    const [questionData, setQuestionData] = useState<QuestionData | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [hasAnswered, setHasAnswered] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(10); // Temps en secondes pour répondre
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [gameOver, setGameOver] = useState<boolean>(false);

    // Récupérer l'ID du joueur du localStorage (défini lors de la connexion)
    useEffect(() => {
        const storedPlayerId = localStorage.getItem('playerId');
        if (storedPlayerId) {
            setPlayerId(storedPlayerId);
        }
    }, []);

    // Gestion des messages WebSocket
    useEffect(() => {
        if (!lastMessage) return;

        if (lastMessage.type === WsMessageType.question) {
            console.log('New question received:', lastMessage);
            setQuestionData(lastMessage);
            setSelectedAnswer(null);
            setHasAnswered(false);
            setTimeLeft(10); // Réinitialiser le timer à chaque nouvelle question

            // Vérifier si c'est la dernière question
            if (lastMessage.state.current > lastMessage.state.end) {
                setGameOver(true);
            }
        }
    }, [lastMessage]);

    // Timer pour répondre à la question
    useEffect(() => {
        if (!questionData || hasAnswered || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAnswer(null); // Envoyer une réponse vide si le temps est écoulé
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [questionData, hasAnswered]);

    // Gérer la sélection d'une réponse
    const handleAnswer = (answerId: string | null) => {
        if (hasAnswered || !playerId) return;

        setSelectedAnswer(answerId);
        setHasAnswered(true);

        // Envoyer la réponse au serveur
        sendMessage({
            type: WsMessageType.answer,
            answerId: answerId,
            playerId: playerId,
            lobbyCode: lobbyCode
        });
    };

    // Si le jeu est terminé
    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center h-svh p-4 text-white">
                <H1>Partie terminée !</H1>
                <p className="text-xl mt-4">Merci d'avoir joué</p>
                <Button
                    className="mt-8"
                    onClick={() => window.location.href = '/'}
                >
                    Retour à l'accueil
                </Button>
            </div>
        );
    }

    // En attente de la première question
    if (!questionData) {
        return (
            <div className="flex flex-col items-center justify-center h-svh p-4 text-white">
                <H1>En attente de la première question...</H1>
                <div className="mt-8 animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center h-svh p-4">
            {/* Progression du quiz */}
            <div className="w-full mb-8">
                <div className="flex justify-between items-center mb-2 text-white">
                    <span>Question {questionData.state.current}/{questionData.state.end}</span>
                    <span>{timeLeft}s</span>
                </div>
                <Progress value={(questionData.state.current / questionData.state.end) * 100} className="h-2" />
            </div>

            {/* Question */}
            <div className="w-full max-w-2xl bg-secondary/30 backdrop-blur-md rounded-lg p-6 mb-8">
                <H1 >{questionData.question.question}</H1>
            </div>

            {/* Réponses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {questionData.answers.map((answer) => (
                    <Button
                        key={answer.answerId}
                        onClick={() => handleAnswer(answer.answerId)}
                        disabled={hasAnswered}
                        className={`p-4 h-auto text-lg transition-all ${selectedAnswer === answer.answerId
                                ? "bg-accent text-black"
                                : "bg-secondary hover:bg-secondary/80"
                            } ${hasAnswered ? "opacity-60" : ""}`}
                    >
                        {answer.answer}
                    </Button>
                ))}
            </div>

            {/* Message si on a répondu */}
            {hasAnswered && (
                <div className="mt-8 text-white text-xl">
                    En attente des autres joueurs...
                </div>
            )}
        </div>
    );
}