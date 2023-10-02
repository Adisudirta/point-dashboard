import { redirect, type MetaFunction, json } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import Loading from "~/components/loading";

import { register, login } from "~/models/user/user.server";
import { User } from "~/models/user/user.entity";

import * as z from "zod";
import { Form, useActionData, useNavigation } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const intent = formData.get("intent");

  if (intent === "register") {
    const registerProcessSchema = z.object({
      name: z.string().nonempty(),
      email: z.string().nonempty().email(),
      password: z.string().min(6),
    });

    const registerProcess = registerProcessSchema.safeParse(payload);

    if (!registerProcess.success) {
      return { registerErrors: registerProcess.error.flatten() };
    }

    await register(
      {
        name: payload?.name,
        email: payload?.email,
        password: payload?.password,
      } as User,
      "member"
    );

    return redirect("/dashboard");
  }

  if (intent === "login") {
    const loginProcessSchema = z.object({
      email: z.string().nonempty().email(),
      password: z.string().min(6),
    });

    const loginProcess = loginProcessSchema.safeParse(
      Object.fromEntries(formData)
    );

    if (!loginProcess.success) {
      return { loginErrors: loginProcess.error.flatten() };
    }

    await login({
      email: payload?.email,
      password: payload?.password,
    } as User);

    return redirect("/dashboard");
  }

  throw json({ message: "Invalid intent" }, { status: 400 });
}

export default function PageAuth() {
  const navigation = useNavigation();

  const actionData = useActionData() as any;
  const loginErrors = actionData?.loginErrors?.fieldErrors;
  const registerErrors = actionData?.registerErrors?.fieldErrors;

  return (
    <>
      <Loading isLoading={navigation.state === "submitting"} />

      <section>
        <div className="container flex h-screen items-center justify-center">
          <Tabs defaultValue="login" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <Form method="post">
                  <CardHeader>
                    <CardTitle>Login</CardTitle>

                    <CardDescription>
                      Selamat datang kembali, anggota Primakara Developers!
                      Senang bisa berjumpa kembali
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        required
                        type="email"
                        placeholder="jokosatoru@mail.com"
                      />

                      {loginErrors?.email && (
                        <span className="ml-1 text-red-500 text-sm">
                          {loginErrors?.email[0]}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        required
                        type="password"
                        placeholder="************"
                      />

                      {loginErrors?.password && (
                        <span className="ml-1 text-red-500 text-sm">
                          {loginErrors?.password[0]}
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button name="intent" value="login">
                      Login
                    </Button>
                  </CardFooter>
                </Form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <Form method="post">
                  <CardHeader>
                    <CardTitle>Register</CardTitle>

                    <CardDescription>
                      Senang melihatmu bergabung, mari kita berkembang bersama!
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="name">Username</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder="Joko Satoru"
                      />

                      {registerErrors?.name && (
                        <span className="ml-1 text-red-500 text-sm">
                          {registerErrors?.name[0]}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        required
                        name="email"
                        type="email"
                        placeholder="jokosatoru@mail.com"
                      />

                      {registerErrors?.email && (
                        <span className="ml-1 text-red-500 text-sm">
                          {registerErrors?.email[0]}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="email">Password</Label>
                      <Input
                        id="password"
                        required
                        type="password"
                        name="password"
                        placeholder="************"
                      />

                      {registerErrors?.password && (
                        <span className="ml-1 text-red-500 text-sm">
                          {registerErrors?.password[0]}
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button type="submit" name="intent" value="register">
                      Register
                    </Button>
                  </CardFooter>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
