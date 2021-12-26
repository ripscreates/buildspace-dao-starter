import sdk from "./1-initialize-sdk.js";

const bundleDrop = sdk.getBundleDropModule(
  "0x585a56fCa6e4C9630A7b7d09D27f949C7Ca3aA52",
);

(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory();
    // Specify conditions.
    claimConditionFactory.newClaimPhase({
      startTime: new Date(),
      maxQuantity: 50_000,
      maxQuantityPerTransaction: 1,
    });
    
    
    await bundleDrop.setClaimCondition(0, claimConditionFactory);
    console.log("YEYYAHH!! ✅ Sucessfully set claim condition!");
  } catch (error) {
    console.error("Failz to set claim condition. sadness", error);
  }
})()
