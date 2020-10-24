import React, { Component } from 'react'
import Navbar from './Navbar'
import Web3 from 'web3'
import AnyToken from '../abis/AnyToken.json'
import ChainToken from '../abis/ChainToken.json'
import ETHWallet from '../abis/ETHWallet.json'
import Main from './Main'
import './App.css'

class App extends Component {

  async UNSAFE_componentWillMount() {
    document.body.style.backgroundColor = "#282c34"
    document.body.style.color = "grey"
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    // get web3
    const web3 = window.web3
    // get accounts
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // get network id
    const networkId = await web3.eth.net.getId()
    console.log(networkId)

    // get AnyToken
    const anyTokenData = AnyToken.networks[networkId]
    if (anyTokenData) {
      const anyToken = new web3.eth.Contract(AnyToken.abi, anyTokenData.address)
      this.setState({ anyToken })
      let anyTokenBalance = await anyToken.methods.balanceOf(this.state.account).call()
      this.setState({ anyTokenBalance: anyTokenBalance.toString() })
      console.log({ balance: anyTokenBalance })
    } else {
      window.alert('AnyToken contract not deployed to detected network.')
    }

    // get ChainToken
    const chainTokenData = ChainToken.networks[networkId]
    if (chainTokenData) {
      const chainToken = new web3.eth.Contract(ChainToken.abi, chainTokenData.address)
      this.setState({ chainToken })
      let chainTokenBalance = await chainToken.methods.balanceOf(this.state.account).call()
      this.setState({ chainTokenBalance: chainTokenBalance.toString() })
        console.log({ balance: chainTokenBalance })
    } else {
      window.alert('ChainToken contract not deployed to detected network.')
    }

    // get ETHWallet
    const ethWalletData = ETHWallet.networks[networkId]
    if (ethWalletData) {
      const ethWallet = new web3.eth.Contract(ETHWallet.abi, ethWalletData.address)
      this.setState({ ethWallet })
      let stakingBalance = await ethWallet.methods.stakingBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString() })
        console.log({ balance: stakingBalance })
    } else {
      window.alert('EthWallet contract not deployed to detected netowrk.')
    } 

    this.setState({ loading:false })  
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.anyToken.methods.approve(this.state.ethWallet._address, amount)
    .send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.ethWallet.methods.stakeTokens(amount).send({ from: this.state.account })
      .on('transactionHash', (hash) => { 
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.ethWallet.methods.unstakeTokens().send({ from: this.state.account })
    .on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      anyToken: {},
      chainToken: {},
      ethWallet: {},
      anyTokenBalance: '0',
      chainTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {
    let content
    if (this.state.loading) {
      content = <h2 id="loader" className="text-center">Loading...</h2>
    } else {
      content = <Main 
        anyTokenBalance={ this.state.anyTokenBalance }
        chainTokenBalance={ this.state.chainTokenBalance }
        stakingBalance={ this.state.stakingBalance }
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.zen2see.com"
                  target="_blank"
                  rel="noopener noreferrer">
                </a>

                { content }

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
