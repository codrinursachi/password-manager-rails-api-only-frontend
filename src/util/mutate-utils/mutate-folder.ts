import { networkFetch } from "@/util/network-utils/network-fetch";

export async function mutateFolder(
    formData: FormData | null,
    folderId: string | null,
    method: "POST" | "PATCH" | "DELETE"
) {
    await networkFetch(
        "folders/" + (folderId ?? ""),
        undefined,
        method,
        formData
    );
}
