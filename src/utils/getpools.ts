import { useAlephiumConnectContext } from "@alephium/web3-react"

export async function getBlockflowChainInfo() {
  const context = useAlephiumConnectContext()
  const nodeProvider = context.signerProvider?.nodeProvider

  if (!nodeProvider) {
    console.error("Node provider not found");
    return;
  }

  try {
    const blockflowChainInfo = await nodeProvider.blockflow.getBlockflowChainInfo({
      fromGroup: 0,
      toGroup: 0
    })
    console.log(blockflowChainInfo);
  } catch (err) {
    console.error(err);
  }
}

// const alephiumClient = new Alephium({ ...config }); // Initialize your Alephium client with your config

// async function getPools() {
//   const poolContracts = await alephiumClient.getContracts('PoolFactory'); // replace 'PoolFactory' with your pool factory contract
//   const pools = [];

//   for (const contract of poolContracts) {
//     const poolData = await alephiumClient.getContractData(contract);
//     const pool = formatPoolData(poolData); // format the data in a way that's useful for your application
//     pools.push(pool);
//   }

//   return pools;
// }

// function formatPoolData(poolData) {
//   return {
//     address: poolData.address,
//     tokenA: poolData.tokenA,
//     tokenB: poolData.tokenB,
//     liquidity: poolData.liquidity,
//     // Add other relevant pool details
//   };
// }

// getPools().then(pools => console.log(pools));
