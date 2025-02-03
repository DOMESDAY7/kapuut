import H1 from '@/components/ui/H1';
import { useQRCode } from 'next-qrcode';
import { useParams } from 'react-router-dom';

export default function Lobby() {
    const { Canvas } = useQRCode();

    let parms = useParams();

    const players = [
        {
            name: "TrucMuche",
        },
        {
            name: "TrucMuche",
        },
        {
            name: "TrucMuche",
        },
        {
            name: "TrucMuche",
        },
        {
            name: "TrucMuche",
        },
       
    ]

    return (
        <div className='flex flex-col items-center justify-center h-svh'>
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
            <div className="flex items-center justify-center gap-x-5">
                <H1>Lobby code : </H1>
                <p className='bg-secondary p-1 rounded text-center text-accent font-thin text-2xl'>{parms.id}</p>
            </div>

            <div className='flex flex-col flex-wrap gap-y-5' id="players">
                {
                    players.map((player, index) => {
                        return <div key={index} className='text-white bg-secondary rounded px-3 py-2 text-xl'>{player.name}</div>
                    })
                }
            </div>
        </div>
    )
}