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
            console.log("Submitting login form");
            let formData: FormData;
            try {
                formData = new FormData(event.target as HTMLFormElement);
                
            }
            catch (error) {
                console.error("Error submitting login form:", error);
                return;
            }
            console.log("Form data:", formData);
            mutateLogin(formData, loginId, loginId ? "PATCH" : "POST");
            setDialogOpen(false);
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
