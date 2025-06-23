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
import { useEffect, useRef, useState } from "react";
import startRegistration from "@/util/passkey-util/passkey-registration";
import { Alert, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { mutateUserRegistration } from "@/util/mutate-utils/mutate-user-registration";

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [registerWithPassword, setRegisterWithPassword] = useState(false);
    const email = useRef<HTMLInputElement>(null);
    const name = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const registrationMutation = useMutation({
        mutationFn: async (event: React.FormEvent<HTMLFormElement> | null) => {
            if (!event) {
                await startRegistration(email.current!.value, name.current!.value);
                return;
            }
            event.preventDefault();
            await mutateUserRegistration(
                new FormData(event.target as HTMLFormElement)
            );
        },
    });
    useEffect(() => {
        if (registrationMutation.error) {
            setRegisterWithPassword(false);
        }
    }, [registrationMutation.error]);
    useEffect(() => {
        if (registrationMutation.isSuccess) {
            registrationMutation.reset();
            navigate("/");
        }
    }, [registrationMutation.isSuccess]);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Register an account</CardTitle>
                    <CardDescription>
                        Enter your{" "}
                        {!registerWithPassword ? "email" : "password"} below to
                        register an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={registrationMutation.mutate}>
                        <div className="flex flex-col gap-6">
                            <div
                                className={
                                    "flex flex-col gap-6" +
                                    (registerWithPassword ? " hidden" : "")
                                }
                            >
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        name="email"
                                        ref={email}
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
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={()=>registrationMutation.mutate(null)}
                                    className="w-full"
                                >
                                    Register with passkey
                                </Button>
                            </div>
                            <div
                                className={
                                    "flex flex-col gap-6" +
                                    (registerWithPassword ? "" : " hidden")
                                }
                            >
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        name="password"
                                        minLength={6}
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
                                        minLength={6}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={registrationMutation.isPending}
                                >
                                    Register
                                </Button>
                            </div>
                            <Button
                                type="button"
                                className={
                                    "w-full" +
                                    (registerWithPassword ? " hidden" : "")
                                }
                                onClick={() =>
                                    email.current?.reportValidity() &&
                                    name.current?.reportValidity() &&
                                    setRegisterWithPassword(true)
                                }
                            >
                                Register with password
                            </Button>
                            {registrationMutation.error && (
                                <Alert variant="destructive">
                                    <AlertCircleIcon />
                                    <AlertTitle>
                                        {registrationMutation.error.message}
                                    </AlertTitle>
                                </Alert>
                            )}
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="underline underline-offset-4"
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
