import H1 from "@/components/ui/H1";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { avatarList } from "@/consts";

export default function ProfileSetup() {

    

    return (
        <div className="h-svh flex flex-col items-center justify-center">
            <H1 >Choose your avatar :</H1>
            <div>
                <div>
                    {
                        avatarList.map((avatar) => (
                            <Button key={avatar} className="p-12 aspect-square text-7xl">{avatar}</Button>
                        ))
                    }
                </div>

                <Input placeholder="Enter pseudo" />
            </div>
        </div>
    )
}