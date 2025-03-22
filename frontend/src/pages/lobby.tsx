import H1 from '@/components/ui/H1';
import { useWebSocket, WebSocketProvider } from '@/services/ws';
import { WsMessageType } from '@/types/ws.d';
import { useQRCode } from 'next-qrcode';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

// Interface definitions from the Game component
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

export default function LobbyPage() {
    const params = useParams()
    return (
        <WebSocketProvider lobbyCode={params.id as string}>
            <LobbyContent id={params.id} />
        </WebSocketProvider>
    )
}

function LobbyContent({ id }: { id?: string }) {
    const { Canvas } = useQRCode();
    const navigate = useNavigate();

    if (!id) {
        return <div className='text-white'>No lobby code</div>
    }

    const { sendMessage, lastMessage } = useWebSocket();
    const [players, setPlayers] = useState<any[]>([]);
    const [playerName, setPlayerName] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [playerId, setPlayerId] = useState<string | null>(null);

    // Game state
    const [questionData, setQuestionData] = useState<QuestionData | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [hasAnswered, setHasAnswered] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);

    useEffect(() => {
        if (!lastMessage) return;

        if (lastMessage.type === WsMessageType.lobby) {
            console.log('Players in lobby:', lastMessage);
            if (Array.isArray(lastMessage.players)) {
                setPlayers(lastMessage.players);
            }
        }
        else if (lastMessage.type === WsMessageType.connect) {
            console.log('Player connected:', lastMessage);
            // Store player ID in state and localStorage
            if (lastMessage.newPlayer && lastMessage.newPlayer.playerId) {
                setPlayerId(lastMessage.newPlayer.playerId);
                localStorage.setItem('playerId', lastMessage.newPlayer.playerId);
            }
        }
        else if (lastMessage.type === WsMessageType.start) {
            console.log('Game started:', lastMessage);
            setGameStarted(true);
        }
        else if (lastMessage.type === WsMessageType.question) {
            console.log('New question received:', lastMessage);
            
            // Check if it's the last question
            if (lastMessage.state.current > lastMessage.state.end) {
                setGameOver(true);
                // Redirect to leaderboard page after a short delay
                setTimeout(() => {
                    navigate(`/leaderboard/${id}`);
                }, 3000);
            } else {
                setQuestionData(lastMessage);
                setSelectedAnswer(null);
                setHasAnswered(false);
                setGameStarted(true);
            }
        }
    }, [lastMessage]);

    const handleConnect = (name: string) => {
        const msg = {
            type: WsMessageType.connect,
            playerName: name,
            lobbyCode: id,
        };
        sendMessage(msg);
        setIsDialogOpen(false);
    }

    const handleStart = () => {
        sendMessage({
            type: WsMessageType.start,
            lobbyCode: id,
        })
    }

    // Handle answering a question
    const handleAnswer = (answerId: string | null) => {
        if (hasAnswered || !playerId) return;
    
        setSelectedAnswer(answerId);
        setHasAnswered(true);
    
        sendMessage({
            type: WsMessageType.answer,
            answerId: answerId,
            playerId: playerId,
            lobbyCode: id
        });
    };
    

    // Reset game state to return to lobby
    const handleReturnToLobby = () => {
        setGameStarted(false);
        setGameOver(false);
        setQuestionData(null);
    }

    // Game Over screen
    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center h-svh p-4 text-white">
                <H1>Game Over!</H1>
                <p className="text-xl mt-4">Thanks for playing</p>
            </div>
        );
    }

    // Game content when game has started
    if (gameStarted) {
        // Waiting for first question
        if (!questionData) {
            return (
                <div className="flex flex-col items-center justify-center h-svh p-4 text-white">
                    <H1>Waiting for the first question...</H1>
                    <div className="mt-8 animate-bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                        </svg>
                    </div>
                </div>
            );
        }

        // Question screen
        return (
            <div className="flex flex-col items-center h-svh p-4">
                {/* Quiz progress */}
                <div className="w-full mb-8">
                    <div className="flex justify-between items-center mb-2 text-white">
                        <span>Question {questionData.state.current}/{questionData.state.end}</span>
                    </div>
                    <Progress value={(questionData.state.current / questionData.state.end) * 100} className="h-2" />
                </div>

                {/* Question */}
                <div className="w-full max-w-2xl bg-secondary/30 backdrop-blur-md rounded-lg p-6 mb-8">
                    <H1>{questionData.question.question}</H1>
                </div>

                {/* Answers */}
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

                {/* Message if answer is submitted */}
                {hasAnswered && (
                    <div className="mt-8 text-white text-xl">
                        Waiting for other players...
                    </div>
                )}
            </div>
        );
    }

    // Lobby content (when game hasn't started)
    return (
        <>
            <AlertDialog open={isDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogDescription>
                            <Input
                                placeholder='your pseudo'
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                            />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => handleConnect(playerName)}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className='flex md:flex-row flex-col items-center justify-center h-svh w-svw gap-x-5 md:divide-x-2 divide-accent'>

                <div className='flex flex-col items-center justify-center p-5'>
                    <Canvas
                        text={'/lobby/' + id}
                        options={{
                            errorCorrectionLevel: 'M',
                            margin: 3,
                            scale: 4,
                            width: 200,
                            color: {
                                dark: '#fff',
                                light: '#00000000',
                            },
                        }}
                    />
                    <div />
                    <div>
                        <H1>Lobby code : </H1>
                        <p className='bg-secondary p-1 rounded text-center text-accent font-thin text-2xl'>{id}</p>
                    </div>
                </div>


                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col flex-wrap md:flex-row gap-5 md:w-1/2 md:max-w-xl h-1/2 md:h-[unset] overflow-auto'>
                        {
                            players.map((player, index) => {
                                return <div
                                    key={index}
                                    className='text-white bg-secondary/50 backdrop-blur-sm rounded px-3 py-2 text-xl'>
                                    {player}
                                </div>
                            })
                        }
                    </div>
                    <Button
                        className={cn(buttonVariants({ variant: "default" }), "flex-1 bg-green-600 hover:bg-green-700")}
                        onClick={() => handleStart()}
                        disabled={players.length < 2}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 0 1 0 1.971l-11.54 6.347a1.125 1.125 0 0 1-1.667-.985V5.653Z" />
                        </svg>
                        Play
                    </Button>
                </div>
            </div>
        </>
    )
}