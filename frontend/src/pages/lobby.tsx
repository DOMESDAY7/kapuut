import H1 from '@/components/ui/H1';
import { useWebSocket, WebSocketProvider } from '@/services/ws';
import { WsMessageType } from '@/types/ws.d';
import { useQRCode } from 'next-qrcode';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';

export default function LobbyPage() {
    const parms = useParams()
    return (
        <WebSocketProvider lobbyCode={parms.id as string}>
            <LobbyContent id={parms.id} />
        </WebSocketProvider>
    )
}

function LobbyContent({ id }: { id?: string }) {
    const { Canvas } = useQRCode();

    if (!id) {
        return <div className='text-white'>No lobby code</div>
    }

    const { sendMessage, lastMessage } = useWebSocket();
    const [players, setPlayers] = useState<any[]>([]);
    const [playerName, setPlayerName] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);

    useEffect(() => {
        if (!lastMessage) return;
        
        if (lastMessage.type === WsMessageType.lobby) {
            console.log('Players in lobby:', lastMessage);
            // Assurez-vous que lastMessage.players est un tableau
            if (Array.isArray(lastMessage.players)) {
                setPlayers(lastMessage.players);
            }
        }
        else if (lastMessage.type === WsMessageType.connect) {
            console.log('Player connected:', lastMessage);
            
            // Ne mettez pas à jour l'état ici, la mise à jour viendra du message WsMessageType.lobby
            // qui sera envoyé à tous les clients
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
            </div>
        </>
    )
}