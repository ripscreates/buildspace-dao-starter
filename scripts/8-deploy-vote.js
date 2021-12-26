import sdk from "./1-initialize-sdk.js";

// Grab the app module address.
const appModule = sdk.getAppModule(
  "0x7eaa61fA98F885cBE88dEe84f196dB01bA654A9F",
);

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      // Give your governance contract a name.
      name: "DerpDAO's Derpy Proposals",

      // This is the location of our governance token, our ERC-20 contract!
      votingTokenAddress: "0x2c936E0a34BEffc271457685AB12102097964307",

      // After a proposal is created, when can members start voting?
      // For now, we set this to immediately.
      proposalStartWaitTimeInSeconds: 0,

      // How long do members have to vote on a proposal when it's created?
      // Here, we set it to 24 hours (86400 seconds)
      proposalVotingTimeInSeconds: 24 * 60 * 60,

      // Will explain more below.
      votingQuorumFraction: 0,

      // What's the minimum # of tokens a user needs to be allowed to create a proposal?
      // I set it to 0. Meaning no tokens are required for a user to be allowed to
      // create a proposal.
      minimumNumberOfTokensNeededToPropose: "0",
    });

    console.log(
      "✅ YAY 🌈 We Successfully deployed vote module, addy:",
      voteModule.address,
    );
  } catch (err) {
    console.log("❌ FAILZ deployin vote module 😭", err);
  }
})();
