// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MockUSDT is ERC20, Ownable {
    uint8 private _decimals = 6;

    constructor() ERC20("Mock USDT", "mUSDT") {
        // Mint initial supply to deployer for testing
        _mint(msg.sender, 1000000 * 10**_decimals); // 1M USDT
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    // Faucet function for testing - anyone can mint tokens
    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
    
    // Mint function for owner
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}


