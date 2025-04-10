import { getAuthToken } from "@/util/auth";
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
import { useActionState } from "react";
import { DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { useRouteLoaderData } from "react-router";

const LoginForm = () => {
  const folders = useRouteLoaderData("data");
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input id="name" className="col-span-3" name="login[name]" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="username" className="text-right">
          Username
        </Label>
        <Input id="username" className="col-span-3" name="login[login_name]" />
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
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="Url" className="text-right">
          Url
        </Label>
        <Input
          id="Url"
          className="col-span-3"
          name="login[urls_attributes][0][uri]"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notes" className="text-right">
          Notes
        </Label>
        <Textarea id="notes" className="col-span-3" name="login[notes]" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="custom-field-name" className="text-left">
          Custom field name
        </Label>
        <Input
          id="custom-field-name"
          className="col-span-3"
          name="login[custom_fields_attributes][0][name]"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="custom-field-calue" className="text-left">
          Custom field value
        </Label>
        <Input
          id="custom-field-value"
          className="col-span-3"
          name="login[custom_fields_attributes][0][value]"
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
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Folder</Label>
        <Select name="login[folder_id]">
          <SelectTrigger className="w-[295px]">
            <SelectValue placeholder="Select a folder" />
          </SelectTrigger>
          <SelectContent>
            {folders.map((folder) => (
              <SelectItem value={folder.id}>{folder.name}</SelectItem>
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
export default LoginForm;
