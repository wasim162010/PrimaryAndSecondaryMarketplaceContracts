/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IFactoryERC1155,
  IFactoryERC1155Interface,
} from "../IFactoryERC1155";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "uri",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "MintedERC1155",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "mint1155",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IFactoryERC1155__factory {
  static readonly abi = _abi;
  static createInterface(): IFactoryERC1155Interface {
    return new utils.Interface(_abi) as IFactoryERC1155Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IFactoryERC1155 {
    return new Contract(address, _abi, signerOrProvider) as IFactoryERC1155;
  }
}
