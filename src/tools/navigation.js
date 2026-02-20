import { push } from "svelte-spa-router";
import { BROWSERSDK } from "./authorization";

export const signOut = async () => {
    await BROWSERSDK.disconnect();
    push("/");
};

export const goToLedger = async () => {
    await push("/ledger");
};
