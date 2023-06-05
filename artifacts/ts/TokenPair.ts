/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  SubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  ContractInstance,
  getContractEventsCurrentCount,
} from "@alephium/web3";
import { default as TokenPairContractJson } from "../dex/TokenPair.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace TokenPairTypes {
  export type Fields = {
    tokenPairFactory: HexString;
    token0Id: HexString;
    token1Id: HexString;
    reserve0: bigint;
    reserve1: bigint;
    blockTimeStampLast: bigint;
    price0CumulativeLast: bigint;
    price1CumulativeLast: bigint;
    totalSupply: bigint;
    kLast: bigint;
    feeCollectorId: HexString;
  };

  export type State = ContractState<Fields>;

  export type MintEvent = ContractEvent<{
    sender: Address;
    amount0: bigint;
    amount1: bigint;
    liquidity: bigint;
  }>;
  export type BurnEvent = ContractEvent<{
    sender: Address;
    amount0: bigint;
    amount1: bigint;
    liquidity: bigint;
  }>;
  export type SwapEvent = ContractEvent<{
    sender: Address;
    amount0In: bigint;
    amount1In: bigint;
    amount0Out: bigint;
    amount1Out: bigint;
    to: Address;
  }>;

  export interface CallMethodTable {
    getSymbol: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getName: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getDecimals: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getTotalSupply: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    uqdiv: {
      params: CallContractParams<{ a: bigint; b: bigint }>;
      result: CallContractResult<bigint>;
    };
    sqrt: {
      params: CallContractParams<{ y: bigint }>;
      result: CallContractResult<bigint>;
    };
    getTokenPair: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<[HexString, HexString]>;
    };
    getReserves: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<[bigint, bigint]>;
    };
    getBlockTimeStampLast: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getPrice0CumulativeLast: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getPrice1CumulativeLast: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    mint: {
      params: CallContractParams<{
        sender: Address;
        amount0: bigint;
        amount1: bigint;
      }>;
      result: CallContractResult<bigint>;
    };
    burn: {
      params: CallContractParams<{ sender: Address; liquidity: bigint }>;
      result: CallContractResult<[bigint, bigint]>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
}

class Factory extends ContractFactory<
  TokenPairInstance,
  TokenPairTypes.Fields
> {
  consts = {
    MINIMUM_LIQUIDITY: BigInt(1000),
    ErrorCodes: {
      ReserveOverflow: BigInt(0),
      InsufficientInitLiquidity: BigInt(1),
      InsufficientLiquidityMinted: BigInt(2),
      InsufficientLiquidityBurned: BigInt(3),
      InvalidToAddress: BigInt(4),
      InsufficientLiquidity: BigInt(5),
      InvalidTokenInId: BigInt(6),
      InvalidCalleeId: BigInt(7),
      InvalidK: BigInt(8),
      InsufficientOutputAmount: BigInt(9),
      InsufficientInputAmount: BigInt(10),
      IdenticalTokenIds: BigInt(11),
      Expired: BigInt(12),
      InsufficientToken0Amount: BigInt(13),
      InsufficientToken1Amount: BigInt(14),
      TokenNotExist: BigInt(15),
      InvalidCaller: BigInt(16),
    },
  };

  at(address: string): TokenPairInstance {
    return new TokenPairInstance(address);
  }

  tests = {
    getSymbol: async (
      params: Omit<TestContractParams<TokenPairTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getSymbol", params);
    },
    getName: async (
      params: Omit<TestContractParams<TokenPairTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getName", params);
    },
    getDecimals: async (
      params: Omit<TestContractParams<TokenPairTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getDecimals", params);
    },
    getTotalSupply: async (
      params: Omit<TestContractParams<TokenPairTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getTotalSupply", params);
    },
    uqdiv: async (
      params: TestContractParams<
        TokenPairTypes.Fields,
        { a: bigint; b: bigint }
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "uqdiv", params);
    },
    sqrt: async (
      params: TestContractParams<TokenPairTypes.Fields, { y: bigint }>
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "sqrt", params);
    },
    setFeeCollectorId: async (
      params: TestContractParams<TokenPairTypes.Fields, { id: HexString }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setFeeCollectorId", params);
    },
    getTokenPair: async (
      params: Omit<TestContractParams<TokenPairTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<[HexString, HexString]>> => {
      return testMethod(this, "getTokenPair", params);
    },
    getReserves: async (
      params: Omit<TestContractParams<TokenPairTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<[bigint, bigint]>> => {
      return testMethod(this, "getReserves", params);
    },
    getBlockTimeStampLast: async (
      params: Omit<TestContractParams<TokenPairTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getBlockTimeStampLast", params);
    },
    getPrice0CumulativeLast: async (
      params: Omit<TestContractParams<TokenPairTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getPrice0CumulativeLast", params);
    },
    getPrice1CumulativeLast: async (
      params: Omit<TestContractParams<TokenPairTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getPrice1CumulativeLast", params);
    },
    update: async (
      params: TestContractParams<
        TokenPairTypes.Fields,
        { newReserve0: bigint; newReserve1: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "update", params);
    },
    mintFee: async (
      params: TestContractParams<
        TokenPairTypes.Fields,
        { reserve0_: bigint; reserve1_: bigint }
      >
    ): Promise<TestContractResult<[boolean, bigint]>> => {
      return testMethod(this, "mintFee", params);
    },
    mint: async (
      params: TestContractParams<
        TokenPairTypes.Fields,
        { sender: Address; amount0: bigint; amount1: bigint }
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "mint", params);
    },
    burn: async (
      params: TestContractParams<
        TokenPairTypes.Fields,
        { sender: Address; liquidity: bigint }
      >
    ): Promise<TestContractResult<[bigint, bigint]>> => {
      return testMethod(this, "burn", params);
    },
    swap: async (
      params: TestContractParams<
        TokenPairTypes.Fields,
        {
          sender: Address;
          to: Address;
          amount0In: bigint;
          amount1In: bigint;
          amount0Out: bigint;
          amount1Out: bigint;
        }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "swap", params);
    },
  };
}

