import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/consts";

export default function Home() {

    return (
        <div className="h-svh flex items-center justify-center">
            <div className=" flex flex-col items-center justify-center gap-5">
                <h1 className="font-bold text-3xl text-purple-900 capitalize">
                    {APP_NAME}
                </h1>
                <div className="flex flex-col gap-5 divide-y-2">
                    <div className="flex gap-x-5">
                        <Input placeholder="Code" />
                        <Button variant="default" size="icon">{"->"}</Button>
                    </div>
                    <div className="flex gap-x-3 items-center justify-center">
                        <div className="border border-t translate-y-1/2" />
                        <p>Ou</p>
                        <div className="border border-b translate-y-1/2" />
                    </div>
                </div>
                <Button variant="default" size="default" className="w-full">Créer un questionnaire</Button>
            </div>
        </div>
    )
}