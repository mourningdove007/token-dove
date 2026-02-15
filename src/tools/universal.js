
import { BrowserSDK, AddressType } from "@phantom/browser-sdk";

export const phantomId = import.meta.env.VITE_PHANTOM_PROJECT_ID;
export const redirectUrl = import.meta.env.VITE_REDIRECT;
export const rpcUrl = import.meta.env.VITE_RPC_URL;


if (!phantomId) {
    throw new Error(
        "Missing Phantom Project ID. Please set VITE_PHANTOM_PROJECT_ID in your .env file."
    );
}
if (!redirectUrl) {
    throw new Error(
        "Missing Phantom Redirect URL. Please set VITE_REDIRECT in your .env file."
    );
}
if (!rpcUrl) {
    throw new Error(
        "Missing RPC URL. Please set RPC_URL in the .env file."
    );
}
export const BROWSERSDK = new BrowserSDK({
  providers: ["apple", "google"], 
  addressTypes: [AddressType.solana, AddressType.ethereum],
  authOptions: {
    redirectUrl: redirectUrl,
  },
  appId: phantomId, 
});
