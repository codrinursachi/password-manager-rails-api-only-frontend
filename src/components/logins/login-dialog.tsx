import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useLocation, useNavigate, useParams } from "react-router";
import LoginFormInputs from "./login-form-inputs";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { mutateLogin } from "@/util/mutate-utils/mutate-login";
import { queryClient } from "@/util/query-utils/query-client";
import { toast } from "sonner";

const LoginDialog = () => {
    const loginId = useParams().loginId;
    const isNew = useLocation().pathname.includes("new");
    const isEditable = useLocation().pathname.includes("edit");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [valid, setValid] = useState(false);
    const handleValid = (valid: boolean) => {
        setValid(valid);
    };
    useEffect(() => {
        setDialogOpen(!!loginId || isNew);
    }, [loginId, isNew]);
    const navigate = useNavigate();
    const loginMutation = useMutation({
        mutationKey: ["login", loginId ? "edit" : "add"],
        mutationFn: async (event: React.FormEvent<HTMLFormElement>) => {
            const formData = new FormData(event.target as HTMLFormElement);
            await mutateLogin(formData, loginId, loginId ? "PATCH" : "POST");
        },
        onError: (error: Error) => {
            toast.error(error.message, {
                description: "Failed to save login.",
                action: {
                    label: "Try again",
                    onClick: () =>
                        loginMutation.mutate(loginMutation.variables!),
                },
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["logins"] });
        },
    });
    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={(isOpen) => {
                setDialogOpen(isOpen);
                if (!isOpen) {
                    setTimeout(() => navigate(-1), 200);
                }
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {loginId ? (isEditable ? "Edit" : "View") : "Create"}{" "}
                        login
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="hidden">
                    Enter login values
                </DialogDescription>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (valid) {
                            navigate(-1);
                            loginMutation.mutate(e);
                        }
                    }}
                    encType="multipart/form-data"
                >
                    <LoginFormInputs
                        isEditable={isEditable || isNew}
                        setValid={handleValid}
                    />
                    <DialogFooter
                        className="sm:justify-start"
                        hidden={!isEditable && !isNew}
                    >
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <Button>Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LoginDialog;
