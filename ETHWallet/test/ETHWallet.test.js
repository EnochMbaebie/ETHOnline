const AnyToken = artifacts.require('AnyToken')
const ChainToken = artifacts.require('ChainToken')
const ETHWallet = artifacts.require('ETHWallet')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('ETHWallet', ([owner, investor]) => {
  let anyToken, chainToken, ethWallet

  before(async () => {
    // Load Contracts
    anyToken = await AnyToken.new()
    chainToken = await ChainToken.new()
    ethWallet = await ETHWallet.new(chainToken.address, anyToken.address)

    // Transfer all ChainTokens to farm (1 million)
    await chainToken.transfer(ethWallet.address, tokens('1000000'))

    // Send tokens to investor
    await anyToken.transfer(investor, tokens('100'), { from: owner })
  })

  describe('AnyToken deployment', async () => {
    it('has a name', async () => {
      const name = await anyToken.name()
      assert.equal(name, 'AnyToken')
    })
  })

  describe('ChainToken deployment', async () => {
    it('has a name', async () => {
      const name = await chainToken.name()
      assert.equal(name, 'ChainToken')
    })
  })

  describe('ETHWallet deployment', async () => {
    it('has a name', async () => {
      const name = await ethWallet.name()
      assert.equal(name, 'ETHWallet')
    })

    it('contract has tokens', async () => {
      let balance = await chainToken.balanceOf(ethWallet.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe('ATK tokens', async () => {

    it('rewards investors for staking ATK tokens', async () => {
      let result

      // Check investor balance before staking
      result = await anyToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor AnyToken wallet balance correct before staking')

      // Stake ATK Tokens
      await anyToken.approve(ethWallet.address, tokens('100'), { from: investor })
      await ethWallet.stakeTokens(tokens('100'), { from: investor })

      // Check staking result
      result = await anyToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('0'), 'investor AnyToken wallet balance correct after staking')

      result = await anyToken.balanceOf(ethWallet.address)
      assert.equal(result.toString(), tokens('100'), 'ETHWallet AnyToken balance correct after staking')

      result = await ethWallet.stakingBalance(investor)
      assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

      result = await ethWallet.isStaking(investor)
      assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

      // Issue Tokens
      await ethWallet.issueTokens({ from: owner })

      // Check balances after issuance
      result = await chainToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor ChainToken wallet balance correct affter issuance')

      // Ensure that only onwer can issue tokens
      await ethWallet.issueTokens({ from: investor }).should.be.rejected;

      // Unstake tokens
      await ethWallet.unstakeTokens({ from: investor })

      // Check results after unstaking
      result = await anyToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor AnyToken wallet balance correct after staking')

      result = await anyToken.balanceOf(ethWallet.address)
      assert.equal(result.toString(), tokens('0'), 'ETHWallet AnyToken balance correct after staking')

      result = await ethWallet.stakingBalance(investor)
      assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

      result = await ethWallet.isStaking(investor)
      assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
    })
  })

})