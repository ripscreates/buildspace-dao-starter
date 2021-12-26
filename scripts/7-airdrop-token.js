import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// This is the address to our ERC-1155 membership NFT contract.
const bundleDropModule = sdk.getBundleDropModule(
  "0x585a56fCa6e4C9630A7b7d09D27f949C7Ca3aA52",
);

// This is the address to our ERC-20 token contract.
const tokenModule = sdk.getTokenModule(
  "0x2c936E0a34BEffc271457685AB12102097964307",
);

(async () => {
  try {
    // Grab all the addresses of people who own our membership NFT, which has 
    // a tokenId of 0.
    const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");
  
    if (walletAddresses.length === 0) {
      console.log(
        "😦 No NFTs claimed yet, ask yer derp friends to claim free NFTs!",
      );
      process.exit(0);
    }
    
    // Loop through the array of addresses.
    const airdropTargets = walletAddresses.map((address) => {
      // Pick a random # between 1000 and 10000.
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
      console.log("✅ ✈️ Airdroppin ", randomAmount, "tokens to", address);
      
      // Set up the target.
      const airdropTarget = {
        address,
        // Remember, we need 18 decimal placees!
        amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
      };
  
      return airdropTarget;
    });
    
    // Call transferBatch on all our airdrop targets.
    console.log("🌈✈️ Starting airdrop...")
    await tokenModule.transferBatch(airdropTargets);
    console.log("✨😜 WOO! We Successfully airdropped $derpz to all NFT memberz!");
  } catch (err) {
    console.error("❌ FAILZ airdrop 😭 ", err);
  }
})();
