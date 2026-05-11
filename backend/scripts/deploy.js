const hre = require("hardhat");

async function main() {
  console.log("Đang triển khai hợp đồng IchiDelivery...");
  
  const Delivery = await hre.ethers.getContractFactory("IchiDelivery");
  const delivery = await Delivery.deploy();

  await delivery.waitForDeployment();
  
  console.log("IchiDelivery đã được deploy tại địa chỉ:", await delivery.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
