import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Our voting contract.
const voteModule = sdk.getVoteModule(
  "0x31e4A7eE1A60572D21efcDC5364bf81405cec2e0",
);

// Our ERC-20 contract.
const tokenModule = sdk.getTokenModule(
  "0x2c936E0a34BEffc271457685AB12102097964307",
);

(async () => {
  try {
    const amount = 420_000;
    // Create proposal to mint 420,000 new token to the treasury.
    await voteModule.propose(
      "Should DerpDAO mint additional " + amount + " tokens into the DerpTreasury?",
      [
        {
          // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
          // to send in this proposal. In this case, we're sending 0 ETH.
          // We're just minting new tokens to the treasury. So, set to 0.
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            // We're doing a mint! And, we're minting to the voteModule, which is
            // acting as our treasruy.
            "mint",
            [
              voteModule.address,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),
          // Our token module that actually executes the mint.
          toAddress: tokenModule.address,
        },
      ]
    );

    console.log("✅ 🎉 YAY! We Successfully created a proposal to mint tokens 🤑");
  } catch (error) {
    console.error("❌ FAILZ creatin first proposal", error);
    process.exit(1);
  }

  try {
    const amount = 6_900;
    // Create proposal to transfer ourselves 6,900 tokens for being awesome.
    await voteModule.propose(
      "Should DerpDAO transfer " +
      amount + " tokens from the treasury to " +
      process.env.WALLET_ADDRESS + " for being extra-Derpy?",
      [
        {
          // Again, we're sending ourselves 0 ETH. Just sending our own token.
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            // We're doing a transfer from the treasury to our wallet.
            "transfer",
            [
              process.env.WALLET_ADDRESS,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),

          toAddress: tokenModule.address,
        },
      ]
    );

    console.log(
      "✅ 🎉 YAY! We Successfully created a proposal to reward ourselves from the DerpTreasury, 🤑🤑🤑 let's hope people vote for it!"
    );
  } catch (error) {
    console.error("❌ FAILZ creatin second proposal", error);
  }
})();
