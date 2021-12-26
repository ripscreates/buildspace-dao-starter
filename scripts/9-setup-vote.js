import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// This is our governance contract.
const voteModule = sdk.getVoteModule(
  "0x31e4A7eE1A60572D21efcDC5364bf81405cec2e0",
);

// This is our ERC-20 contract.
const tokenModule = sdk.getTokenModule(
  "0x2c936E0a34BEffc271457685AB12102097964307",
);

(async () => {
  try {
    // Give our treasury the power to mint additional token if needed.
    await tokenModule.grantRole("minter", voteModule.address);

    console.log(
      "WOO✨ Successfully gave vote module permissions to act on token module"
    );
  } catch (error) {
    console.error(
      "❌ FAILZ granting vote module permissions on token module 😭",
      error
    );
    process.exit(1);
  }

  try {
    // Grab our wallet's token balance, remember -- we hold basically the entire supply right now!
    const ownedTokenBalance = await tokenModule.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // Grab 90% of the supply that we hold.
    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const percent90 = ownedAmount.div(100).mul(90);

    // Transfer 90% of the supply to our voting contract.
    await tokenModule.transfer(
      voteModule.address,
      percent90
    );

    console.log("✅ WOOHOO ✨ Successfully transferred tokens to vote module");
  } catch (err) {
    console.error("❌ FAILZ transferin tokens to vote module", err);
  }
})();
