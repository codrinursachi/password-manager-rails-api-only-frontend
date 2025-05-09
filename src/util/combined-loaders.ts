import {
  individualLoginLoader,
  loader as loginsLoader,
} from "../pages/Logins";
import { checkAuthLoader } from "./auth.ts";
import { loader as foldersLoader } from "../pages/RootLayout";
import {
  loader as trashedLoginsLoader
} from "../pages/Trash";
import {
  loader as sharedLoginsLoader,
} from "../pages/SharedLogins";

const rootLoader = async () => {
  const authLoaderResult = checkAuthLoader();
  if (authLoaderResult instanceof Response) {
    return authLoaderResult;
  }
  const folders = await foldersLoader();
  return folders;
};

const combinedLoginsLoader = async ({
  params,
  request,
}: {
  params: { loginId?: string };
  request: Request;
}) => {
  const [allLogins, individualLogin] = await Promise.all([
    loginsLoader({ request }),
    individualLoginLoader({ params }),
  ]);

  return { ...allLogins, ...individualLogin };
};

const combinedSharedLoginsLoader = async ({
  params,
  request,
}: {
  params: { loginId?: string };
  request: Request;
}) => {
  const [sharedLogins, individualLogin] = await Promise.all([
    sharedLoginsLoader({ request }),
    individualLoginLoader({ params }),
  ]);

  return { ...sharedLogins, ...individualLogin };
};

const combinedTrashLoginsLoader = async ({
  params,
}: {
  params: { loginId?: string };
}) => {
  const [trashedLogins, individualLogin] = await Promise.all([
    trashedLoginsLoader(),
    individualLoginLoader({ params }),
  ]);

  return { ...trashedLogins, ...individualLogin };
};

export {
  rootLoader,
  combinedLoginsLoader,
  combinedSharedLoginsLoader,
  combinedTrashLoginsLoader,
};
