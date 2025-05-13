import { useRef, useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { mutateNote } from "@/util/mutate-utils/mutate-note";
import { queryClient } from "@/util/query-utils/query-client";

function UserNote({
  text,
  id,
  whenEditingFinished: onEditFinished,
}: {
  text: string;
  id?: number;
  whenEditingFinished?: () => void;
}) {
  const [focused, setFocused] = useState(!!onEditFinished);
  const textValue = useRef<HTMLTextAreaElement>(null);
  const { mutate } = useMutation({
    mutationFn: mutateNote,
    onSuccess: () => {
      onEditFinished?.();
      },
    onSettled: () => queryClient.invalidateQueries({queryKey: ["notes"]})
  });
  function handleClick() {
    setFocused(true);
  }
  function handleBlur() {
    mutate({ text: textValue.current?.value!, id });
    setFocused(false);
  }
    function handleDelete() {
    mutate({ text: "", id });
  }
  const textArea = (
    <Textarea
      defaultValue={text}
      onBlur={handleBlur}
      autoFocus
      className="-m-2 p-3 h-52 border-0"
      ref={textValue}
    />
  );
  return (
    <Card onClick={handleClick} className="w-64 h-64 cursor-pointer">
      <CardTitle className="flex justify-end -mt-4 mr-2">
        <div
          className="hover:bg-slate-100 w-6 h-6 rounded-full text-center text-sm"
          onClick={handleDelete}
        >
          X
        </div>
      </CardTitle>
      <CardContent className="text-sm -mt-7">
        {focused ? (
          textArea
        ) : (
          <ScrollArea className="p-1 h-52">{text}</ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export default UserNote;
