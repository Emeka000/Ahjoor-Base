// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test, console2} from "forge-std/Test.sol";
import {AhjoorROSCA} from "../src/AhjoorROSCA.sol";
import {ERC20Mock} from "../src/ERC20Mock.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {Pausable} from "lib/openzeppelin-contracts/contracts/utils/Pausable.sol";
import {ERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract AhjoorROSCATest is Test {
    AhjoorROSCA public rosca;
    ERC20Mock public wethMock;
    ERC20Mock public usdcMock;

    address public owner = makeAddr("owner");
    address public participant1 = makeAddr("participant1");
    address public participant2 = makeAddr("participant2");
    address public organizer = makeAddr("organizer");
    address public nonParticipant = makeAddr("nonParticipant");

    uint256 public constant CONTRIBUTION_AMOUNT = 1 ether;
    uint64 public constant ROUND_DURATION = 86400; // 1 day
    uint32 public constant NUM_PARTICIPANTS = 2;

    address[] public participants;

    function setUp() public {
        wethMock = new ERC20Mock("WETH", "WETH", owner);
        usdcMock = new ERC20Mock("USDC", "USDC", owner);

        rosca = new AhjoorROSCA(
            owner,
            address(wethMock),
            address(usdcMock)
        );

        participants.push(organizer);
        participants.push(participant1);

        // Mint tokens to participants for ERC20 tests
        wethMock.mint(organizer, 1000 ether);
        usdcMock.mint(organizer, 1000 ether);
        wethMock.mint(participant1, 1000 ether);
        usdcMock.mint(participant1, 1000 ether);

        // Approve the contract to spend tokens
        vm.startPrank(organizer);
        wethMock.approve(address(rosca), type(uint256).max);
        usdcMock.approve(address(rosca), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(participant1);
        wethMock.approve(address(rosca), type(uint256).max);
        usdcMock.approve(address(rosca), type(uint256).max);
        vm.stopPrank();
    }

    function testDeployment() public {
        assertEq(address(rosca.WETH_TOKEN_ADDRESS()), address(wethMock));
        assertEq(address(rosca.USDC_TOKEN_ADDRESS()), address(usdcMock));
        assertEq(rosca.owner(), owner);
        assertEq(rosca.group_counter(), 0);
    }

    function testCreateGroupSuccessEther() public {
        vm.prank(organizer);
        uint256 groupId = rosca.create_group(
            "Test Group",
            "Description",
            NUM_PARTICIPANTS,
            CONTRIBUTION_AMOUNT,
            ROUND_DURATION,
            participants,
            address(0)
        );

        AhjoorROSCA.GroupInfo memory group = rosca.get_group_info(groupId);
        assertEq(group.name, "Test Group");
        assertEq(group.description, "Description");
        assertEq(group.organizer, organizer);
        assertEq(group.num_participants, NUM_PARTICIPANTS);
        assertEq(group.contribution_amount, CONTRIBUTION_AMOUNT);
        assertEq(group.round_duration, ROUND_DURATION);
        assertEq(group.current_round, 1);
        assertFalse(group.is_completed);
        assertEq(group.token_address, address(0));
        assertEq(rosca.group_counter(), 1);
    }

    function testCreateGroupSuccessWETH() public {
        vm.prank(organizer);
        uint256 groupId = rosca.create_group(
            "Test Group",
            "Description",
            NUM_PARTICIPANTS,
            CONTRIBUTION_AMOUNT,
            ROUND_DURATION,
            participants,
            address(wethMock)
        );

        AhjoorROSCA.GroupInfo memory group = rosca.get_group_info(groupId);
        assertEq(group.token_address, address(wethMock));
    }

    function testCreateGroupInvalidNumParticipantsMin() public {
        address[] memory invalidParticipants = new address[](1);
        invalidParticipants[0] = organizer;

        vm.prank(organizer);
        vm.expectRevert("Min 2 participants required");
        rosca.create_group(
            "Test",
            "Desc",
            1,
            CONTRIBUTION_AMOUNT,
            ROUND_DURATION,
            invalidParticipants,
            address(0)
        );
    }

    function testCreateGroupInvalidNumParticipantsMax() public {
        address[] memory invalidParticipants = new address[](51);
        for (uint32 i = 0; i < 51; i++) {
            invalidParticipants[i] = makeAddr(string(abi.encodePacked("p", i)));
        }

        vm.prank(organizer);
        vm.expectRevert("Max 50 participants allowed");
        rosca.create_group(
            "Test",
            "Desc",
            51,
            CONTRIBUTION_AMOUNT,
            ROUND_DURATION,
            invalidParticipants,
            address(0)
        );
    }

    function testCreateGroupInvalidContributionZero() public {
        vm.prank(organizer);
        vm.expectRevert("Contribution must be > 0");
        rosca.create_group(
            "Test",
            "Desc",
            NUM_PARTICIPANTS,
            0,
            ROUND_DURATION,
            participants,
            address(0)
        );
    }

    function testCreateGroupInvalidRoundDuration() public {
        vm.prank(organizer);
        vm.expectRevert("Min 1 day round duration");
        rosca.create_group(
            "Test",
            "Desc",
            NUM_PARTICIPANTS,
            CONTRIBUTION_AMOUNT,
            86399,
            participants,
            address(0)
        );
    }

    function testCreateGroupAddressesMismatch() public {
        address[] memory mismatch = new address[](3);
        mismatch[0] = organizer;
        mismatch[1] = participant1;
        mismatch[2] = participant2;

        vm.prank(organizer);
        vm.expectRevert("Addresses count mismatch");
        rosca.create_group(
            "Test",
            "Desc",
            2,
            CONTRIBUTION_AMOUNT,
            ROUND_DURATION,
            mismatch,
            address(0)
        );
    }

    function testCreateGroupUnsupportedToken() public {
        address unsupported = makeAddr("unsupported");

        vm.prank(organizer);
        vm.expectRevert("Token not supported");
        rosca.create_group(
            "Test",
            "Desc",
            NUM_PARTICIPANTS,
            CONTRIBUTION_AMOUNT,
            ROUND_DURATION,
            participants,
            unsupported
        );
    }

    function testCreateGroupOrganizerNotInList() public {
        address[] memory noOrganizer = new address[](2);
        noOrganizer[0] = participant1;
        noOrganizer[1] = participant2;

        vm.prank(organizer);
        vm.expectRevert("Organizer not in list");
        rosca.create_group(
            "Test",
            "Desc",
            2,
            CONTRIBUTION_AMOUNT,
            ROUND_DURATION,
            noOrganizer,
            address(0)
        );
    }

    function testContributeEtherSuccess() public {
        uint256 groupId = _createGroup(address(0));

        // Participant 1 contributes
        vm.prank(participant1);
        vm.deal(participant1, CONTRIBUTION_AMOUNT);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        // Organizer contributes
        vm.prank(organizer);
        vm.deal(organizer, CONTRIBUTION_AMOUNT);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        assertEq(rosca.total_pool(groupId), CONTRIBUTION_AMOUNT * 2);
    }

    function testContributeWETHSuccess() public {
        uint256 groupId = _createGroup(address(wethMock));

        // Participant 1 contributes
        vm.prank(participant1);
        rosca.contribute(groupId);

        // Organizer contributes
        vm.prank(organizer);
        rosca.contribute(groupId);

        assertEq(rosca.total_pool(groupId), CONTRIBUTION_AMOUNT * 2);
        assertEq(wethMock.balanceOf(address(rosca)), CONTRIBUTION_AMOUNT * 2);
    }

    function testContributeGroupDoesNotExist() public {
        vm.prank(participant1);
        vm.expectRevert("Group does not exist");
        rosca.contribute(999);
    }

    function testContributeGroupCompleted() public {
        uint256 groupId = _createGroup(address(0));
        _completeGroup(groupId);

        vm.prank(participant1);
        vm.deal(participant1, CONTRIBUTION_AMOUNT);
        vm.expectRevert("Group is completed");
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);
    }

    function testContributeNotParticipant() public {
        uint256 groupId = _createGroup(address(0));

        vm.prank(nonParticipant);
        vm.deal(nonParticipant, CONTRIBUTION_AMOUNT);
        vm.expectRevert("Not a participant");
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);
    }

    function testContributeAlreadyContributed() public {
        uint256 groupId = _createGroup(address(0));

        vm.prank(participant1);
        vm.deal(participant1, CONTRIBUTION_AMOUNT);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        vm.deal(participant1, CONTRIBUTION_AMOUNT);
        vm.prank(participant1);
        vm.expectRevert("Already contributed this round");
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);
    }

    function testContributeIncorrectEtherAmount() public {
        uint256 groupId = _createGroup(address(0));

        vm.prank(participant1);
        vm.deal(participant1, CONTRIBUTION_AMOUNT + 1);
        vm.expectRevert("Incorrect Ether amount");
        rosca.contribute{value: CONTRIBUTION_AMOUNT + 1}(groupId);
    }

    function testContributeEtherForTokenGroup() public {
        uint256 groupId = _createGroup(address(wethMock));

        vm.prank(participant1);
        vm.deal(participant1, 1 wei);
        vm.expectRevert("Do not send Ether for token group");
        rosca.contribute{value: 1 wei}(groupId);
    }


    function testClaimPayoutEtherSuccess() public {
        uint256 groupId = _createGroup(address(0));

        // Both contribute
        vm.prank(participant1);
        vm.deal(participant1, CONTRIBUTION_AMOUNT);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        vm.prank(organizer);
        vm.deal(organizer, CONTRIBUTION_AMOUNT);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        // Organizer (index 0) claims first payout
        uint256 initialBalance = organizer.balance;
        vm.prank(organizer);
        rosca.claim_payout(groupId);

        assertEq(organizer.balance, initialBalance + CONTRIBUTION_AMOUNT * 2);
        assertEq(rosca.total_pool(groupId), 0);

        AhjoorROSCA.GroupInfo memory group = rosca.get_group_info(groupId);
        assertEq(group.current_round, 2);
        assertFalse(group.is_completed);
    }

    function testClaimPayoutWETHSuccess() public {
        uint256 groupId = _createGroup(address(wethMock));

        // Both contribute
        vm.prank(participant1);
        rosca.contribute(groupId);

        vm.prank(organizer);
        rosca.contribute(groupId);

        uint256 initialBalance = wethMock.balanceOf(organizer);
        vm.prank(organizer);
        rosca.claim_payout(groupId);

        assertEq(wethMock.balanceOf(organizer), initialBalance + CONTRIBUTION_AMOUNT * 2);
        assertEq(rosca.total_pool(groupId), 0);
    }

    function testClaimPayoutNotAllContributed() public {
        uint256 groupId = _createGroup(address(0));

        // Only one contributes
        vm.prank(participant1);
        vm.deal(participant1, CONTRIBUTION_AMOUNT);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        vm.prank(organizer);
        vm.expectRevert("Not all contributed");
        rosca.claim_payout(groupId);
    }

    function testClaimPayoutNotYourTurn() public {
        uint256 groupId = _createGroup(address(0));

        // Both contribute
        vm.prank(participant1);
        vm.deal(participant1, CONTRIBUTION_AMOUNT);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        vm.prank(organizer);
        vm.deal(organizer, CONTRIBUTION_AMOUNT);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        // Participant1 (index 1) tries to claim first (should be organizer index 0)
        vm.prank(participant1);
        vm.expectRevert("Not your turn for payout");
        rosca.claim_payout(groupId);
    }

    function testClaimPayoutRoundDurationNotElapsed() public {
        uint256 groupId = _createGroup(address(0));

        // Both contribute round 1
        vm.prank(participant1);
        vm.deal(participant1, CONTRIBUTION_AMOUNT);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        vm.prank(organizer);
        vm.deal(organizer, CONTRIBUTION_AMOUNT);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        // Organizer claims first payout
        vm.prank(organizer);
        rosca.claim_payout(groupId);

        // Both contribute round 2 immediately
        vm.deal(participant1, CONTRIBUTION_AMOUNT);
        vm.prank(participant1);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        vm.deal(organizer, CONTRIBUTION_AMOUNT);
        vm.prank(organizer);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        // Try to claim second payout immediately
        // participant1 (index 1) claims second round
        vm.prank(participant1);
        vm.expectRevert("Round duration not elapsed");
        rosca.claim_payout(groupId);
    }

    function testClaimPayoutAfterDuration() public {
        uint256 groupId = _createGroup(address(0));

        // Both contribute round 1
        vm.prank(participant1);
        vm.deal(participant1, CONTRIBUTION_AMOUNT);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        vm.prank(organizer);
        vm.deal(organizer, CONTRIBUTION_AMOUNT);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        // Organizer claims first
        vm.prank(organizer);
        rosca.claim_payout(groupId);

        // Warp time
        vm.warp(block.timestamp + ROUND_DURATION);

        // Both contribute round 2
        vm.deal(participant1, CONTRIBUTION_AMOUNT);
        vm.prank(participant1);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        vm.deal(organizer, CONTRIBUTION_AMOUNT);
        vm.prank(organizer);
        rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);

        // participant1 claims second
        uint256 initialBalance = participant1.balance;
        vm.prank(participant1);
        rosca.claim_payout(groupId);

        assertEq(participant1.balance, initialBalance + CONTRIBUTION_AMOUNT * 2);
    }

    function testClaimPayoutGroupCompleted() public {
        uint256 groupId = _createGroup(address(0));
        _completeGroup(groupId);

        vm.prank(organizer);
        vm.expectRevert("Group is completed");
        rosca.claim_payout(groupId);
    }

    function testPauseAndUnpause() public {
        vm.prank(owner);
        rosca.pause();

        assertTrue(rosca.is_paused());

        // Try create group while paused
        vm.prank(organizer);
        vm.expectRevert(Pausable.EnforcedPause.selector);
        rosca.create_group(
            "Test",
            "Desc",
            NUM_PARTICIPANTS,
            CONTRIBUTION_AMOUNT,
            ROUND_DURATION,
            participants,
            address(0)
        );

        vm.prank(owner);
        rosca.unpause();

        assertFalse(rosca.is_paused());
    }

    function testOnlyOwnerPause() public {
        vm.prank(participant1);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, participant1));
        rosca.pause();
    }

    function testTransferOwnership() public {
        address newOwner = makeAddr("newOwner");

        vm.prank(owner);
        rosca.transferOwnership(newOwner);

        assertEq(rosca.owner(), newOwner);
    }

    function testRenounceOwnership() public {
        vm.prank(owner);
        rosca.renounceOwnership();

        assertEq(rosca.owner(), address(0));
    }

    function testIsParticipant() public {
        uint256 groupId = _createGroup(address(0));

        assertTrue(rosca.is_participant(groupId, organizer));
        assertTrue(rosca.is_participant(groupId, participant1));
        assertFalse(rosca.is_participant(groupId, nonParticipant));
    }

    function testIsTokenSupported() public {
        assertTrue(rosca.is_token_supported(address(0)));
        assertTrue(rosca.is_token_supported(address(wethMock)));
        assertTrue(rosca.is_token_supported(address(usdcMock)));
        assertFalse(rosca.is_token_supported(makeAddr("unsupported")));
    }

    function testUpgrade() public {
        bytes32 newHash = keccak256("new_hash");

        vm.prank(owner);
        vm.expectEmit(true, true, true, true);
        emit AhjoorROSCA.Upgraded(newHash);
        rosca.upgrade(newHash);
    }

    function _createGroup(address tokenAddress) internal returns (uint256) {
        vm.prank(organizer);
        return rosca.create_group(
            "Test Group",
            "Description",
            NUM_PARTICIPANTS,
            CONTRIBUTION_AMOUNT,
            ROUND_DURATION,
            participants,
            tokenAddress
        );
    }

    function _completeGroup(uint256 groupId) internal {
        AhjoorROSCA.GroupInfo memory groupInfo = rosca.get_group_info(groupId);

        // Round 1 contributions
        vm.prank(participant1);
        if (groupInfo.token_address == address(0)) {
            vm.deal(participant1, CONTRIBUTION_AMOUNT);
            rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);
        } else {
            rosca.contribute(groupId);
        }

        vm.prank(organizer);
        if (groupInfo.token_address == address(0)) {
            vm.deal(organizer, CONTRIBUTION_AMOUNT);
            rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);
        } else {
            rosca.contribute(groupId);
        }

        // Claim first (round 1, index 0: organizer)
        vm.prank(organizer);
        rosca.claim_payout(groupId);

        // Warp time for next round
        vm.warp(block.timestamp + ROUND_DURATION);

        // Round 2 contributions
        vm.prank(participant1);
        if (groupInfo.token_address == address(0)) {
            vm.deal(participant1, CONTRIBUTION_AMOUNT);
            rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);
        } else {
            rosca.contribute(groupId);
        }

        vm.prank(organizer);
        if (groupInfo.token_address == address(0)) {
            vm.deal(organizer, CONTRIBUTION_AMOUNT);
            rosca.contribute{value: CONTRIBUTION_AMOUNT}(groupId);
        } else {
            rosca.contribute(groupId);
        }

        // Claim second (round 2, index 1: participant1)
        vm.prank(participant1);
        rosca.claim_payout(groupId);
    }
}