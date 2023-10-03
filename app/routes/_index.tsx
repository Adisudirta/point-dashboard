import {
  type MetaFunction,
  type ActionFunctionArgs,
  redirect,
  json,
} from "@remix-run/node";
import * as z from "zod";
import { Form, useActionData, useNavigation } from "@remix-run/react";

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
import { type AuthPayload } from "~/models/user/user.entity";
import { createUserSession, getUser } from "~/models/user/user.session";
import { authAdmin } from "~/plugins/firebase.admin";
import { FirebaseError } from "firebase/app";
import { useToast } from "~/components/ui/use-toast";
import { Toaster } from "~/components/ui/toaster";
import { AlertTriangle, CheckCircle } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Point | Login" },
    {
      name: "description",
      content: "Primakara Developers Point System",
    },
  ];
};

export async function loader({ request }: ActionFunctionArgs) {
  try {
    const user = await getUser(request);

    if (user) {
      return redirect(user.auth.role === "admin" ? "/admin" : "/dashboard");
    }

    return new Response("Logout", { status: 401 });
  } catch (error) {
    redirect("/");
    return new Response("Invalid session", { status: 401 });
  }
}

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
      return { registerFieldErrors: registerProcess.error.flatten() };
    }

    await register(
      {
        name: payload?.name,
        email: payload?.email,
        password: payload?.password,
      } as AuthPayload,
      "member"
    );

    return { registerMessage: "Register Success" };
  }

  if (intent === "login") {
    const loginProcessSchema = z.object({
      email: z.string().nonempty().email(),
      password: z.string().min(6),
    });

    const loginFormValidation = loginProcessSchema.safeParse(
      Object.fromEntries(formData)
    );

    if (!loginFormValidation.success) {
      return { loginFieldErrors: loginFormValidation.error.flatten() };
    }

    let token: string | any;

    try {
      token = await login({
        email: payload?.email,
        password: payload?.password,
      } as AuthPayload);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password" ||
          error.code === "auth/invalid-login-credentials"
        ) {
          return { loginError: "Incorrect username or password" };
        }
      }
    }

    if (typeof token !== "string") {
      throw new Response("Invalid data", { status: 400 });
    }

    try {
      // Only process if the user just signed in in the last 5 minutes.
      const decodedToken = await authAdmin.verifyIdToken(token);
      if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
        await authAdmin.revokeRefreshTokens(decodedToken.sub);
        throw new Response("Recent sign in required!", { status: 401 });
      }

      return await createUserSession({
        request,
        token,
        remember: true,
        redirectTo: decodedToken.role === "admin" ? "/admin" : "/dashboard",
      });
    } catch (error) {
      throw new Response("Token invalid!", { status: 401 });
    }
  }

  throw json({ message: "Invalid intent" }, { status: 400 });
}

export default function PageAuth() {
  const navigation = useNavigation();

  const actionData = useActionData() as any;

  const registerMessage = actionData?.registerMessage;
  const loginError = actionData?.loginError;
  const loginFieldErrors = actionData?.loginErrors?.fieldErrors;
  const registerFieldErrors = actionData?.registerErrors?.fieldErrors;

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
                    {loginError && (
                      <div className="bg-red-500 flex items-center justify-center py-2 rounded-lg text-white w-full">
                        <AlertTriangle className="mr-2" /> {loginError}
                      </div>
                    )}

                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        required
                        type="email"
                        placeholder="jokosatoru@mail.com"
                      />

                      {loginFieldErrors?.email && (
                        <span className="ml-1 text-red-500 text-sm">
                          {loginFieldErrors?.email[0]}
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

                      {loginFieldErrors?.password && (
                        <span className="ml-1 text-red-500 text-sm">
                          {loginFieldErrors?.password[0]}
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
                    {registerMessage && (
                      <div className="bg-green-500 flex items-center justify-center py-2 rounded-lg text-white w-full">
                        <CheckCircle className="mr-2" /> {registerMessage}
                      </div>
                    )}

                    <div className="space-y-1">
                      <Label htmlFor="name">Username</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder="Joko Satoru"
                      />

                      {registerFieldErrors?.name && (
                        <span className="ml-1 text-red-500 text-sm">
                          {registerFieldErrors?.name[0]}
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

                      {registerFieldErrors?.email && (
                        <span className="ml-1 text-red-500 text-sm">
                          {registerFieldErrors?.email[0]}
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

                      {registerFieldErrors?.password && (
                        <span className="ml-1 text-red-500 text-sm">
                          {registerFieldErrors?.password[0]}
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
