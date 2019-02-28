pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract MultiSender is ERC20, ERC20Detailed{
    address public owner;
    mapping (address => bool)tokenRewarders; 
    uint totalTokensRewarded;
    
    constructor(string name, string symbol, uint8 decimals) ERC20Detailed(name, symbol, decimals) public {
        owner = msg.sender;
        totalTokensRewarded = 0;
    }
    
    function multiTransfer(address[] persons) public {
        require(msg.sender == owner);
        //require(persons.length == amounts.length);
        uint i;
        uint value = 100000;
        for(i=0; i<persons.length; i++){
            transfer(persons[i], value);
            tokenRewarders[persons[i]] = true;
            totalTokensRewarded++;
        }
    }
}
