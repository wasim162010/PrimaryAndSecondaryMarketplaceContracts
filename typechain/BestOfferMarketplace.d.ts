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

interface BestOfferMarketplaceInterface extends ethers.utils.Interface {
  functions: {
    "acceptOffer(uint256,uint256,address)": FunctionFragment;
    "comission()": FunctionFragment;
    "initialize(address,uint256,address)": FunctionFragment;
    "listItem(address,uint256,uint256,uint256,uint8,bytes)": FunctionFragment;
    "offerItemId()": FunctionFragment;
    "offerItems(uint256)": FunctionFragment;
    "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)": FunctionFragment;
    "onERC1155Received(address,address,uint256,uint256,bytes)": FunctionFragment;
    "onERC721Received(address,address,uint256,bytes)": FunctionFragment;
    "setComission(uint256)": FunctionFragment;
    "setValidator(address)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "unlistItem(uint256)": FunctionFragment;
    "validator()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "acceptOffer",
    values: [BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "comission", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "listItem",
    values: [
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "offerItemId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "offerItems",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC1155BatchReceived",
    values: [string, string, BigNumberish[], BigNumberish[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC1155Received",
    values: [string, string, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC721Received",
    values: [string, string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setComission",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setValidator",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "unlistItem",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "validator", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "acceptOffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "comission", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "listItem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "offerItemId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "offerItems", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onERC1155BatchReceived",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC1155Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC721Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setComission",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setValidator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unlistItem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "validator", data: BytesLike): Result;

  events: {};
}

export class BestOfferMarketplace extends BaseContract {
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

  interface: BestOfferMarketplaceInterface;

  functions: {
    acceptOffer(
      itemId: BigNumberish,
      bid: BigNumberish,
      buyer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    comission(overrides?: CallOverrides): Promise<[BigNumber]>;

    initialize(
      validator_: string,
      comission_: BigNumberish,
      weth_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    listItem(
      asset: string,
      startPrice: BigNumberish,
      tokenId: BigNumberish,
      amount: BigNumberish,
      assetType: BigNumberish,
      signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    offerItemId(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _value: BigNumber }>;

    offerItems(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber, BigNumber, number, number] & {
        asset: string;
        seller: string;
        tokenId: BigNumber;
        amount: BigNumber;
        assetType: number;
        status: number;
      }
    >;

    onERC1155BatchReceived(
      operator: string,
      from: string,
      ids: BigNumberish[],
      values: BigNumberish[],
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    onERC1155Received(
      _operator: string,
      _from: string,
      _id: BigNumberish,
      _value: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    onERC721Received(
      operator: string,
      from: string,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    setComission(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setValidator(
      validator_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    unlistItem(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    validator(overrides?: CallOverrides): Promise<[string]>;
  };

  acceptOffer(
    itemId: BigNumberish,
    bid: BigNumberish,
    buyer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  comission(overrides?: CallOverrides): Promise<BigNumber>;

  initialize(
    validator_: string,
    comission_: BigNumberish,
    weth_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  listItem(
    asset: string,
    startPrice: BigNumberish,
    tokenId: BigNumberish,
    amount: BigNumberish,
    assetType: BigNumberish,
    signature: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  offerItemId(overrides?: CallOverrides): Promise<BigNumber>;

  offerItems(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string, string, BigNumber, BigNumber, number, number] & {
      asset: string;
      seller: string;
      tokenId: BigNumber;
      amount: BigNumber;
      assetType: number;
      status: number;
    }
  >;

  onERC1155BatchReceived(
    operator: string,
    from: string,
    ids: BigNumberish[],
    values: BigNumberish[],
    data: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  onERC1155Received(
    _operator: string,
    _from: string,
    _id: BigNumberish,
    _value: BigNumberish,
    _data: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  onERC721Received(
    operator: string,
    from: string,
    tokenId: BigNumberish,
    data: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  setComission(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setValidator(
    validator_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  unlistItem(
    itemId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  validator(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    acceptOffer(
      itemId: BigNumberish,
      bid: BigNumberish,
      buyer: string,
      overrides?: CallOverrides
    ): Promise<void>;

    comission(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      validator_: string,
      comission_: BigNumberish,
      weth_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    listItem(
      asset: string,
      startPrice: BigNumberish,
      tokenId: BigNumberish,
      amount: BigNumberish,
      assetType: BigNumberish,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    offerItemId(overrides?: CallOverrides): Promise<BigNumber>;

    offerItems(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber, BigNumber, number, number] & {
        asset: string;
        seller: string;
        tokenId: BigNumber;
        amount: BigNumber;
        assetType: number;
        status: number;
      }
    >;

    onERC1155BatchReceived(
      operator: string,
      from: string,
      ids: BigNumberish[],
      values: BigNumberish[],
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    onERC1155Received(
      _operator: string,
      _from: string,
      _id: BigNumberish,
      _value: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    onERC721Received(
      operator: string,
      from: string,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    setComission(
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setValidator(validator_: string, overrides?: CallOverrides): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    unlistItem(itemId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    validator(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    acceptOffer(
      itemId: BigNumberish,
      bid: BigNumberish,
      buyer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    comission(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      validator_: string,
      comission_: BigNumberish,
      weth_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    listItem(
      asset: string,
      startPrice: BigNumberish,
      tokenId: BigNumberish,
      amount: BigNumberish,
      assetType: BigNumberish,
      signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    offerItemId(overrides?: CallOverrides): Promise<BigNumber>;

    offerItems(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    onERC1155BatchReceived(
      operator: string,
      from: string,
      ids: BigNumberish[],
      values: BigNumberish[],
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    onERC1155Received(
      _operator: string,
      _from: string,
      _id: BigNumberish,
      _value: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    onERC721Received(
      operator: string,
      from: string,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setComission(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setValidator(
      validator_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    unlistItem(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    validator(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    acceptOffer(
      itemId: BigNumberish,
      bid: BigNumberish,
      buyer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    comission(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      validator_: string,
      comission_: BigNumberish,
      weth_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    listItem(
      asset: string,
      startPrice: BigNumberish,
      tokenId: BigNumberish,
      amount: BigNumberish,
      assetType: BigNumberish,
      signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    offerItemId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    offerItems(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    onERC1155BatchReceived(
      operator: string,
      from: string,
      ids: BigNumberish[],
      values: BigNumberish[],
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    onERC1155Received(
      _operator: string,
      _from: string,
      _id: BigNumberish,
      _value: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    onERC721Received(
      operator: string,
      from: string,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setComission(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setValidator(
      validator_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    unlistItem(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    validator(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
