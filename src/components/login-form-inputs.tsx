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
import { useLoaderData, useRouteLoaderData } from "react-router";

const LoginFormInputs = () => {
  const individualLogin = useLoaderData().individualLogin;
  const folders: { id: string; name: string }[] = useRouteLoaderData("data") || [];
  const selectedFolder = individualLogin?.folder_id;
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          className="col-span-3"
          name="login[name]"
          defaultValue={individualLogin?.name}
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
          defaultValue={individualLogin?.login_password}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="Url" className="text-right">
          Url
        </Label>
        <Input type="hidden" name="login[urls_attributes][0][id]" value={individualLogin?.urls[0]?.id} />
        <Input
          id="Url"
          className="col-span-3"
          name="login[urls_attributes][0][uri]"
          defaultValue={individualLogin?.urls[0]?.uri}
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
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="custom-field-value" className="text-left">
          Custom field value
        </Label>
        <Input type="hidden" name="login[custom_fields_attributes][0][id]" value={individualLogin?.custom_fields[0]?.id} />
        <Input
          id="custom-field-value"
          className="col-span-3"
          name="login[custom_fields_attributes][0][value]"
          defaultValue={individualLogin?.custom_fields[0]?.value}
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
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Folder</Label>
        <Select
          name="login[folder_id]"
          defaultValue={
            selectedFolder
              ? selectedFolder
              : folders.find((folder) => folder.name === "No folder")?.id
          }
        >
          <SelectTrigger className="w-[295px]">
            <SelectValue placeholder="Select a folder" />
          </SelectTrigger>
          <SelectContent>
            {folders.map((folder: { id: string; name: string }) => (
              <SelectItem value={folder.id}>
                {folder.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="file">File</Label>
        <Input id="file" type="file" className="w-[295px]" name="login[file]" />
      </div>
    </div>
  );
};
export default LoginFormInputs;
