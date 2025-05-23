import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useLoaderData, useParams, useRouteLoaderData } from "react-router";
import { queryLogin } from "@/util/query-utils/query-login";
import { decryptAES } from "@/util/crypt-utils/cryptography";
import React, { useEffect } from "react";

type Folder = {
  id: number;
  name: string;
};

const LoginFormInputs: React.FC<{
  isEditable: boolean;
  setValid: (valid: boolean) => void;
}> = (props) => {
  const id = useParams().loginId;
  const { data } = useQuery({
    queryKey: ["individualLogin", id],
    queryFn: ({ signal }) => queryLogin(id!, signal),
    initialData: useLoaderData(),
    enabled: !!id,
  });
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (
      (document.getElementById("password") as HTMLInputElement).value &&
      (document.getElementById("name") as HTMLInputElement).value &&
      (document.getElementById("username") as HTMLInputElement).value &&
      (document.getElementById("Url") as HTMLInputElement).value
    ) {
      props.setValid(true);
    }
  }
  const individualLogin = data?.individualLogin;
  const folders: Folder[] = useRouteLoaderData("data") || [];
  const selectedFolder = individualLogin?.folder_id;
  useEffect(() => {
    const decryptPass = async () => {
      const password = await decryptAES(
        individualLogin?.login_password,
        individualLogin?.iv
      );
      (document.getElementById("password") as HTMLInputElement).value =
        password;
    };
    if (id) {
      decryptPass();
    }
  }, []);
  return (
    <div className="grid gap-4 py-4">
      <div
        className="grid grid-cols-4 items-center gap-4"
        onChange={handleChange}
      >
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
        />
      </div>
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
                  .find((folder) => folder.name === "No folder")
                  ?.id.toString()
          }
          disabled={!props.isEditable}
        >
          <SelectTrigger className="w-[295px]">
            <SelectValue placeholder="Select a folder" />
          </SelectTrigger>
          <SelectContent>
            {folders.map((folder: Folder) => (
              <SelectItem value={folder.id.toString()} key={folder.id}>
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
