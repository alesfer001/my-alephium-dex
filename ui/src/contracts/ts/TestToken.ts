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
  fetchContractState,
  ContractInstance,
  getContractEventsCurrentCount,
} from "@alephium/web3";
import { default as TestTokenContractJson } from "../test/test_token.ral.json";

// Custom types for the contract
export namespace TestTokenTypes {
  export type Fields = {
    symbol: HexString;
    name: HexString;
    decimals: bigint;
    totalSupply: bigint;
  };

  export type State = ContractState<Fields>;
}

class Factory extends ContractFactory<
  TestTokenInstance,
  TestTokenTypes.Fields
> {
  at(address: string): TestTokenInstance {
    return new TestTokenInstance(address);
  }

  async testGetSymbolMethod(
    params: Omit<TestContractParams<TestTokenTypes.Fields, never>, "testArgs">
  ): Promise<TestContractResult<HexString>> {
    return testMethod(this, "getSymbol", params);
  }

  async testGetNameMethod(
    params: Omit<TestContractParams<TestTokenTypes.Fields, never>, "testArgs">
  ): Promise<TestContractResult<HexString>> {
    return testMethod(this, "getName", params);
  }

  async testGetDecimalsMethod(
    params: Omit<TestContractParams<TestTokenTypes.Fields, never>, "testArgs">
  ): Promise<TestContractResult<bigint>> {
    return testMethod(this, "getDecimals", params);
  }

  async testGetTotalSupplyMethod(
    params: Omit<TestContractParams<TestTokenTypes.Fields, never>, "testArgs">
  ): Promise<TestContractResult<bigint>> {
    return testMethod(this, "getTotalSupply", params);
  }

  async testGetTokenMethod(
    params: TestContractParams<
      TestTokenTypes.Fields,
      { sender: HexString; amount: bigint }
    >
  ): Promise<TestContractResult<null>> {
    return testMethod(this, "getToken", params);
  }
}

// Use this object to test and deploy the contract
export const TestToken = new Factory(
  Contract.fromJson(
    TestTokenContractJson,
    "",
    "29cd22f98fcfdc50b1bdd499543d2d9cc013980a66191f62ce7e0189dbf957a0"
  )
);

// Use this class to interact with the blockchain
export class TestTokenInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<TestTokenTypes.State> {
    return fetchContractState(TestToken, this);
  }

  async callGetSymbolMethod(
    params?: Omit<CallContractParams<{}>, "args">
  ): Promise<CallContractResult<HexString>> {
    return callMethod(
      TestToken,
      this,
      "getSymbol",
      params === undefined ? {} : params
    );
  }

  async callGetNameMethod(
    params?: Omit<CallContractParams<{}>, "args">
  ): Promise<CallContractResult<HexString>> {
    return callMethod(
      TestToken,
      this,
      "getName",
      params === undefined ? {} : params
    );
  }

  async callGetDecimalsMethod(
    params?: Omit<CallContractParams<{}>, "args">
  ): Promise<CallContractResult<bigint>> {
    return callMethod(
      TestToken,
      this,
      "getDecimals",
      params === undefined ? {} : params
    );
  }

  async callGetTotalSupplyMethod(
    params?: Omit<CallContractParams<{}>, "args">
  ): Promise<CallContractResult<bigint>> {
    return callMethod(
      TestToken,
      this,
      "getTotalSupply",
      params === undefined ? {} : params
    );
  }
}
