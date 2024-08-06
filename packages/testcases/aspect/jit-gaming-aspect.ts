import {
    allocate,
    entryPoint,
    execute,
    BigInt,
    BytesData,
    ethereum,
    hexToUint8Array,
    IAspectOperation,
    IPostContractCallJP,
    JitCallBuilder,
    OperationInput,
    PostContractCallInput,
    stringToUint8Array,
    sys,
    uint8ArrayToHex,
    uint8ArrayToString,
    InitInput,
} from "@artela/aspect-libs";
import { Protobuf } from "as-proto/assembly/Protobuf";

/**
 * There are two types of Aspect: Transaction-Level Aspect and Block-Level Aspect.
 * Transaction-Level Aspect will be triggered whenever there is a transaction calling the bound smart contract.
 * Block-Level Aspect will be triggered whenever there is a new block generated.
 *
 * An Aspect can be Transaction-Level, Block-Level,IAspectOperation or both.
 * You can implement corresponding interfaces: IAspectTransaction, IAspectBlock,IAspectOperation or both to tell Artela which
 * type of Aspect you are implementing.
 */
export class JITGamingAspect implements IPostContractCallJP, IAspectOperation {

    static readonly SYS_PLAYER_STORAGE_KEY: string = 'SYS_PLAYER_STORAGE_KEY';

    static readonly UNASSIGNED_SYS_PLAYER_STORAGE_KEY: string = 'UNASSIGNED_SYS_PLAYER_STORAGE_KEY';

    static readonly SYS_PLAYER_ROOM_KEY: string = 'SYS_PLAYER_ROOM_KEY';

    init(input: InitInput): void { }

    postContractCall(input: PostContractCallInput): void {
        let calldata = uint8ArrayToHex(input.call!.data);
        let method = this.parseCallMethod(calldata);

        // if method is 'move(uint64,uint8)'
        if (method == "0x72d7d60c") {
            let currentCaller = uint8ArrayToHex(input.call!.from);
            let sysPlayers = this.getSysPlayersList();
            let isSysPlayer = sysPlayers.includes(this.rmPrefix(currentCaller).toLowerCase());

            // if player moves, sys players also move just-in-time
            if (!isSysPlayer) {
                const roomId = this.extractRoomId(input.call!.data);
                const sysPlayer = this.getSysPlayerAccount(roomId)
                if (sysPlayer == "") {
                    // no free sys player, do nothing
                    return;
                }

                // do jit-call
                this.doMove(sysPlayer, roomId, input);
            } else {
                // if sys player moves, do nothing in Aspect and pass the join point
                return;
            }
        }

    }

    extractRoomId(callData: Uint8Array): u64 {
        let roomId = u64.parse(uint8ArrayToHex(callData.subarray(28, 36)));
        return roomId;
    }

    getSysPlayerAccount(roomId: u64): string {
        const storageRef = sys.aspect.mutableState.get<Uint8Array>(`${JITGamingAspect.SYS_PLAYER_ROOM_KEY}:${roomId.toString()}`);
        let sysPlayerInRoom = uint8ArrayToHex(storageRef.unwrap());
        if (!sysPlayerInRoom.length) {
            // no one in the room, got assign one of the unassigned sys players to the room
            const unassignedSysPlayers = sys.aspect.mutableState.get<Uint8Array>(JITGamingAspect.UNASSIGNED_SYS_PLAYER_STORAGE_KEY);
            const encodedUnassignedSysPlayers = uint8ArrayToHex(unassignedSysPlayers.unwrap());
            if (encodedUnassignedSysPlayers.length < 44) {
                // no free sys player
                sys.log("no free sys player");
                return ""
            }

            const count = encodedUnassignedSysPlayers.slice(0, 4);
            const encodedDataLen = encodedUnassignedSysPlayers.length;
            sysPlayerInRoom = encodedUnassignedSysPlayers.slice(encodedDataLen - 40, encodedDataLen);

            // update the unassigned players
            const newCount = BigInt.fromString(count, 16).toInt32() - 1;
            const newEncodedUnassignedSysPlayers = this.rmPrefix(newCount.toString(16)).padStart(4, '0') + encodedUnassignedSysPlayers.slice(4, encodedDataLen - 40);
            unassignedSysPlayers.set(hexToUint8Array(newEncodedUnassignedSysPlayers));

            // update the sys player in room
            storageRef.set(hexToUint8Array(sysPlayerInRoom));
        }

        return sysPlayerInRoom;
    }

    operation(input: OperationInput): Uint8Array {
        // calldata encode rule
        // * 2 bytes: op code
        //      op codes lists:
        //           0x0001 | registerSysPlayer
        //
        //           ** 0x10xx means read only op **
        //           0x1001 | getSysPlayers
        //           0x1002 | getAAWaletNonce
        //
        // * variable-length bytes: params
        //      encode rule of params is defined by each method
        const calldata = uint8ArrayToHex(input.callData);
        const op = this.parseOP(calldata);
        const params = this.parsePrams(calldata);

        if (op == "0001") {
            this.registerSysPlayer(params);
            return new Uint8Array(0);
        }
        if (op == "1001") {
            let ret = this.getSysPlayers();
            return stringToUint8Array(ret);
        }
        if (op == "1002") {
            let ret = this.getSysPlayerInRoom(BigInt.fromString(params, 16).toUInt64());
            return stringToUint8Array(ret);
        }

        sys.revert("unknown op");
        return new Uint8Array(0);
    }

