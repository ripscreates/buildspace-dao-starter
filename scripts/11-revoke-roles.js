import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
  "0x2c936E0a34BEffc271457685AB12102097964307",
);

(async () => {
  try {
    // Log the current roles.
    console.log(
      "😛 derp-Roles that exist right now:",
      await tokenModule.getAllRoleMembers()
    );

    // Revoke all the superpowers your wallet had over the ERC-20 contract.
    await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
    console.log(
      "😝🎉 derp-Roles after revoking ourselves",
      await tokenModule.getAllRoleMembers()
    );
    console.log("✅😝🎉 Woo! We Successfully revoked our derpypowers from the ERC-20 contract");

  } catch (error) {
    console.error("❌FAILZ revokin ourselves from the derpDAO treasury", error);
  }
})();
