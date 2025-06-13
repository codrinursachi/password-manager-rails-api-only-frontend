import {
    decryptAES,
    encryptRSAPassword as encryptRSAPassword,
} from "@/util/crypt-utils/cryptography";
import { networkFetch } from "@/util/network-utils/network-fetch";
import { queryClient } from "@/util/query-utils/query-client";
import { queryLogin } from "@/util/query-utils/query-login";

export async function mutateSharedLogin(
    formData: FormData,
    loginId: string | null
) {
    if (!formData.has("shared_login_datum[email]")) {
        await networkFetch("shared_login_data/" + loginId, null, "DELETE");
        return;
    }
    formData.set(
        "shared_login_datum[login_id]",
        loginId!
    );
    const publicKeyRequest = await networkFetch(
        "shared_login_data/new?email=" +
            formData.get("shared_login_datum[email]")
    );

    if (publicKeyRequest.error) {
        throw new Error(publicKeyRequest.error);
    }

    const publicKey = publicKeyRequest.public_key;
    const { individualLogin } = await queryClient.fetchQuery({
        queryKey: [
            "individualLogin",
            loginId,
        ],
        queryFn: ({ signal }) =>
            queryLogin(
                loginId!,
                signal
            ),
    });
    const plaintextPassword = await decryptAES(
        individualLogin.login_password,
        individualLogin.iv
    );
    const password = await encryptRSAPassword(plaintextPassword, publicKey);
    formData.set("shared_login_datum[password]", password);
    const sharedLoginResponse = await networkFetch(
        "shared_login_data",
        null,
        "POST",
        formData
    );
    if (sharedLoginResponse.error) {
        throw new Error(sharedLoginResponse.error);
    }

    queryClient.invalidateQueries({ queryKey: ["sharedLogins"] });
}
