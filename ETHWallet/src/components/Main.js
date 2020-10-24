import React, { Component } from 'react'
import dai from '../dai.png'

class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3 ">
        <table className="table table-dark table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Staking Balance</th>
              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'ether')} ATK</td>
              <td>{window.web3.utils.fromWei(this.props.chainTokenBalance, 'ether')} CTK</td>
            </tr>
          </tbody>
        </table>
        
        <div className="card mb-4 border-0 greybackgound" >
          <div className="card-body greybkground">
            <form className="mb-3 greybkground" onSubmit={(event) => {
                event.preventDefault()
                let amount
                amount = this.input.value.toString()
                amount = window.web3.utils.toWei(amount, 'ether')
                this.props.stakeTokens(amount)
              }}>
              <div>
                <label className="float-left">Stake Tokens</label>
                <span className="float-right text-muted">
                  Balance: {window.web3.utils.fromWei(this.props.anyTokenBalance, 'ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input className="form-control form-control-lg ltgreybkground border-warning"
                       type="text"
                       placeholder="0"
                       required 
                       ref={(input) => {this.input = input }}
                /> 
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={dai} height="32" alt=""/>
                    &nbsp;&nbsp;&nbsp; ATK
                  </div>
                </div>
              </div>
              <button type="subnit" className="btn btn-success btn-block btn-lg">STAKE!</button>
            </form> 
            <button className="btn btn-warning btn-block btn-sm"
                    type="submit"
                    onClick={(event) => { 
                      event.preventDefault()
                      this.props.unstakeTokens()
                    }}>
                    UN-STAKE...
            </button>
          </div>
       </div>
      </div>
    );
  }
}

export default Main;
