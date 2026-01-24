
import { BrowserSDK, AddressType } from "@phantom/browser-sdk";

export const BROWSERSDK = new BrowserSDK({
  providers: ["apple", "google", "deeplink"], // Allowed auth providers
  addressTypes: [AddressType.solana, AddressType.ethereum],
  appId: "6f372dd1-51cb-4cc0-a989-9d89b83b6114", // Required when using embedded providers
});