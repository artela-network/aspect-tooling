// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Royale {
    uint8 public constant MAP_WIDTH = 10;
    uint8 public constant MAP_HEIGHT = 10;
    uint8 public constant TILE_COUNT = MAP_WIDTH * MAP_HEIGHT;
    uint8 public constant PLAYER_COUNT = 10;
    uint64 public constant MAX_ROOM_NUMBER = 10;

    enum Dir {
        DOWN,
        LEFT,
        UP,
        RIGHT
    }

    struct Score {
        address player;
        uint256 score;
    }

    struct Room {
        address[PLAYER_COUNT] players;
        // The game board, each tile is represented by a uint8
        // If the uint8 is 0, the tile is empty
        // If the uint8 is non-zero, the tile is occupied by a player
        uint8[TILE_COUNT] board;
        uint256[PLAYER_COUNT] playerLastMoved;
    }

    struct GameStatus {
        // The player's score
        uint256 score;

        // The game board, each tile is represented by a uint8
        uint8[TILE_COUNT] board;
    }

    event Scored(address player, uint256 score);

    // Quick lookup for player's wallet owner
    // key: player burnable address wallet address
    // value: player's actual wallet address
    mapping(address => address) public walletOwner;

    // Quick lookup for player's used burnable wallets
    // this is just for dealing with some case that the indexing service failed to process event,
    // so we can manually check the players scores
    // key: player's actual wallet address
    // value: array of player's burnable wallet addresses
    mapping(address => address[]) public ownedWallets;

    // Quick lookup for player position in a room
    // key: first 64 bit for room id, next 8 bit for player id
    // value: player position tile number
    mapping(uint128 => uint8) public playerPositions;

    // Quick lookup for player scores
    // key: player address
    // value: player score
    mapping(address => uint256) public scores;

    // Quick lookup for the room that a player has joined
    // key: player address
    // value: room id
    mapping(address => uint64) public playerRoomId;

    // Room info
    // key: room id
    // value: room info
    Room[MAX_ROOM_NUMBER] private rooms;

    // Quick lookup for the player's address in a room
    // key: [64 Bit Room ID][8 Bit Player RoomId][24 Bit Empty]
    // value: player's actual address
    mapping(uint128 => address) public playerRoomIdReverseIndex;

    // Quick lookup for the player's room id in a room
    // key: [64 Bit Room ID][160 Bit Player Address]
    // value: player's id in the room
    mapping(uint256 => uint8) public playerRoomIdIndex;

    // owner of the contract
    address private owner;

    // max room enabled
    uint64 public maxRoomEnabled = 3;

    constructor() {
        owner = msg.sender;
    }

    function setMaxRoomEnabled(uint64 _maxRoomEnabled) public {
        require(msg.sender == owner, "not owner");
        require(_maxRoomEnabled <= MAX_ROOM_NUMBER, "exceed max room number");
        maxRoomEnabled = _maxRoomEnabled;
    }

    function isOwner(address user) external view returns (bool result) {
        return user == owner;
    }

    function join() public {
        require(playerRoomId[msg.sender] == 0, "already joined another room");

        // copy the storage to stack
        (uint64 availableRoom, uint8 slot) = _getAvailableRoomAndSlot();
        require(availableRoom > 0 && slot > 0, "all rooms are full");

        // join the available room
        _join(availableRoom, slot);
    }

    function getAvailableRoomAndSlot() public view returns (uint64 roomId, uint8 slot) {
        return _getAvailableRoomAndSlot();
    }

    function _getAvailableRoomAndSlot() private view returns (uint64 roomId, uint8 slot) {
        for (uint64 i = 0; i < MAX_ROOM_NUMBER; ++i) {
            // find a room with empty slot
            Room storage room = rooms[i];
            for (uint8 j = 0; j < maxRoomEnabled; ++j) {
                // find a room with empty slot or with stale player
                if (room.players[j] == address(0) || _isStale(room.playerLastMoved[j])) {
                    return (i + 1, j + 1);
                }
            }
        }
        return (0, 0);
    }

    function _isStale(uint256 lastMovedTime) private view returns (bool) {
        return (lastMovedTime + 15 minutes) < block.timestamp;
    }

    function _join(uint64 roomId, uint8 slot) private {
        // find an empty slot in the room
        Room storage room = rooms[roomId - 1];
        address[PLAYER_COUNT] memory playersInRoom = room.players;
        uint8 playerIdInRoom = 0;

        if (slot > 0) {
            // slot specified, check if the slot is empty
            require(slot <= PLAYER_COUNT, "invalid slot");
            address slotOccupant = playersInRoom[slot - 1];
            if (slotOccupant == address(0)) {
                room.players[slot - 1] = msg.sender;
                playerIdInRoom = slot;
            } else if (_isStale(room.playerLastMoved[slot - 1])) {
                // for the stale player, remove it first from the room
                _removePlayerFromRoom(room, roomId, slot);
                room.players[slot - 1] = msg.sender;
                playerIdInRoom = slot;
            } else {
                revert("slot is occupied");
            }
        } else {
            // slot not specified, find an empty slot in the room
            for (uint8 i = 0; i < PLAYER_COUNT; ++i) {
                if (playersInRoom[i] == address(0)) {
                    room.players[i] = msg.sender;
                    playerIdInRoom = i + 1;
                    break;
                } else if (_isStale(room.playerLastMoved[i])) {
                    // if the player hasn't moved for 1 minute, remove the player from the room
                    _removePlayerFromRoom(room, roomId, i + 1);
                    room.players[i] = msg.sender;
                    playerIdInRoom = i + 1;
                    break;
                }
            }
        }

        // still cannot find a slot for the player
        require(playerIdInRoom > 0, "room is full");

        // join the room
        playerRoomId[msg.sender] = roomId;
        playerRoomIdIndex[buildPlayerAddressIndex(roomId, msg.sender)] = playerIdInRoom;
        playerRoomIdReverseIndex[buildPlayerRoomIdIndex(roomId, playerIdInRoom)] = msg.sender;

        // This move will just assign a random position to the player, but not move it
        _move(roomId, playerIdInRoom, Dir.UP);
    }

    function buildPlayerRoomIdIndex(uint64 roomId, uint8 playerIdInRoom) private pure returns (uint128) {
        return (uint128(roomId) << 64) | (uint128(playerIdInRoom) << 24);
    }

    function buildPlayerAddressIndex(uint64 roomId, address playerAddress) private pure returns (uint256) {
        return (uint256(roomId) << 192) | (uint256(uint160(playerAddress)));
    }

    function generateRandomPosition(uint256 salt) private view returns (uint8) {
        return uint8(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, salt))) % TILE_COUNT) + 1;
    }

    function registerWalletOwner(address ownerAddress) public {
        walletOwner[msg.sender] = ownerAddress;
        ownedWallets[ownerAddress].push(msg.sender);
    }

    function getWalletOwner(address wallet) public view returns (address) {
        return walletOwner[wallet];
    }

    function getOwnedWallets(address ownerAddress) public view returns (address[] memory) {
        return ownedWallets[ownerAddress];
    }

    function getAllRooms() public view returns (Room[MAX_ROOM_NUMBER] memory) {
        return rooms;
    }

    function resetAllRooms() public {
        // just in case if there is some bug we cannot fix, or all rooms are occupied by zombies
        require(msg.sender == owner, "not owner");
        for (uint64 i = 0; i < MAX_ROOM_NUMBER; ++i) {
            _resetRoom(i + 1);
        }
    }

    function resetRoom(uint64 roomId) public {
        // just in case if there is some bug we cannot fix, or a single room are occupied by zombies
        require(msg.sender == owner, "not owner");
        require(roomId <= MAX_ROOM_NUMBER && roomId > 0, "invalid room id");

        _resetRoom(roomId);
    }

    function _resetRoom(uint64 roomId) private {
        Room storage room = rooms[roomId - 1];
        for (uint8 i = 0; i < PLAYER_COUNT; ++i) {
            address player = room.players[i];
            if (player != address(0)) {
                _removePlayerFromRoom(room, roomId, i + 1);
            }
        }
        delete room.players;
        delete room.board;
        delete room.playerLastMoved;
    }

    function _move(uint64 roomId, uint8 playerIdInRoom, Dir dir) private {
        uint128 playerRoomIdIndexKey = buildPlayerRoomIdIndex(roomId, playerIdInRoom);
        uint8 currentPosition = playerPositions[playerRoomIdIndexKey];
        Room storage room = rooms[roomId - 1];
        room.playerLastMoved[playerIdInRoom - 1] = block.timestamp;
        uint8[TILE_COUNT] storage board = room.board;
        if (currentPosition == 0) {
            // Assign a random position if the player doesn't exist on the board
            uint256 salt = 0;
            uint8 newPosition = generateRandomPosition(salt++);
            while (board[newPosition - 1] != 0) {
                // Keep generating a new position until we find an empty tile
                newPosition = generateRandomPosition(salt++);
            }
            playerPositions[playerRoomIdIndexKey] = newPosition;
            board[newPosition - 1] = playerIdInRoom;
        } else {
            // Calculate new position based on direction
            uint8 newPosition = calculateNewPosition(currentPosition, dir);
            if (currentPosition == newPosition) {
                // if the new position is the same as the current position, do nothing
                return;
            }

            // if the tile was occupied, remove the previous occupant
            uint8 tileOccupant = board[newPosition - 1];
            if (tileOccupant != 0) {
                // remove the previous occupant out of the board and room
                _removePlayerFromRoom(room, roomId, tileOccupant);

                // update the killer's score and emit event
                emit Scored(walletOwner[msg.sender], ++scores[msg.sender]);
            }

            // set the player to the new position
            board[currentPosition - 1] = 0;
            board[newPosition - 1] = playerIdInRoom;
            playerPositions[playerRoomIdIndexKey] = newPosition;
        }
    }

    function _removePlayerFromRoom(Room storage room, uint64 roomId, uint8 playerIdInRoom) private {
        uint128 playerRoomIdIndexKey = buildPlayerRoomIdIndex(roomId, playerIdInRoom);
        uint8 playerPosition = playerPositions[playerRoomIdIndexKey];
        delete playerPositions[playerRoomIdIndexKey];
        delete room.players[playerIdInRoom - 1];
        delete room.board[playerPosition - 1];
        delete room.playerLastMoved[playerIdInRoom - 1];
        address playerAddress = playerRoomIdReverseIndex[playerRoomIdIndexKey];
        delete playerRoomIdReverseIndex[playerRoomIdIndexKey];
        delete playerRoomIdIndex[buildPlayerAddressIndex(roomId, playerAddress)];
        delete playerRoomId[playerAddress];
    }

    function move(uint64 roomId, Dir dir) public {
        require(roomId <= maxRoomEnabled && roomId > 0, "invalid room id");

        uint64 joinedRoom = playerRoomId[msg.sender];
        require(joinedRoom == 0 || roomId == joinedRoom, "already joined another room");
        if (joinedRoom == 0) {
            // join the given room if not joined
            // note this might fail if the room is full
            _join(roomId, 0);
        } else {
            // move the player
            uint8 playerIdInRoom = playerRoomIdIndex[buildPlayerAddressIndex(roomId, msg.sender)];
            _move(roomId, playerIdInRoom, dir);
        }
    }

    function getJoinedRoom() public view returns (uint64) {
        return playerRoomId[msg.sender];
    }

    function getGameStatus() public view returns (GameStatus memory) {
        uint64 roomId = playerRoomId[msg.sender];
        if (roomId == 0) {
            uint8[TILE_COUNT] memory board;
            return GameStatus(scores[msg.sender], board);
        }
        return GameStatus(scores[msg.sender], rooms[roomId - 1].board);
    }

    function getBoardByRoom(uint64 roomId) public view returns (uint8[TILE_COUNT] memory) {
        require(roomId <= MAX_ROOM_NUMBER && roomId > 0, "invalid room id");
        return rooms[roomId - 1].board;
    }

    function getMyPosition() public view returns (uint8) {
        uint64 roomId = playerRoomId[msg.sender];
        if (roomId == 0) {
            return 0;
        }
        uint8 playerIdInRoom = playerRoomIdIndex[buildPlayerAddressIndex(roomId, msg.sender)];
        uint128 playerRoomIdIndexKey = buildPlayerRoomIdIndex(roomId, playerIdInRoom);
        return playerPositions[playerRoomIdIndexKey];
    }

    function getScore(address player) public view returns (uint256) {
        return scores[player];
    }

    function calculateNewPosition(
        uint8 currentPosition,
        Dir dir
    ) private pure returns (uint8) {
        uint8 arrayPosition = currentPosition - 1;

        if (dir == Dir.DOWN) {
            uint8 newPosition = arrayPosition + MAP_WIDTH;
            return newPosition < TILE_COUNT ? (newPosition + 1) : currentPosition;
        } else if (dir == Dir.LEFT) {
            return arrayPosition % MAP_WIDTH == 0 ? currentPosition : currentPosition - 1;
        } else if (dir == Dir.UP) {
            return arrayPosition < MAP_WIDTH ? currentPosition : currentPosition - MAP_WIDTH;
        } else if (dir == Dir.RIGHT) {
            return (arrayPosition + 1) % MAP_WIDTH == 0 ? currentPosition : currentPosition + 1;
        }

        return currentPosition;
    }

    function getPlayerRoomId(address player) public view returns (uint64) {
        return playerRoomId[player];
    }

    function getPlayerNumberInRoom(address player) public view returns (uint8) {
        uint64 roomId = playerRoomId[player];
        if (roomId == 0) {
            return 0;
        }
        uint8 playerIdInRoom = playerRoomIdIndex[buildPlayerAddressIndex(roomId, player)];
        return playerIdInRoom;
    }

    function getPlayerByPosition(
        uint64 roomId,
        uint8 position
    ) private view returns (address) {
        uint8 playerIdInRoom = rooms[roomId].board[position];
        if (playerIdInRoom == 0) {
            return address(0);
        }

        uint128 playerRoomIdIndexKey = buildPlayerRoomIdIndex(roomId, playerIdInRoom);
        return playerRoomIdReverseIndex[playerRoomIdIndexKey];
    }
}
