import { ThirdwebSDK } from "@3rdweb/sdk";
import ethers from "ethers";

//Importing and configuring our .env file that we use to securely store our environment variables
import dotenv from "dotenv";
dotenv.config();

// Some quick checks to make sure our .env is working.
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
  console.log("🛑 Private key no-found sadness.")
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL == "") {
  console.log("🛑 Alchemy API URL no-found sadness.")
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
  console.log("🛑 Wallet Address no-found sadness.")
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    // Your wallet private key. ALWAYS KEEP THIS PRIVATE, DO NOT SHARE IT WITH ANYONE, add it to your .env file and do not commit that file to github!
    process.env.PRIVATE_KEY,
    // RPC URL, we'll use our Alchemy API URL from our .env file.
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
  ),
);

(async () => {
  try {
    const apps = await sdk.getApps();
    console.log("Your app addy is:", apps[0].address);
  } catch (err) {
    console.error("FAILZ gettin apps from the sdk", err);
    process.exit(1);
  }
})()

// We are exporting the initialized thirdweb SDK so that we can use it in our other scripts
export default sdk;
