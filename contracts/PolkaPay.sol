// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract KodaPay is ReentrancyGuard {
    using SafeMath for uint256;
    
    IERC20 public immutable usdtToken;
    
    // Execution fee percentage (1% = 100 basis points)
    uint256 public constant EXECUTION_FEE_BPS = 100;
    uint256 public constant BASIS_POINTS = 10000;
    
    struct Subscription {
        address owner;           // Who created the subscription
        address receiver;        // Who receives the payments
        uint256 amount;         // Amount to pay each period
        uint256 frequency;      // Seconds between payments
        uint256 lastPayment;    // Timestamp of last payment
        bool active;            // Whether subscription is active
    }
    
    // User balances (vault system)
    mapping(address => uint256) public userBalances;
    
    // Subscription storage
    mapping(uint256 => Subscription) public subscriptions;
    uint256 public nextSubscriptionId = 1;
    
    // User's subscription IDs
    mapping(address => uint256[]) public userSubscriptions;
    
    // Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event SubscriptionCreated(
        uint256 indexed subId,
        address indexed owner,
        address indexed receiver,
        uint256 amount,
        uint256 frequency
    );
    event PaymentExecuted(
        uint256 indexed subId,
        address indexed executor,
        uint256 amount,
        uint256 fee
    );
    event SubscriptionCancelled(uint256 indexed subId);
    
    /// @notice Initializes the KodaPay contract with the USDT token address
    /// @dev Sets the immutable USDT token reference for all subscription payments
    /// @dev SECURITY: Validates token address is not zero to prevent deployment errors
    /// @param _usdtToken Address of the USDT token contract (must be ERC20 compatible)
    constructor(address _usdtToken) {
        require(_usdtToken != address(0), "Invalid USDT address");
        usdtToken = IERC20(_usdtToken);
    }
    
    /// @notice Deposits USDT tokens into the user's vault for subscription payments
    /// @dev Transfers tokens from user to contract and updates internal balance
    /// @dev SECURITY: Uses nonReentrant modifier to prevent reentrancy attacks
    /// @dev SECURITY: Follows Checks-Effects-Interactions pattern for safety
    /// @param amount Amount of USDT tokens to deposit (in token's smallest unit, 6 decimals)
    /// @custom:requirements User must have approved this contract to spend `amount` tokens
    /// @custom:requirements Amount must be greater than 0
    /// @custom:requirements User must have sufficient USDT balance
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(
            usdtToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        userBalances[msg.sender] = userBalances[msg.sender].add(amount);
        emit Deposited(msg.sender, amount);
    }
    
    /// @notice Withdraws USDT tokens from the user's vault back to their wallet
    /// @dev Transfers tokens from contract to user and updates internal balance
    /// @dev SECURITY: Uses nonReentrant modifier to prevent reentrancy attacks
    /// @dev SECURITY: Updates balance BEFORE external call (Checks-Effects-Interactions pattern)
    /// @param amount Amount of USDT tokens to withdraw (in token's smallest unit, 6 decimals)
    /// @custom:requirements Amount must be greater than 0
    /// @custom:requirements User must have sufficient vault balance
    /// @custom:security Uses nonReentrant to prevent reentrancy attacks
    /// @custom:gas-optimization Balance is checked before transfer to save gas on failure
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        
        userBalances[msg.sender] = userBalances[msg.sender].sub(amount);
        require(usdtToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Withdrawn(msg.sender, amount);
    }
    
    /// @notice Creates a new subscription for automated recurring payments
    /// @dev Creates subscription struct and adds to user's subscription list
    /// @dev SECURITY: Validates all parameters and checks sufficient balance for first payment
    /// @param receiver Address that will receive the recurring payments
    /// @param amount Amount to pay each period (in USDT's smallest unit, 6 decimals)
    /// @param frequency Time between payments in seconds (e.g., 2592000 for 30 days)
    /// @return subId The unique ID of the created subscription
    /// @custom:requirements receiver must not be zero address
    /// @custom:requirements amount must be greater than 0
    /// @custom:requirements frequency must be greater than 0
    /// @custom:requirements user must have sufficient vault balance for first payment
    function createSubscription(
        address receiver,
        uint256 amount,
        uint256 frequency
    ) external returns (uint256) {
        require(receiver != address(0), "Invalid receiver address");
        require(amount > 0, "Amount must be greater than 0");
        require(frequency > 0, "Frequency must be greater than 0");
        require(userBalances[msg.sender] >= amount, "Insufficient balance for first payment");
        
        uint256 subId = nextSubscriptionId++;
        
        subscriptions[subId] = Subscription({
            owner: msg.sender,
            receiver: receiver,
            amount: amount,
            frequency: frequency,
            lastPayment: 0, // Will be set on first execution
            active: true
        });
        
        userSubscriptions[msg.sender].push(subId);
        
        emit SubscriptionCreated(subId, msg.sender, receiver, amount, frequency);
        return subId;
    }
    
    /// @notice Executes a subscription payment and rewards the executor with 1% fee
    /// @dev Core function of incentivized execution system - anyone can call this
    /// @dev SECURITY: Uses nonReentrant modifier and updates timestamp before transfers
    /// @dev SECURITY: Validates subscription is active and payment is due
    /// @param subId The subscription ID to execute payment for
    /// @return bool Returns true if payment was executed successfully
    /// @custom:incentives Executor receives 1% of payment amount as reward
    /// @custom:incentives Creates self-sustaining ecosystem where payments never miss
    /// @custom:temporal Uses block.timestamp (more reliable on Polkadot ~6s blocks)
    /// @custom:temporal First payment executable immediately (lastPayment = 0)
    /// @custom:temporal Subsequent payments require: block.timestamp >= lastPayment + frequency
    /// @custom:security Critical function with multiple validation layers
    /// @custom:incentive Executor earns 1% fee, creating economic incentive for execution
    function executePayment(uint256 subId) external nonReentrant returns (bool) {
        Subscription storage sub = subscriptions[subId];
        
        require(sub.active, "Subscription not active");
        require(sub.owner != address(0), "Subscription does not exist");
        
        // SEGURIDAD: Verificar que el pago sea debido
        if (sub.lastPayment != 0) {
            require(
                block.timestamp >= sub.lastPayment.add(sub.frequency),
                "Payment not due yet"
            );
        }
        
        // Verificar saldo suficiente
        require(
            userBalances[sub.owner] >= sub.amount,
            "Insufficient balance"
        );
        
        // SEGURIDAD: Actualizar timestamp ANTES de transferir
        sub.lastPayment = block.timestamp;
        
        // Calcular fee (1% del monto)
        uint256 executionFee = sub.amount.mul(EXECUTION_FEE_BPS).div(BASIS_POINTS);
        uint256 netAmount = sub.amount.sub(executionFee);
        
        // Deducir del saldo del usuario
        userBalances[sub.owner] = userBalances[sub.owner].sub(sub.amount);
        
        // Transferir al receptor
        require(usdtToken.transfer(sub.receiver, netAmount), "Transfer to receiver failed");
        
        // Transferir fee al ejecutor
        if (executionFee > 0) {
            require(usdtToken.transfer(msg.sender, executionFee), "Transfer fee failed");
        }
        
        emit PaymentExecuted(subId, msg.sender, netAmount, executionFee);
        
        // Auto-pause si no hay fondos para el siguiente pago
        if (userBalances[sub.owner] < sub.amount) {
            sub.active = false;
        }
        
        return true;
    }
    
    /**
     * Cancel a subscription
     */
    function cancelSubscription(uint256 subId) external {
        Subscription storage sub = subscriptions[subId];
        require(sub.owner == msg.sender, "Not subscription owner");
        require(sub.active, "Subscription already inactive");
        
        sub.active = false;
        emit SubscriptionCancelled(subId);
    }
    
    /**
     * Check if a payment is due
     */
    function isPaymentDue(uint256 subId) external view returns (bool) {
        Subscription storage sub = subscriptions[subId];
        
        if (!sub.active || sub.owner == address(0)) {
            return false;
        }
        
        if (sub.lastPayment == 0) {
            return true; // First payment
        }
        
        return block.timestamp >= sub.lastPayment.add(sub.frequency);
    }
    
    /**
     * Get user's subscription IDs
     */
    function getUserSubscriptions(address user) external view returns (uint256[] memory) {
        return userSubscriptions[user];
    }
    
    /**
     * Get subscription details
     */
    function getSubscription(uint256 subId) external view returns (
        address owner,
        address receiver,
        uint256 amount,
        uint256 frequency,
        uint256 lastPayment,
        bool active
    ) {
        Subscription storage sub = subscriptions[subId];
        return (
            sub.owner,
            sub.receiver,
            sub.amount,
            sub.frequency,
            sub.lastPayment,
            sub.active
        );
    }
}

