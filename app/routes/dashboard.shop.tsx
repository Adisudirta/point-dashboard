import { Card, CardContent, CardFooter, CardTitle } from "~/components/ui/card";

import ExampleMerch from "~/assets/example-merchandise.jpg";
import { Coins } from "lucide-react";
import { Button } from "~/components/ui/button";

const dataDummy = [
  {
    id: 1,
    imgUrl: "#",
    title: "Paket Jaket Beserta Tumbler",
    price: 1000,
  },
  {
    id: 2,
    imgUrl: "#",
    title: "Paket Jaket Beserta Tumbler",
    price: 1000,
  },
  {
    id: 3,
    imgUrl: "#",
    title: "Paket Jaket Beserta Tumbler",
    price: 1000,
  },
  {
    id: 4,
    imgUrl: "#",
    title: "Paket Jaket Beserta Tumbler",
    price: 1000,
  },
  {
    id: 5,
    imgUrl: "#",
    title: "Paket Jaket Beserta Tumbler",
    price: 1000,
  },
  {
    id: 6,
    imgUrl: "#",
    title: "Paket Jaket Beserta Tumbler",
    price: 1000,
  },
];

export default function Shop() {
  return (
    <div className="container flex flex-wrap gap-x-10 gap-y-14 justify-center pt-[calc(25px+80px)]">
      {dataDummy.map((data) => (
        <Card key={data.id} className="overflow-hidden w-[350px]">
          <CardContent className="p-0">
            <img
              className="h-[250px] object-center object-cover w-full"
              src={ExampleMerch}
              alt="Merch"
            />
          </CardContent>

          <CardFooter className="flex flex-col gap-4 items-start pt-4">
            <CardTitle>{data.title}</CardTitle>
            <div className="flex items-center">
              <Coins className="text-yellow-500 mr-2" />
              <span className="font-semibold text-xl text-yellow-500">
                {data.price}
              </span>
            </div>

            <Button>Tukarkan Poin</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
