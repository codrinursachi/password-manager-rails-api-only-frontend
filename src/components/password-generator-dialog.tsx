import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import passwordGenerator from "@/util/password-generator";

function PasswordGeneratorDialog({setLoginPassword}) {
  const numbersRef = useRef<HTMLInputElement>(null);
  const lettersRef = useRef<HTMLInputElement>(null);
  const specialCharsRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  useEffect(() => {
    setPassword(
      passwordGenerator(6,6,6)
    );
  }, []);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Password generator</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Password Generator</DialogTitle>
          <DialogDescription>Generate a secure password</DialogDescription>
        </DialogHeader>
        <Input readOnly value={password}></Input>
        Options:
        <Label>Numbers:</Label>
        <Input
          type="number"
          defaultValue={6}
          min={1}
          max={64}
          ref={numbersRef}
        />
        <Label>Letters:</Label>
        <Input
          type="number"
          defaultValue={6}
          min={1}
          max={64}
          ref={lettersRef}
        />
        <Label>Special characters:</Label>
        <Input
          type="number"
          defaultValue={6}
          min={1}
          max={64}
          ref={specialCharsRef}
        />
        <Button
          type="button"
          onClick={() =>
            setPassword(
              passwordGenerator(
                numbersRef.current!.value,
                lettersRef.current!.value,
                specialCharsRef.current!.value
              )
            )
          }
        >
          Generate
        </Button>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={()=>setLoginPassword(password)}>Use password</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PasswordGeneratorDialog;