    //****************************
    // internal methods
    //****************************
    doMove(sysPlayer: string, roomId: u64, input: PostContractCallInput): void {
        // init jit call
        let direction = this.getRandomDirection(input);

        let moveCalldata = ethereum.abiEncode('move', [
            ethereum.Number.fromU64(roomId, 64),
            ethereum.Number.fromU8(direction, 8)
        ]);

        // Construct a JIT request (similar to the user operation defined in EIP-4337)
        let request = JitCallBuilder.simple(
            hexToUint8Array(sysPlayer),
            input.call!.to,
            hexToUint8Array(moveCalldata)
        ).build();

        // Submit the JIT call
        let response = sys.hostApi.evmCall.jitCall(request);

        // Verify successful submission of the call,
        // call may fail if room is full
        if (!response.success) {
            sys.log(`Failed to submit the JIT call: ${sysPlayer}, err: ${response.errorMsg}, ret: ${uint8ArrayToString(response.ret)}`);
        } else {
            sys.log(`Successfully submitted the JIT call: ${sysPlayer}, ret: ${uint8ArrayToString(response.ret)}`);
        }
    }

    getRandomDirection(input: PostContractCallInput): u8 {
        const rawHash = sys.hostApi.runtimeContext.get('tx.hash');
        var hash = Protobuf.decode<BytesData>(rawHash, BytesData.decode).data;
        let random = uint8ArrayToHex(hash.slice(4, 6));
        return <u8>(BigInt.fromString(random, 16).toUInt64() % 4);
    }

    parseCallMethod(calldata: string): string {
        if (calldata.startsWith('0x')) {
            return calldata.substring(0, 10);
        }
        return '0x' + calldata.substring(0, 8);
    }

    parseOP(calldata: string): string {
        if (calldata.startsWith('0x')) {
            return calldata.substring(2, 6);
        } else {
            return calldata.substring(0, 4);
        }
    }

    parsePrams(calldata: string): string {
        if (calldata.startsWith('0x')) {
            return calldata.substring(6, calldata.length);
        } else {
            return calldata.substring(4, calldata.length);
        }
    }

    rmPrefix(data: string): string {
        if (data.startsWith('0x')) {
            return data.substring(2, data.length);
        } else {
            return data;
        }
    }

    registerSysPlayer(params: string): void {
        this.saveSysPlayer(params, JITGamingAspect.SYS_PLAYER_STORAGE_KEY);
        this.saveSysPlayer(params, JITGamingAspect.UNASSIGNED_SYS_PLAYER_STORAGE_KEY);
    }

    private saveSysPlayer(params: string, storagePrefix: string): void {
        // params encode rules:
        //     20 bytes: player address
        //         eg. e2f8857467b61f2e4b1a614a0d560cd75c0c076f

        sys.require(params.length == 40, "illegal params");
        const player = params.slice(0, 40);

        let sysPlayersKey = sys.aspect.mutableState.get<Uint8Array>(storagePrefix);
        let encodeSysPlayers = uint8ArrayToHex(sysPlayersKey.unwrap());
        if (encodeSysPlayers == "") {
            let count = "0001";
            encodeSysPlayers = count + player;
        } else {
            let encodeCount = encodeSysPlayers.slice(0, 4);
            let count = BigInt.fromString(encodeCount, 16).toInt32();

            count++;
            encodeCount = this.rmPrefix(count.toString(16)).padStart(4, '0');

            encodeSysPlayers = encodeCount + encodeSysPlayers.slice(4, encodeSysPlayers.length) + player;
        }

        sysPlayersKey.set(hexToUint8Array(encodeSysPlayers));
    }

    getSysPlayers(): string {
        return uint8ArrayToHex(sys.aspect.mutableState.get<Uint8Array>(JITGamingAspect.SYS_PLAYER_STORAGE_KEY).unwrap());
    }

    getSysPlayerInRoom(roomId: u64): string {
        return uint8ArrayToHex(sys.aspect.mutableState.get<Uint8Array>(`${JITGamingAspect.SYS_PLAYER_ROOM_KEY}:${roomId.toString()}`).unwrap());
    }

    getSysPlayersList(): Array<string> {
        let sysPlayersKey = sys.aspect.mutableState.get<Uint8Array>(JITGamingAspect.SYS_PLAYER_STORAGE_KEY);
        let encodeSysPlayers = uint8ArrayToHex(sysPlayersKey.unwrap());

        let encodeCount = encodeSysPlayers.slice(0, 4);
        let count = BigInt.fromString(encodeCount, 16).toInt32();
        const array = new Array<string>();
        encodeSysPlayers = encodeSysPlayers.slice(4);
        for (let i = 0; i < count; ++i) {
            array[i] = encodeSysPlayers.slice(40 * i, 40 * (i + 1)).toLowerCase();
        }

        return array;
    }


    //****************************
    // unused methods
    //****************************

    isOwner(sender: Uint8Array): bool {
        return false;
    }
}

// 2.register aspect Instance
const aspect = new JITGamingAspect()
entryPoint.setAspect(aspect)
entryPoint.setOperationAspect(aspect)

// 3.must export it
export { execute, allocate }