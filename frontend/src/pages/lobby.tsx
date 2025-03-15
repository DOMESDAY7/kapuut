import H1 from '@/components/ui/H1';
import { avatarList } from '@/consts';
import { useQRCode } from 'next-qrcode';
import { useParams } from 'react-router-dom';

export default function LobbyPage() {
    const { Canvas } = useQRCode();

    const parms = useParams();

    const players = [
        {
            name: "TrucMuche",
            avatar: 1
        },
        {
            name: "TrucMuche",
            avatar: 2
        },
        {
            name: "TrucMuche",
            avatar: 1
        },
        {
            name: "TrucMuche",
            avatar: 3
        },
        
        {
            name: "TrucMuche",
            avatar: 3
        },
        {
            name: "TrucMuche",
            avatar: 2
        },
        {
            name: "TrucMuche",
            avatar: 1
        },
        {
            name: "TrucMuche",
            avatar: 2
        },
        {
            name: "TrucMuche",
            avatar: 1
        },
        {
            name: "TrucMuche",
            avatar: 3
        },
        
        {
            name: "TrucMuche",
            avatar: 3
        },
        {
            name: "TrucMuche",
            avatar: 2
        },
        
        
        

    ]

    return (
        <div className='flex md:flex-row flex-col items-center justify-center h-svh w-svw gap-x-5 md:divide-x-2 divide-accent'>

            <div className='flex flex-col items-center justify-center p-5'>
                <Canvas
                    text={'/lobby/' + parms.id}
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
                    <p className='bg-secondary p-1 rounded text-center text-accent font-thin text-2xl'>{parms.id}</p>
                </div>
            </div>


            <div className='flex flex-col flex-wrap md:flex-row gap-5 md:w-1/2 md:max-w-xl h-1/2 md:h-[unset] overflow-auto'>
                {
                    players.map((player, index) => {
                        return <div key={index} className='text-white bg-secondary/50 backdrop-blur-sm rounded px-3 py-2 text-xl'>{avatarList[player.avatar]}&nbsp;{player.name}</div>
                    })
                }
            </div>
        </div>
    )
}