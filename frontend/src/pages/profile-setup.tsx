import H1 from "@/components/ui/H1";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { avatarList } from "@/consts";

export default function ProfileSetupPage() {

    return (
        <div className="h-svh flex flex-col gap-5 items-center justify-center">

            <H1 >Who are you?</H1>

            <div className="flex flex-col md:flex-row gap-5 items-center justify-center w-11/12">
                <div className="w-full flex gap-5 justify-between md:justify-end md:border-r p-5 border-accent">
                    {
                        avatarList.map((avatar) => (
                            <Button key={avatar} className="md:p-12 md:size-12 md:text-7xl p-3 size-12 text-4xl">{avatar}</Button>
                        ))
                    }
                </div>

                <div className="flex gap-3 w-full">
                    <Input placeholder="Enter pseudo" className="max-w-100" />
                    <Button variant="default" size="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </Button>
                </div>
            </div>
        </div>
    )
}