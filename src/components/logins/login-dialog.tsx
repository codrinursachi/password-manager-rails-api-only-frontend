import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useLocation, useNavigate, useParams } from "react-router";
import LoginFormInputs from "./login-form-inputs";
import { useEffect, useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
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
        setDialogOpen(loginId !== undefined || isNew);
    }, [loginId, isNew]);
    const navigate = useNavigate();
    const loginMutation = useMutation({
        mutationFn: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!valid) {
                return;
            }
            const formData = new FormData(event.target as HTMLFormElement);
            dialogOpen && navigate(-1);
            await mutateLogin(formData, loginId, loginId ? "PATCH" : "POST");
        },
        onError: (error: Error) => {
            console.error("Error saving login:", error);
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
                    onSubmit={loginMutation.mutate}
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
