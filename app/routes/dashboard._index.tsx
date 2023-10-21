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
import { getUserById } from "~/models/user/user.server";
import { DataTable } from "~/components/data-table";

import type { Member } from "~/models/user/user.entity";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils";

type Activity = {
  id: string;
  date: string;
  activity: string;
  reward: number;
};

const dataDummy: Activity[] = [
  {
    id: "1",
    date: formatDate(1634192400),
    activity: "Startup Day Primakara Developers",
    reward: 50,
  },
  {
    id: "2",
    date: formatDate(1634192400),
    activity: "Startup Day Primakara Developers",
    reward: 30,
  },
  {
    id: "3",
    date: formatDate(1634192400),
    activity: "Startup Day Primakara Developers",
    reward: 20,
  },
  {
    id: "12",
    date: formatDate(1634192400),
    activity: "Startup Day Primakara Developers",
    reward: 50,
  },
  {
    id: "23",
    date: formatDate(1634192400),
    activity: "Startup Day Primakara Developers",
    reward: 30,
  },
  {
    id: "34",
    date: formatDate(1634192400),
    activity: "Startup Day Primakara Developers",
    reward: 20,
  },
  {
    id: "14",
    date: formatDate(1634192400),
    activity: "Startup Day Primakara Developers",
    reward: 50,
  },
  {
    id: "26",
    date: formatDate(1634192400),
    activity: "Startup Day Primakara Developers",
    reward: 30,
  },
  {
    id: "38",
    date: formatDate(1634192400),
    activity: "Startup Day Primakara Developers",
    reward: 20,
  },
  {
    id: "23",
    date: formatDate(1634192400),
    activity: "Startup Day Primakara Developers",
    reward: 30,
  },
  {
    id: "44",
    date: formatDate(1634192400),
    activity: "Startup Day Primakara Developers",
    reward: 20,
  },
  {
    id: "44",
    date: formatDate(1634192400),
    activity: "Startup Day Primakara Developers",
    reward: 50,
  },
  {
    id: "46",
    date: formatDate(1634192400),
    activity: "Startup Day Primakara Developers",
    reward: 30,
  },
  {
    id: "48",
    date: formatDate(1634192400),
    activity: "Startup Day Primakara Developers",
    reward: 20,
  },
];

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "activity",
    header: "Activity",
    cell: ({ row }) => (
      <span className="font-semibold text-blue-600">
        {row.getValue("activity")}
      </span>
    ),
  },
  {
    accessorKey: "reward",
    header: "Reward",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Coins className="text-yellow-500 mr-2" />
        <span className="font-semibold text-yellow-500">
          {row.getValue("reward")}
        </span>
      </div>
    ),
  },
];

export async function loader({ request }: { request: Request }) {
  const { auth } = await requireUserRole(request, "member");
  const user = await getUserById(auth.uid);

  return { user };
}

export default function Dashboard() {
  const { user }: { user: Member } = useLoaderData();

  return (
    <div className="container flex flex-col gap-10 justify-center pt-[calc(25px+80px)] md:flex-row md:gap-3">
      <Card className="h-fit w-[320px]">
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
                  {user.currentPoint}
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

      <Card className="h-fit w-full md:w-[800px]">
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>

        <CardContent className="overflow-auto">
          <div className="w-[600px] md:w-full">
            <DataTable columns={columns} data={dataDummy} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
