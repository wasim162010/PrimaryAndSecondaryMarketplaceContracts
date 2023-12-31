/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface IBestOfferPrimaryInterface extends ethers.utils.Interface {
  functions: {
    "acceptOffer(uint256,uint256,address,bytes)": FunctionFragment;
    "listOfferItem(address,uint128,uint128,uint16,uint8,string,bytes)": FunctionFragment;
    "unlistOfferItem(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "acceptOffer",
    values: [BigNumberish, BigNumberish, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "listOfferItem",
    values: [
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      string,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "unlistOfferItem",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "acceptOffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "listOfferItem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unlistOfferItem",
    data: BytesLike
  ): Result;

  events: {
    "AcceptedOffer(uint256,address,uint256)": EventFragment;
    "ListedOffer(address,uint256)": EventFragment;
    "UnlistedOffer(uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AcceptedOffer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ListedOffer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UnlistedOffer"): EventFragment;
}

export type AcceptedOfferEvent = TypedEvent<
  [BigNumber, string, BigNumber] & {
    offerItemId: BigNumber;
    buyer: string;
    price: BigNumber;
  }
>;

export type ListedOfferEvent = TypedEvent<
  [string, BigNumber] & { account: string; offerItemId: BigNumber }
>;

export type UnlistedOfferEvent = TypedEvent<
  [BigNumber, BigNumber] & { offerItemId: BigNumber; tokenId: BigNumber }
>;

export class IBestOfferPrimary extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IBestOfferPrimaryInterface;

  functions: {
    acceptOffer(
      itemId: BigNumberish,
      bid: BigNumberish,
      buyer: string,
      signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    listOfferItem(
      asset: string,
      tokenId: BigNumberish,
      amount: BigNumberish,
      feeNumerator: BigNumberish,
      assetType: BigNumberish,
      uri: string,
      signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unlistOfferItem(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  acceptOffer(
    itemId: BigNumberish,
    bid: BigNumberish,
    buyer: string,
    signature: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  listOfferItem(
    asset: string,
    tokenId: BigNumberish,
    amount: BigNumberish,
    feeNumerator: BigNumberish,
    assetType: BigNumberish,
    uri: string,
    signature: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unlistOfferItem(
    itemId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    acceptOffer(
      itemId: BigNumberish,
      bid: BigNumberish,
      buyer: string,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    listOfferItem(
      asset: string,
      tokenId: BigNumberish,
      amount: BigNumberish,
      feeNumerator: BigNumberish,
      assetType: BigNumberish,
      uri: string,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    unlistOfferItem(
      itemId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AcceptedOffer(uint256,address,uint256)"(
      offerItemId?: BigNumberish | null,
      buyer?: null,
      price?: null
    ): TypedEventFilter<
      [BigNumber, string, BigNumber],
      { offerItemId: BigNumber; buyer: string; price: BigNumber }
    >;

    AcceptedOffer(
      offerItemId?: BigNumberish | null,
      buyer?: null,
      price?: null
    ): TypedEventFilter<
      [BigNumber, string, BigNumber],
      { offerItemId: BigNumber; buyer: string; price: BigNumber }
    >;

    "ListedOffer(address,uint256)"(
      account?: string | null,
      offerItemId?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { account: string; offerItemId: BigNumber }
    >;

    ListedOffer(
      account?: string | null,
      offerItemId?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { account: string; offerItemId: BigNumber }
    >;

    "UnlistedOffer(uint256,uint256)"(
      offerItemId?: BigNumberish | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { offerItemId: BigNumber; tokenId: BigNumber }
    >;

    UnlistedOffer(
      offerItemId?: BigNumberish | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { offerItemId: BigNumber; tokenId: BigNumber }
    >;
  };

  estimateGas: {
    acceptOffer(
      itemId: BigNumberish,
      bid: BigNumberish,
      buyer: string,
      signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    listOfferItem(
      asset: string,
      tokenId: BigNumberish,
      amount: BigNumberish,
      feeNumerator: BigNumberish,
      assetType: BigNumberish,
      uri: string,
      signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unlistOfferItem(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    acceptOffer(
      itemId: BigNumberish,
      bid: BigNumberish,
      buyer: string,
      signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    listOfferItem(
      asset: string,
      tokenId: BigNumberish,
      amount: BigNumberish,
      feeNumerator: BigNumberish,
      assetType: BigNumberish,
      uri: string,
      signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unlistOfferItem(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
