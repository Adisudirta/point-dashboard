import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import { LogOut, Coins } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="container flex justify-center pt-[calc(25px+80px)]">
      <Card className="w-[320px]">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-2">
          <Avatar className="h-[150px] w-[150px] z-0">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>

          <h2 className="font-semibold text-2xl">Adi Sudirta</h2>
          <p>yanadisudirta@gmail.com</p>
          <br />

          <Card className="mt-20 w-full">
            <CardHeader className="pb-0">
              <CardTitle className="text-center text-lg">
                Total Points:
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-center">
                <Coins className="text-yellow-500 mr-2" />
                <span className="font-semibold text-4xl text-yellow-500">
                  1000
                </span>
              </div>
            </CardContent>
          </Card>
        </CardContent>

        <CardFooter>
          <Button variant="destructive" className="w-full">
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
