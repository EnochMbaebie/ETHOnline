const TokenFarm = artifacts.require('ETHWallet');

module.exports = async function(callback) {
  let ethWallet = await EthWallet.deployed()
  await ethWallet.issueTokens()
  console.log("Tokens issued")
  callback()
} 