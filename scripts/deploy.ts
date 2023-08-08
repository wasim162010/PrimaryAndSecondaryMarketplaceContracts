import { ethers } from "hardhat";

async function main() {
  const deployer = await ethers.getSigner("0x61b0905cbB94e77e048d07E0ceb81a2a8C3bAeE8");

  const validator = "0x73521Ee70E5f126921DC8BE247B87Aabe2f14c2B";
  const marketplace = "0xFe36C17B33D107da9adf3b44f0D6FC0c811de606"
  const asset721 = "0xA9012D3c5c1bae3bfD0939Eb51D5d59A7a842ce1";
  const asset1155 = "0xf77750bf0eb161C838ce690c9046982Ea6AB5cD7";

  const Factory = await ethers.getContractFactory("Factory");
  console.log("Start deploying");
  const primary = await Factory.connect(deployer).deploy();
  console.log("Waiting for deploy");
  await primary.deployed();

  console.log("Factory deployed to:", primary.address);

  await primary.initialize(
    asset721,
    asset1155,
    marketplace,
    validator
  );

  console.log("Done!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
