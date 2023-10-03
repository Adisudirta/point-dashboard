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
import { NavLink, useLoaderData } from "@remix-run/react";
import { requireUserRole } from "~/models/user/user.session";
import { Member } from "~/models/user/user.entity";
import { getUserById } from "~/models/user/user.server";

export async function loader({ request }: { request: Request }) {
  const { auth } = await requireUserRole(request, "member");
  const user = await getUserById(auth.uid);

  return { user };
}

export default function Dashboard() {
  const { user }: { user: Member } = useLoaderData();
  console.log(user);

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

          <h2 className="font-semibold text-2xl">{user.displayName}</h2>
          <p>{user.email}</p>
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
                  {user.point}
                </span>
              </div>
            </CardContent>
          </Card>
        </CardContent>

        <CardFooter>
          <NavLink to="/logout" className="w-full">
            <Button
              type="submit"
              name="intent"
              value="logout"
              variant="destructive"
              className="w-full"
            >
              <LogOut className="mr-2 h-5 w-5" /> Logout
            </Button>
          </NavLink>
        </CardFooter>
      </Card>
    </div>
  );
}
