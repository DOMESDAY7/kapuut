import H1 from '@/components/ui/H1';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { baseUrlAPI } from '@/consts';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Player {
    player_id: string;
    name: string;
    score: number;
}

interface PlayerWithRank extends Player {
    rank: number;
}

export default function LeaderboardPage() {
    const params = useParams();
    const navigate = useNavigate();
    const lobbyCode = params.id;
    
    const [players, setPlayers] = useState<PlayerWithRank[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Calling the leaderboard service API
                const response = await fetch(`${baseUrlAPI}/api/leaderboard/${lobbyCode}`);
                const responseData = await response.json();
                console.log(responseData);
                const data = responseData as Player[];
                
                // Add rank to players
                const playersWithRank = data.map((player, index) => ({
                    ...player,
                    rank: index + 1  // Rank starts at 1
                }));
                
                setPlayers(playersWithRank);
            } catch (err) {
                console.error("Error loading leaderboard:", err);
                setError("Unable to load classification. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [lobbyCode]);

    const handleReturnToHome = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-svh p-4 bg-primary">
            <Card className="w-full max-w-2xl bg-secondary/30 backdrop-blur-md">
                <CardHeader className="text-center">
                    <CardTitle>
                        <H1>Final ranking</H1>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center p-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-white text-center">
                            {error}
                        </div>
                    ) : players.length === 0 ? (
                        <div className="bg-secondary/50 rounded-lg p-4 text-white text-center">
                            No players found in this lobby.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {players.map((player) => (
                                <div 
                                    key={player.player_id}
                                    className={`flex items-center justify-between p-4 rounded-lg ${
                                        player.rank === 1 
                                            ? "bg-yellow-500/20 border border-yellow-400" 
                                            : player.rank === 2 
                                                ? "bg-slate-400/20 border border-slate-300" 
                                                : player.rank === 3 
                                                    ? "bg-amber-600/20 border border-amber-500" 
                                                    : "bg-secondary/50"
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 font-bold ${
                                            player.rank === 1 
                                                ? "bg-yellow-400 text-black" 
                                                : player.rank === 2 
                                                    ? "bg-slate-300 text-black" 
                                                    : player.rank === 3 
                                                        ? "bg-amber-500 text-black" 
                                                        : "bg-secondary text-white"
                                        }`}>
                                            {player.rank}
                                        </div>
                                        <span className="text-white text-xl">{player.name}</span>
                                    </div>
                                    <span className="text-white text-xl font-bold">{player.score}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex justify-center">
                        <Button 
                            onClick={handleReturnToHome}
                            className="bg-accent hover:bg-accent/80 text-black"
                        >
                            Back to home page
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}