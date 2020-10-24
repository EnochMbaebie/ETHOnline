const ETHWallet = artifacts.require('ETHWallet');
const AnyToken = artifacts.require('AnyToken');
const ChainToken = artifacts.require('ChainToken');

module.exports = async function(deployer, network, accounts) {
  // Deloy ChainToken
  await deployer.deploy(ChainToken)
  const chainToken = await ChainToken.deployed()

  // Deploy AnyToken
  await deployer.deploy(AnyToken)
  const anyToken = await AnyToken.deployed()

  // Deploy ETHWallet
  await deployer.deploy(ETHWallet, anyToken.address, chainToken.address)
  const ethWallet = await ETHWallet.deployed()

  // Transfer all tokens to ETHWallet (1 million)
  await chainToken.transfer(ethWallet.address, '1000000000000000000')  
  
  // Transfer 100 Mock DAI tokens to investor
  await anyToken.transfer(accounts[1], '100000000000000000000')
}