import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/consts";

export default function Home() {

    return (
        <div className="h-svh flex flex-col items-center justify-center bg-purple-900">
            <h1 className="font-bold text-5xl text-white capitalize">
                {APP_NAME} !
            </h1>
            <div className="flex flex-col items-center jus tify-center gap-5 px-20 py-10 rounded">
                <div className="flex flex-col gap-5">
                    <div className="flex gap-x-5">
                        <Input placeholder="Code" />
                        <Button variant="default" size="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-x-3 w-full py-2">
                        <div className="flex-1 border-t border-white" />
                        <p className="text-white">Ou</p>
                        <div className="flex-1 border-t border-white" />
                    </div>

                </div>
                <Button variant="default" size="default" className="w-full">Créer un questionnaire</Button>
            </div>
        </div>
    )
}