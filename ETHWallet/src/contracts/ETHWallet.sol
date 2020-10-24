// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.0;

import "./AnyToken.sol";
import "./ChainToken.sol";

contract ETHWallet {
    string public name = "ETHWallet";
    address public owner;
    AnyToken public anyToken;
    ChainToken public chainToken;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(ChainToken _chainToken, AnyToken _anyToken) {
        anyToken = _anyToken;
        chainToken = _chainToken;
        owner = msg.sender;
    }

    function stakeTokens(uint _amount) public {
        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");

        // Trasnfer anyTokens to this contract for staking
        anyToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array *only* if they haven't staked already
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Unstaking Tokens (Withdraw)
    function unstakeTokens() public {
        // Fetch staking balance
        uint balance = stakingBalance[msg.sender];

        // Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        anyToken.transfer(msg.sender, balance);

        // Reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking status
        isStaking[msg.sender] = false;
    }

    // Issuing Tokens
    function issueTokens() public {
        // Only owner can call this function
        require(msg.sender == owner, "caller must be the owner");

        // Issue tokens to all stakers
       for (uint i=0; i<stakers.length; i++) {
           address recipient = stakers[i];
           uint balance = stakingBalance[recipient];
           if(balance > 0) {
               chainToken.transfer(recipient, balance);
            }   
        }
    }
}
