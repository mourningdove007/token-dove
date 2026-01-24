
import { BrowserSDK, AddressType } from "@phantom/browser-sdk";

export const BROWSERSDK = new BrowserSDK({
  providers: ["apple", "google", "deeplink"], 
  addressTypes: [AddressType.solana, AddressType.ethereum],
  authOptions: {
    redirectUrl: "https://tokendove.com/#/home",
  },
  appId: "6f372dd1-51cb-4cc0-a989-9d89b83b6114", 
});