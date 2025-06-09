import NotesDialog from "@/components/notes/notes-dialog";
import NotesTable from "@/components/notes/notes-table";
import { Button } from "@/components/ui/button";
import { encryptAES } from "@/util/crypt-utils/cryptography";
import { networkFetch } from "@/util/network-utils/network-fetch";
import { queryClient } from "@/util/query-utils/query-client";
import { queryNotes } from "@/util/query-utils/query-notes";
import { useQuery } from "@tanstack/react-query";
import { redirect, useNavigate } from "react-router";

function NotesPage() {
    const navigate = useNavigate();
    const { data, isLoading } = useQuery({
        queryKey: ["notes"],
        queryFn: ({ signal }) => queryNotes(signal),
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
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

export async function action({
    request,
    params,
}: {
    request: Request;
    params: { noteId?: string };
}) {
    const keyId = params.noteId;
    const method = request.method.toUpperCase();
    const formData = await request.formData();
    if (method !== "DELETE") {
        const [encryptedNoteName, encryptedNoteText] = await Promise.all([
            encryptAES(formData.get("note[name]")?.toString()!),
            encryptAES(formData.get("note[text]")?.toString()!),
        ]);
        formData.set("note[name]", encryptedNoteName.encryptedData);
        formData.set("note[name_iv]", encryptedNoteName.iv);
        formData.set("note[text]", encryptedNoteText.encryptedData);
        formData.set("note[iv]", encryptedNoteText.iv);
    }
    await networkFetch(
        "notes/" + (keyId ? keyId : ""),
        undefined,
        method,
        formData
    );
    queryClient.invalidateQueries({ queryKey: ["notes"] });
    return redirect("/notes");
}

export default NotesPage;
