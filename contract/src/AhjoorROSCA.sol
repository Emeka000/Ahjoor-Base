// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {Pausable} from "lib/openzeppelin-contracts/contracts/utils/Pausable.sol";
import {IERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract AhjoorROSCA is Ownable, Pausable {
  

    struct GroupInfo {
        string name;
        string description;
        address organizer;
        uint32 num_participants;
        uint256 contribution_amount;
        uint64 round_duration;
        uint32 num_participants_stored;
        uint32 current_round;
        bool is_completed;
        uint64 created_at;
        uint64 last_payout_time;
        address token_address; 
    }

    // ROSCA specific storage
    uint256 public group_counter;
    mapping(uint256 => GroupInfo) public groups;
    mapping(uint256 => mapping(uint32 => address)) public participant_addresses;
    mapping(uint256 => mapping(address => mapping(uint32 => bool))) public contributions;
    mapping(uint256 => uint256) public total_pool;

    event GroupCreated(
        uint256 group_id,
        address organizer,
        string name,
        uint32 num_participants,
        uint256 contribution_amount,
        address token_address
    );
    event ContributionMade(
        uint256 group_id,
        address participant,
        uint256 amount,
        uint32 round
    );
    event PayoutClaimed(
        uint256 group_id,
        address recipient,
        uint256 amount,
        uint32 round
    );
    event Upgraded(bytes32 new_class_hash);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function create_group(
        string memory name,
        string memory description,
        uint32 num_participants,
        uint256 contribution_amount,
        uint64 round_duration,
        address[] memory participant_addresses_array,
        address token_address
    ) external whenNotPaused returns (uint256) {
        address caller = msg.sender;
        uint64 current_time = uint64(block.timestamp);

        // Validate inputs
        require(num_participants >= 2, "Min 2 participants required");
        require(num_participants <= 50, "Max 50 participants allowed");
        require(contribution_amount > 0, "Contribution must be > 0");
        require(round_duration >= 86400, "Min 1 day round duration");
        require(participant_addresses_array.length == num_participants, "Addresses count mismatch");

        // Verify organizer is in participant list
        bool found_organizer = false;
        for (uint32 i = 0; i < participant_addresses_array.length; i++) {
            if (participant_addresses_array[i] == caller) {
                found_organizer = true;
                break;
            }
        }
        require(found_organizer, "Organizer not in list");

        group_counter++;
        uint256 group_id = group_counter;

        // Store participant addresses
        for (uint32 j = 0; j < participant_addresses_array.length; j++) {
            participant_addresses[group_id][j] = participant_addresses_array[j];
        }

        groups[group_id] = GroupInfo({
            name: name,
            description: description,
            organizer: caller,
            num_participants: num_participants,
            contribution_amount: contribution_amount,
            round_duration: round_duration,
            num_participants_stored: uint32(participant_addresses_array.length),
            current_round: 1,
            is_completed: false,
            created_at: current_time,
            last_payout_time: 0,
            token_address: token_address
        });

        emit GroupCreated(
            group_id,
            caller,
            name,
            num_participants,
            contribution_amount,
            token_address
        );

        return group_id;
    }

    function contribute(uint256 group_id) external payable whenNotPaused {
        address caller = msg.sender;
        GroupInfo storage group = groups[group_id];

        // Validate group exists and is active
        require(group.organizer != address(0), "Group does not exist");
        require(!group.is_completed, "Group is completed");

        // Verify caller is a participant
        require(is_participant(group_id, caller), "Not a participant");

        // Check if already contributed for current round
        require(!contributions[group_id][caller][group.current_round], "Already contributed this round");

        // Handle contribution based on token_address
        if (group.token_address == address(0)) {
            // Ether contribution
            require(msg.value == group.contribution_amount, "Incorrect Ether amount");
            total_pool[group_id] += msg.value;
        } else {
            // ERC20 token contribution
            require(msg.value == 0, "Do not send Ether for token group");
            IERC20 token = IERC20(group.token_address);
            bool success = token.transferFrom(caller, address(this), group.contribution_amount);
            require(success, "Token transfer failed");
            total_pool[group_id] += group.contribution_amount;
        }

        // Mark contribution
        contributions[group_id][caller][group.current_round] = true;

        emit ContributionMade(
            group_id,
            caller,
            group.contribution_amount,
            group.current_round
        );
    }

    function claim_payout(uint256 group_id) external whenNotPaused {
        address payable caller = payable(msg.sender);
        GroupInfo storage group = groups[group_id];

        // Validate group exists and is active
        require(group.organizer != address(0), "Group does not exist");
        require(!group.is_completed, "Group is completed");

        // Check if it's time for payout (all participants contributed)
        uint256 expected_pool = group.contribution_amount * uint256(group.num_participants);
        uint256 current_pool = total_pool[group_id];
        require(current_pool >= expected_pool, "Not all contributed");

        // Get current round recipient (based on payout order)
        uint32 recipient_index = (group.current_round - 1) % group.num_participants;
        address current_recipient = participant_addresses[group_id][recipient_index];
        require(current_recipient == caller, "Not your turn for payout");

        // Check timing - ensure round duration has passed since last payout
        uint64 current_time = uint64(block.timestamp);
        if (group.last_payout_time > 0) {
            require(current_time >= group.last_payout_time + group.round_duration, "Round duration not elapsed");
        }

        // Transfer payout
        uint256 payout_amount = group.contribution_amount * uint256(group.num_participants);
        total_pool[group_id] -= payout_amount;

        if (group.token_address == address(0)) {
            // Ether payout
            require(address(this).balance >= payout_amount, "Insufficient contract balance");
            (bool success, ) = caller.call{value: payout_amount}("");
            require(success, "Ether payout failed");
        } else {
            // ERC20 token payout
            IERC20 token = IERC20(group.token_address);
            bool success = token.transfer(caller, payout_amount);
            require(success, "Token payout failed");
        }

        // Update group state
        group.current_round += 1;
        group.is_completed = (group.current_round > group.num_participants);
        group.last_payout_time = current_time;

        emit PayoutClaimed(
            group_id,
            caller,
            payout_amount,
            group.current_round - 1
        );
    }

    function get_group_info(uint256 group_id) external view returns (GroupInfo memory) {
        return groups[group_id];
    }

    function get_group_count() external view returns (uint256) {
        return group_counter;
    }

    function is_participant(uint256 group_id, address addr) public view returns (bool) {
        GroupInfo memory group = groups[group_id];
        for (uint32 i = 0; i < group.num_participants_stored; i++) {
            if (participant_addresses[group_id][i] == addr) {
                return true;
            }
        }
        return false;
    }

    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        _transferOwnership(newOwner);
    }

    function renounceOwnership() public override onlyOwner {
        _transferOwnership(address(0));
    }

    function upgrade(bytes32 new_class_hash) external onlyOwner {
        emit Upgraded(new_class_hash);
    }

    // View functions
    function is_paused() external view returns (bool) {
        return paused();
    }


}