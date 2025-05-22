import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { generateAESKey } from "@/util/crypt-utils/generate-aes-key";
import { keyStore } from "@/util/crypt-utils/key-store";
import { decryptAES } from "@/util/crypt-utils/cryptography";
import { getPrivateKeyFromBase64 } from "@/util/crypt-utils/get-private-rsa-key-from-base64";
import startAuthentication from "@/util/passkey-util/passkey-authentication";

async function loginAction(_prevState: unknown, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const response = await fetch("http://127.0.0.1:3000/api/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      user: {
        email,
        password,
      },
    }),
  });
  if (!response.ok) {
    return {
      error: "Invalid email or password",
      enteredValues: { email, password },
    };
  }
  const data = response.headers.get("Authorization");
  if (data) {
    const json = await response.json();
    localStorage.setItem("token", data);
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 30);
    localStorage.setItem("expiration", expiration.toString());
    keyStore.key = await generateAESKey(password?.toString()!, json.salt);
    const decryptedBase64Key = await decryptAES(
      json.private_key,
      json.private_key_iv
    );
    keyStore.privateKey = await getPrivateKeyFromBase64(decryptedBase64Key);
    window.addEventListener("beforeunload", () => localStorage.clear());
  }
  return { error: null };
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formState, formAction, pending] = useActionState(loginAction, {
    error: null,
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (formState.error) {
      alert(formState.error);
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/");
      }
    }
  }, [formState]);

  const email = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  ref={email}
                  defaultValue={formState.enteredValues?.email?.toString()}
                />
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={async () => {
                  (await startAuthentication(email.current?.value!)) &&
                    navigate("/");
                }}
              >
                Login with passkey
              </Button>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  defaultValue={formState.enteredValues?.password?.toString()}
                />
              </div>
              <Button type="submit" className="w-full" disabled={pending}>
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