// Use this object to test and deploy the contract
export const TokenPair = new Factory(
  Contract.fromJson(
    TokenPairContractJson,
    "",
    "366023ec1b8b80fe3a1c48bca7533c487dd2c044df659b6f1ea0f2c441d7b540"
  )
);

// Use this class to interact with the blockchain
export class TokenPairInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<TokenPairTypes.State> {
    return fetchContractState(TokenPair, this);
  }

  async getContractEventsCurrentCount(): Promise<number> {
    return getContractEventsCurrentCount(this.address);
  }

  subscribeMintEvent(
    options: SubscribeOptions<TokenPairTypes.MintEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      TokenPair.contract,
      this,
      options,
      "Mint",
      fromCount
    );
  }

  subscribeBurnEvent(
    options: SubscribeOptions<TokenPairTypes.BurnEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      TokenPair.contract,
      this,
      options,
      "Burn",
      fromCount
    );
  }

  subscribeSwapEvent(
    options: SubscribeOptions<TokenPairTypes.SwapEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      TokenPair.contract,
      this,
      options,
      "Swap",
      fromCount
    );
  }

  subscribeAllEvents(
    options: SubscribeOptions<
      | TokenPairTypes.MintEvent
      | TokenPairTypes.BurnEvent
      | TokenPairTypes.SwapEvent
    >,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvents(
      TokenPair.contract,
      this,
      options,
      fromCount
    );
  }

  methods = {
    getSymbol: async (
      params?: TokenPairTypes.CallMethodParams<"getSymbol">
    ): Promise<TokenPairTypes.CallMethodResult<"getSymbol">> => {
      return callMethod(
        TokenPair,
        this,
        "getSymbol",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getName: async (
      params?: TokenPairTypes.CallMethodParams<"getName">
    ): Promise<TokenPairTypes.CallMethodResult<"getName">> => {
      return callMethod(
        TokenPair,
        this,
        "getName",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getDecimals: async (
      params?: TokenPairTypes.CallMethodParams<"getDecimals">
    ): Promise<TokenPairTypes.CallMethodResult<"getDecimals">> => {
      return callMethod(
        TokenPair,
        this,
        "getDecimals",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getTotalSupply: async (
      params?: TokenPairTypes.CallMethodParams<"getTotalSupply">
    ): Promise<TokenPairTypes.CallMethodResult<"getTotalSupply">> => {
      return callMethod(
        TokenPair,
        this,
        "getTotalSupply",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    uqdiv: async (
      params: TokenPairTypes.CallMethodParams<"uqdiv">
    ): Promise<TokenPairTypes.CallMethodResult<"uqdiv">> => {
      return callMethod(
        TokenPair,
        this,
        "uqdiv",
        params,
        getContractByCodeHash
      );
    },
    sqrt: async (
      params: TokenPairTypes.CallMethodParams<"sqrt">
    ): Promise<TokenPairTypes.CallMethodResult<"sqrt">> => {
      return callMethod(TokenPair, this, "sqrt", params, getContractByCodeHash);
    },
    getTokenPair: async (
      params?: TokenPairTypes.CallMethodParams<"getTokenPair">
    ): Promise<TokenPairTypes.CallMethodResult<"getTokenPair">> => {
      return callMethod(
        TokenPair,
        this,
        "getTokenPair",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getReserves: async (
      params?: TokenPairTypes.CallMethodParams<"getReserves">
    ): Promise<TokenPairTypes.CallMethodResult<"getReserves">> => {
      return callMethod(
        TokenPair,
        this,
        "getReserves",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getBlockTimeStampLast: async (
      params?: TokenPairTypes.CallMethodParams<"getBlockTimeStampLast">
    ): Promise<TokenPairTypes.CallMethodResult<"getBlockTimeStampLast">> => {
      return callMethod(
        TokenPair,
        this,
        "getBlockTimeStampLast",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getPrice0CumulativeLast: async (
      params?: TokenPairTypes.CallMethodParams<"getPrice0CumulativeLast">
    ): Promise<TokenPairTypes.CallMethodResult<"getPrice0CumulativeLast">> => {
      return callMethod(
        TokenPair,
        this,
        "getPrice0CumulativeLast",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getPrice1CumulativeLast: async (
      params?: TokenPairTypes.CallMethodParams<"getPrice1CumulativeLast">
    ): Promise<TokenPairTypes.CallMethodResult<"getPrice1CumulativeLast">> => {
      return callMethod(
        TokenPair,
        this,
        "getPrice1CumulativeLast",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    mint: async (
      params: TokenPairTypes.CallMethodParams<"mint">
    ): Promise<TokenPairTypes.CallMethodResult<"mint">> => {
      return callMethod(TokenPair, this, "mint", params, getContractByCodeHash);
    },
    burn: async (
      params: TokenPairTypes.CallMethodParams<"burn">
    ): Promise<TokenPairTypes.CallMethodResult<"burn">> => {
      return callMethod(TokenPair, this, "burn", params, getContractByCodeHash);
    },
  };

  async multicall<Calls extends TokenPairTypes.MultiCallParams>(
    calls: Calls
  ): Promise<TokenPairTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      TokenPair,
      this,
      calls,
      getContractByCodeHash
    )) as TokenPairTypes.MultiCallResults<Calls>;
  }
}
