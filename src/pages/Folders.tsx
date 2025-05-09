import { networkFetch } from "@/util/network-utils/network-fetch";
import { queryClient } from "@/util/query-utils/query-client";
import { redirect } from "react-router";

export async function action({
  request,
  params,
}: {
  request: Request;
  params: { folderId?: number };
}) {
  const method = request.method.toUpperCase();
  const folderId = params.folderId;
  await networkFetch("folders/" + (folderId ? folderId : ""), undefined, method, await request.formData());
  queryClient.invalidateQueries({queryKey: ["folders"]});
  return redirect("/logins");
}
