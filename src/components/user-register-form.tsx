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
import { useActionState, useEffect } from "react";

async function signupAction(prevState, formData) {
  //await new Promise((resolve) => setTimeout(resolve, 5000));
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
                  defaultValue={formState.enteredValues?.email}
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
                  defaultValue={formState.enteredValues?.name}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  name="password"
                  defaultValue={formState.enteredValues?.password}
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
                  defaultValue={formState.enteredValues?.passwordConfirmation}
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
