import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
    return (
        <div className="bg- h-svh">
            <div className=" flex flex-col items-center justify-center gap-5 divide-y-2">
                <Input placeholder="Nom de la partie" />
                
                <Button variant="default" size="default">Rejoindre une partie</Button>
            </div>
        </div>
    )
}