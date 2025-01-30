import { useQRCode } from 'next-qrcode';

export default function Lobby() {
    const { Canvas } = useQRCode();

    return (
        <>
            <Canvas
                text={'https://github.com/bunlong/next-qrcode'}
                options={{
                    errorCorrectionLevel: 'M',
                    margin: 3,
                    scale: 4,
                    width: 200,
                    color: {
                        dark: '#010599FF',
                        light: '#FFBF60FF',
                    },
                }}
            />
        </>
    )
}