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
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import startAuthentication from "@/util/passkey-util/passkey-authentication";
import { Alert, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { mutateUserLogin } from "@/util/mutate-utils/mutate-user-login";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const email = useRef<HTMLInputElement>(null);
    const [loginWithPassword, setLoginWithPassword] = useState(false);
    const navigate = useNavigate();
    const loginMutation = useMutation({
        mutationFn: async (event: React.FormEvent<HTMLFormElement> | null) => {
            if (!event) {
                await startAuthentication(email.current?.value!);
                return;
            }

            event.preventDefault();
            await mutateUserLogin(
                new FormData(event.target as HTMLFormElement)
            );
        },
    });
    useEffect(() => {
        if (loginMutation.error) {
            setLoginWithPassword(false);
        }
    }, [loginMutation.error]);
    if (loginMutation.isSuccess) {
        loginMutation.reset();
        navigate("/");
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your {loginWithPassword ? "password" : "email"}{" "}
                        below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={loginMutation.mutate}>
                        <div className="flex flex-col gap-6">
                            <div
                                className={
                                    "grid gap-3" +
                                    (loginWithPassword ? " hidden" : "")
                                }
                            >
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                    ref={email}
                                />
                            </div>
                            <Button
                                type="button"
                                className={
                                    "w-full" +
                                    (loginWithPassword ? " hidden" : "")
                                }
                                onClick={() => loginMutation.mutate(null)}
                            >
                                Login with passkey
                            </Button>
                            <div
                                className={
                                    "grid gap-3" +
                                    (!loginWithPassword ? " hidden" : "")
                                }
                            >
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <Button
                                type="button"
                                className={
                                    "w-full" +
                                    (loginWithPassword ? " hidden" : "")
                                }
                                onClick={() =>
                                    email.current?.reportValidity() &&
                                    setLoginWithPassword(true)
                                }
                            >
                                Login with password
                            </Button>
                            <Button
                                type="submit"
                                className={
                                    "w-full" +
                                    (!loginWithPassword ? " hidden" : "")
                                }
                                disabled={loginMutation.isPending}
                            >
                                Login
                            </Button>
                            {loginMutation.error && (
                                <Alert variant="destructive">
                                    <AlertCircleIcon />
                                    <AlertTitle>
                                        {loginMutation.error.message}
                                    </AlertTitle>
                                </Alert>
                            )}
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link
                                to="/register"
                                className="underline underline-offset-4"
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
