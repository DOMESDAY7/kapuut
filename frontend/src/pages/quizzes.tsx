import { useState, useEffect } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { baseUrlAPI } from '@/consts';
import { Questions } from '@/types/model';
import { cn } from '@/lib/utils';

type QuizDisplay = {
    quizId: string;
    quiz: string;
    questions: Questions[];
}

export default function QuizList() {
    const [quizzes, setQuizzes] = useState<QuizDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const resGetQuizzes = await fetch(`${baseUrlAPI}/api/quiz`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                const dataGetQuizzes = await resGetQuizzes.json();
                setQuizzes(dataGetQuizzes ?? []);
                setIsLoading(false);

            } catch (error) {
                console.error("Erreur lors du chargement des quiz:", error);
                setIsLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    // Filtrer les quiz selon le terme de recherche
    const filteredQuizzes = quizzes.filter(quiz =>
        quiz?.quiz?.toLowerCase()?.includes(searchTerm.toLowerCase())
    ) ?? [];


    return (
        <div className="w-full flex flex-col items-center mt-5 gap-5 pb-16 text-accent">
            <h1 className="text-3xl font-bold">Browse all quiz</h1>

            <div className="flex flex-col items-center gap-y-5 w-full max-w-4xl px-4">
                <div className="flex w-full gap-4">
                    <Input
                        placeholder="Rechercher un quiz..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow"
                    />
                    <Button
                        variant="outline"
                        className="flex-shrink-0"
                        onClick={() => setSearchTerm('')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </div>

                <div className="flex justify-between w-full">
                    <h2 className="text-xl font-medium">
                        {isLoading ? 'Chargement...' : `${filteredQuizzes.length} quiz available`}
                    </h2>
                    <Button
                        onClick={() => window.location.href = '/create-quiz'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Create a quiz
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center w-full my-12">
                        <svg className="animate-spin h-10 w-10 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : filteredQuizzes.length === 0 ? (
                    <div className="text-center text-accent/70 my-12">
                        <p>Aucun quiz ne correspond à votre recherche</p>
                        <p>Essayez avec d'autres termes ou créez votre propre quiz</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {filteredQuizzes.map((quiz) => (
                            <Card key={quiz.quizId} className="border-2 border-accent/30 hover:border-accent transition-all duration-300">
                                <CardHeader>
                                    <CardTitle className="text-xl">{quiz.quiz}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-accent">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                                            </svg>
                                            {quiz.questions.length} questions
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex gap-2">
                                    {/* <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => window.location.href = `/quiz/${quiz.quizId}/edit`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                        Edit
                                    </Button> */}
                                    <a
                                        className={cn(buttonVariants({ variant: "default" }), "flex-1 bg-green-600 hover:bg-green-700")}
                                        href={`/quiz/${quiz.quizId}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 0 1 0 1.971l-11.54 6.347a1.125 1.125 0 0 1-1.667-.985V5.653Z" />
                                        </svg>
                                        Play
                                    </a>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}