import sdk from "./1-initialize-sdk.js";

// In order to deploy the new contract we need our old friend the app module again.
const app = sdk.getAppModule("0x7eaa61fA98F885cBE88dEe84f196dB01bA654A9F");

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenModule = await app.deployTokenModule({
      // What's your token's name? Ex. "Ethereum"
      name: "DerpDAO Governance Token",
      // What's your token's symbol? Ex. "ETH"
      symbol: "derpz",
    });
    console.log(
      "🎉 YAY Successfully deployed token module to addy:",
      tokenModule.address,
    );
  } catch (error) {
    console.error("❌ failz to deploy token module", error);
  }
})();
