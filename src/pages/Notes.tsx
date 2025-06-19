import NotesDialog from "@/components/notes/notes-dialog";
import NotesTable from "@/components/notes/notes-table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

function NotesPage() {
    const navigate = useNavigate();
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
                <NotesTable />
            </div>
            <NotesDialog />
        </div>
    );
}

export default NotesPage;
