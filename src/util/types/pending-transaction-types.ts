export type Login = {
    id: number | null;
    name: string;
    login_name: string;
    url: string;
    favorite: boolean;
    folder_id: number | null;
    shared_with: string | null;
    action: "add" | "edit" | "trash" | "delete" | "share" | "unshare";
    settled: () => boolean;
};

export type Note = {
    name: string;
    action: "add" | "edit" | "delete";
    settled: () => boolean;
};

export type SSHKey = {
    name: string;
    action: "add" | "edit" | "delete";
    settled: () => boolean;
};

export type Folder = {
    id: number | null;
    name: string;
    action: "add" | "edit" | "delete";
    settled: () => boolean;
};
