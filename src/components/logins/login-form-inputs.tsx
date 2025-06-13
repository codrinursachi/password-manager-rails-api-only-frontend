import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useParams } from "react-router";
import { queryLogin } from "@/util/query-utils/query-login";
import { decryptAES } from "@/util/crypt-utils/cryptography";
import React, { useEffect } from "react";
import PasswordGeneratorDialog from "./password-generator-dialog";
import { queryFolders } from "@/util/query-utils/query-folders";

type Folder = {
    id: number;
    name: string;
};

const LoginFormInputs: React.FC<{
    isEditable: boolean;
    setValid: (valid: boolean) => void;
}> = (props) => {
    const id = useParams().loginId;
    const nameRef = React.useRef<HTMLInputElement>(null);
    const usernameRef = React.useRef<HTMLInputElement>(null);
    const urlRef = React.useRef<HTMLInputElement>(null);
    const [password, setPassword] = React.useState("");
    function changePassword(password: string) {
        setPassword(password);
    }
    const { data } = useQuery({
        queryKey: ["individualLogin", id],
        queryFn: ({ signal }) => queryLogin(id!, signal),
        enabled: !!id,
    });
    function handleChange() {
        if (
            password &&
            nameRef.current!.value &&
            usernameRef.current!.value &&
            urlRef.current!.value
        ) {
            props.setValid(true);
        } else {
            props.setValid(false);
        }
    }
    const individualLogin = data?.individualLogin;
    const { data: folders } = useQuery({
        queryKey: ["folders"],
        queryFn: ({ signal }) => queryFolders(signal),
    });
    const selectedFolder = individualLogin?.folder_id;
    useEffect(() => {
        const decryptPass = async () => {
            const password = await decryptAES(
                individualLogin?.login_password,
                individualLogin?.iv
            );
            setPassword(password);
        };
        if (id && individualLogin) {
            decryptPass();
        }
    }, []);
    return (
        <div className="grid gap-4 py-4" onChange={handleChange}>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Name
                </Label>
                <Input
                    id="name"
                    className="col-span-3"
                    name="login[name]"
                    defaultValue={individualLogin?.name}
                    readOnly={!props.isEditable}
                    required
                    ref={nameRef}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                    Username
                </Label>
                <Input
                    id="username"
                    className="col-span-3"
                    name="login[login_name]"
                    defaultValue={individualLogin?.login_name}
                    readOnly={!props.isEditable}
                    required
                    ref={usernameRef}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                    Password
                </Label>
                <Input
                    id="password"
                    type="password"
                    className="col-span-3"
                    name="login[login_password]"
                    readOnly={!props.isEditable}
                    required
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
            </div>
            <PasswordGeneratorDialog setLoginPassword={changePassword} />
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Url" className="text-right">
                    Url
                </Label>
                <Input
                    type="hidden"
                    name="login[urls_attributes][0][id]"
                    value={individualLogin?.urls[0]?.id}
                />
                <Input
                    id="Url"
                    className="col-span-3"
                    name="login[urls_attributes][0][uri]"
                    defaultValue={individualLogin?.urls[0]?.uri}
                    readOnly={!props.isEditable}
                    required
                    ref={urlRef}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                    Notes
                </Label>
                <Textarea
                    id="notes"
                    className="col-span-3"
                    name="login[notes]"
                    defaultValue={individualLogin?.notes}
                    readOnly={!props.isEditable}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="custom-field-name" className="text-left">
                    Custom field name
                </Label>
                <Input
                    id="custom-field-name"
                    className="col-span-3"
                    name="login[custom_fields_attributes][0][name]"
                    defaultValue={individualLogin?.custom_fields[0]?.name}
                    readOnly={!props.isEditable}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="custom-field-value" className="text-left">
                    Custom field value
                </Label>
                <Input
                    type="hidden"
                    name="login[custom_fields_attributes][0][id]"
                    value={individualLogin?.custom_fields[0]?.id}
                />
                <Input
                    id="custom-field-value"
                    className="col-span-3"
                    name="login[custom_fields_attributes][0][value]"
                    defaultValue={individualLogin?.custom_fields[0]?.value}
                    readOnly={!props.isEditable}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fav-check" className="text-right">
                    Favorite
                </Label>
                <Checkbox
                    id="fav-check"
                    className="col-span-3"
                    name="login[is_favorite]"
                    defaultChecked={individualLogin?.is_favorite}
                    disabled={!props.isEditable}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Folder</Label>
                <Select
                    name="login[folder_id]"
                    defaultValue={
                        selectedFolder
                            ? selectedFolder.toString()
                            : folders
                                  .find(
                                      (folder: Folder) =>
                                          folder.name === "No folder"
                                  )
                                  ?.id.toString()
                    }
                    disabled={!props.isEditable}
                >
                    <SelectTrigger className="w-[295px]">
                        <SelectValue placeholder="Select a folder" />
                    </SelectTrigger>
                    <SelectContent>
                        {folders.map((folder: Folder) => (
                            <SelectItem
                                value={folder.id.toString()}
                                key={folder.id}
                            >
                                {folder.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file">File</Label>
                <Input
                    id="file"
                    type="file"
                    className="w-[295px]"
                    name="login[file]"
                    disabled={!props.isEditable}
                />
            </div>
        </div>
    );
};
export default LoginFormInputs;
