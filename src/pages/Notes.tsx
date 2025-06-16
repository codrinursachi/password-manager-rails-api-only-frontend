import NotesDialog from "@/components/notes/notes-dialog";
import NotesTable from "@/components/notes/notes-table";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/util/query-utils/query-client";
import { queryNotes } from "@/util/query-utils/query-notes";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

function NotesPage() {
    const navigate = useNavigate();
    const { data, error } = useQuery({
        queryKey: ["notes"],
        queryFn: ({ signal }) => queryNotes(signal),
    });
    useEffect(() => {
        if (error) {
            toast.error(error.message, {
                description: "Failed to load notes.",
                action: {
                    label: "Retry",
                    onClick: () =>
                        queryClient.invalidateQueries({ queryKey: ["notes"] }),
                },
            });
        }
    }, [error]);
    return (
        <div className="flex flex-col gap-4">
            <h1>Notes</h1>
            <Button
                variant="outline"
                className="w-46"
                onClick={() => navigate("/notes/new")}
            >
                Create note
            </Button>
            <div className="flex flex-wrap gap-4">
                <NotesTable notes={data?.notes!} />
            </div>
            <NotesDialog />
        </div>
    );
}

export default NotesPage;
