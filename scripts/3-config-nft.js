import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0x585a56fCa6e4C9630A7b7d09D27f949C7Ca3aA52",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "derpz",
        description: "This NFT will give you access to derpDAO!",
        image: readFileSync("scripts/assets/derpz.gif"),
      },
    ]);
    console.log("✅ WooHoo! We Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failz to create new NFT. sadness", error);
  }
})()
