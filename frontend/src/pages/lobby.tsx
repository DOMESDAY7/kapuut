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
        }
    ]

    return (
        <div className='flex flex-col items-center justify-center bg-purple-900 h-svh'>
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

            <p className='text-white text-3xl'>Lobby code : <pre className='bg-secondary p-1 rounded text-center'>{parms.id}</pre></p>

            <div className='' id="players">
                {
                    players.map((player, index) => {
                        return <div key={index} className='text-white bg-secondary'>{player.name}</div>
                    })
                }
            </div>
        </div>
    )
}