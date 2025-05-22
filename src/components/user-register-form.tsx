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
import { Link, useNavigate } from "react-router";
import { useActionState, useEffect, useRef } from "react";
import { generateSalt } from "@/util/crypt-utils/generate-salt";
import { generateAESKey } from "@/util/crypt-utils/generate-aes-key";
import { keyStore } from "@/util/crypt-utils/key-store";
import { generateBase64RSAPair } from "@/util/crypt-utils/generate-base64-rsa";
import { encryptAES } from "@/util/crypt-utils/cryptography";
import { getPrivateKeyFromBase64 } from "@/util/crypt-utils/get-private-rsa-key-from-base64";
import startRegistration from "@/util/passkey-util/passkey-registration";

async function signupAction(_prevState: unknown, formData: FormData) {
  const email = formData.get("email");
  const name = formData.get("name");
  const password = formData.get("password");
  const passwordConfirmation = formData.get("password-confirmation");
  if (password !== passwordConfirmation) {
    return {
      error: "Passwords do not match",
      enteredValues: { email, password, passwordConfirmation, name },
    };
  }
  if (!email || !password || !name) {
    return {
      error: "Please fill in all fields",
      enteredValues: { email, password, passwordConfirmation, name },
    };
  }
  const salt = generateSalt();
  keyStore.key = await generateAESKey(password.toString(), salt);
  const { publicKey, privateKey } = await generateBase64RSAPair();
  keyStore.privateKey = await getPrivateKeyFromBase64(privateKey);
  const encryptedPrivateKeyWithIv = await encryptAES(privateKey);
  const response = await fetch("http://127.0.0.1:3000/api/v1/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      user: {
        email,
        password,
        password_confirmation: passwordConfirmation,
        name,
        salt,
        rsa_attributes: {
          public_key: publicKey,
          private_key: encryptedPrivateKeyWithIv.encryptedData,
          private_key_iv: encryptedPrivateKeyWithIv.iv,
        },
      },
    }),
  });
  if (!response.ok) {
    return {
      error: "Email already taken",
      enteredValues: { email, password, passwordConfirmation, name },
    };
  }
  const data = response.headers.get("Authorization");
  if (data) {
    localStorage.setItem("token", data);
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 30);
    localStorage.setItem("expiration", expiration.toString());
    localStorage.setItem("salt", salt);
    window.addEventListener("beforeunload", () => localStorage.clear());
  }
  return { error: null };
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formState, formAction, pending] = useActionState(signupAction, {
    error: null,
  });
  const email = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);
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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Register an account</CardTitle>
          <CardDescription>
            Enter your email below to register an account
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
                  placeholder="m@example.com"
                  required
                  name="email"
                  ref={email}
                  defaultValue={formState.enteredValues?.email?.toString()}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="name">Name</Label>
                </div>
                <Input
                  id="name"
                  type="text"
                  required
                  name="name"
                  ref={name}
                  defaultValue={formState.enteredValues?.name?.toString()}
                />
              </div>
              <Button
                type="button"
                onClick={async () => {
                  await startRegistration(
                    email.current!.value,
                    name.current!.value
                  ) && navigate("/");
                }}
                className="w-full"
              >
                Register with passkey
              </Button>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  name="password"
                  defaultValue={formState.enteredValues?.password?.toString()}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password-confirmation">
                    Password confirmation
                  </Label>
                </div>
                <Input
                  id="password-confirmation"
                  type="password"
                  required
                  name="password-confirmation"
                  defaultValue={formState.enteredValues?.passwordConfirmation?.toString()}
                />
              </div>
              <Button type="submit" className="w-full" disabled={pending}>
                Register
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
