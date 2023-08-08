/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Factory, FactoryInterface } from "../Factory";

const _abi = [
  {
    inputs: [],
    name: "InvalidSignature",
    type: "error",
  },
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: true,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "MintedERC721",
    type: "event",
  },
  {
    inputs: [],
    name: "amountERC1155",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "amountERC721",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "assetERC1155",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "assetERC721",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "assetsERC1155",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "assetsERC721",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "assetERC721_",
        type: "address",
      },
      {
        internalType: "address",
        name: "assetERC1155_",
        type: "address",
      },
      {
        internalType: "address",
        name: "marketplace_",
        type: "address",
      },
      {
        internalType: "address",
        name: "validator_",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "marketplace",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
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
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "mint721",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "validator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611ef0806100206000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c80634e134da3116100715780634e134da31461018f57806391f7b622146101bf5780639c4638f4146101dd578063abc8c7af146101fb578063f8c8765e14610219578063ff02c8df14610235576100b4565b806301ffc9a7146100b9578063067d2c3d146100e9578063361dd655146101075780633a5381b5146101375780633d376c4d14610155578063498c73b714610171575b600080fd5b6100d360048036038101906100ce919061141d565b610251565b6040516100e09190611823565b60405180910390f35b6100f1610333565b6040516100fe9190611808565b60405180910390f35b610121600480360381019061011c9190611549565b61035d565b60405161012e9190611808565b60405180910390f35b61013f6103cb565b60405161014c9190611808565b60405180910390f35b61016f600480360381019061016a9190611446565b6103f5565b005b61017961062d565b6040516101869190611808565b60405180910390f35b6101a960048036038101906101a49190611549565b610657565b6040516101b69190611808565b60405180910390f35b6101c76106c5565b6040516101d491906119d4565b60405180910390f35b6101e56106cf565b6040516101f291906119d4565b60405180910390f35b6102036106d9565b6040516102109190611808565b60405180910390f35b610233600480360381019061022e91906113ba565b610703565b005b61024f600480360381019061024a91906114b2565b6108ef565b005b60007fff02c8df000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061031c57507f3d376c4d000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b8061032c575061032b82610ae6565b5b9050919050565b6000603760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600060358281548110610399577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b6000603a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000823360405160200161040a929190611761565b60405160208183030381529060405280519060200120905061042c8183610b50565b60006040518060400160405280600b81526020017f61757468696320636f6c6c00000000000000000000000000000000000000000081525084604051602001610476929190611789565b604051602081830303815290604052905060006104b4603860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610bb7565b90508073ffffffffffffffffffffffffffffffffffffffff1663463fd1af8333603960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040518463ffffffff1660e01b815260040161051593929190611883565b600060405180830381600087803b15801561052f57600080fd5b505af1158015610543573d6000803e3d6000fd5b505050506035819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550603660008154809291906105bd90611bf1565b91905055503373ffffffffffffffffffffffffffffffffffffffff16826040516105e7919061174a565b60405180910390207fe115f2e27038ecc20f2b8cdc5ffa096b3ba8eed33b5570dcf98cdf2d8207a2708360405161061e9190611808565b60405180910390a35050505050565b6000603860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600060338281548110610693577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b6000603454905090565b6000603654905090565b6000603960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600060019054906101000a900460ff1661072b5760008054906101000a900460ff1615610734565b610733610c8c565b5b610773576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161076a90611994565b60405180910390fd5b60008060019054906101000a900460ff1615905080156107c3576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b84603760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083603860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082603960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081603a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080156108e85760008060016101000a81548160ff0219169083151502179055505b5050505050565b6000838333604051602001610906939291906117ad565b6040516020818303038152906040528051906020012090506109288183610b50565b6000610955603760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610bb7565b90508073ffffffffffffffffffffffffffffffffffffffff16638f15b414868633603960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040518563ffffffff1660e01b81526004016109b894939291906118c1565b600060405180830381600087803b1580156109d257600080fd5b505af11580156109e6573d6000803e3d6000fd5b505050506033819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060346000815480929190610a6090611bf1565b919050555083604051610a73919061174a565b604051809103902085604051610a89919061174a565b60405180910390203373ffffffffffffffffffffffffffffffffffffffff167f1aa545f6ee137839195cce83837168c920336c73d256fbd55fd41d57db59106684604051610ad79190611808565b60405180910390a45050505050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b610b7d8282603a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610c9d565b610bb3576040517f8baa579f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5050565b60006040517f3d602d80600a3d3981f3363d3d373d3d3d363d7300000000000000000000000081528260601b60148201527f5af43d82803e903d91602b57fd5bf3000000000000000000000000000000000060288201526037816000f0915050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610c87576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c7e90611974565b60405180910390fd5b919050565b6000610c9730610cf1565b15905090565b60008173ffffffffffffffffffffffffffffffffffffffff16610cd184610cc387610d14565b610d4490919063ffffffff16565b73ffffffffffffffffffffffffffffffffffffffff161490509392505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b600081604051602001610d2791906117e2565b604051602081830303815290604052805190602001209050919050565b6000806000610d538585610d6b565b91509150610d6081610dee565b819250505092915050565b600080604183511415610dad5760008060006020860151925060408601519150606086015160001a9050610da18782858561113f565b94509450505050610de7565b604083511415610dde576000806020850151915060408501519050610dd386838361124c565b935093505050610de7565b60006002915091505b9250929050565b60006004811115610e28577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b816004811115610e61577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1415610e6c5761113c565b60016004811115610ea6577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b816004811115610edf577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1415610f20576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f1790611914565b60405180910390fd5b60026004811115610f5a577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b816004811115610f93577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1415610fd4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fcb90611934565b60405180910390fd5b6003600481111561100e577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b816004811115611047577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1415611088576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161107f90611954565b60405180910390fd5b6004808111156110c1577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b8160048111156110fa577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b141561113b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611132906119b4565b60405180910390fd5b5b50565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08360001c111561117a576000600391509150611243565b601b8560ff16141580156111925750601c8560ff1614155b156111a4576000600491509150611243565b6000600187878787604051600081526020016040526040516111c9949392919061183e565b6020604051602081039080840390855afa1580156111eb573d6000803e3d6000fd5b505050602060405103519050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141561123a57600060019250925050611243565b80600092509250505b94509492505050565b60008060007f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60001b841690506000601b60ff8660001c901c61128f9190611a9d565b905061129d8782888561113f565b935093505050935093915050565b60006112be6112b984611a14565b6119ef565b9050828152602081018484840111156112d657600080fd5b6112e1848285611b7e565b509392505050565b60006112fc6112f784611a45565b6119ef565b90508281526020810184848401111561131457600080fd5b61131f848285611b7e565b509392505050565b60008135905061133681611e75565b92915050565b60008135905061134b81611e8c565b92915050565b600082601f83011261136257600080fd5b81356113728482602086016112ab565b91505092915050565b600082601f83011261138c57600080fd5b813561139c8482602086016112e9565b91505092915050565b6000813590506113b481611ea3565b92915050565b600080600080608085870312156113d057600080fd5b60006113de87828801611327565b94505060206113ef87828801611327565b935050604061140087828801611327565b925050606061141187828801611327565b91505092959194509250565b60006020828403121561142f57600080fd5b600061143d8482850161133c565b91505092915050565b6000806040838503121561145957600080fd5b600083013567ffffffffffffffff81111561147357600080fd5b61147f8582860161137b565b925050602083013567ffffffffffffffff81111561149c57600080fd5b6114a885828601611351565b9150509250929050565b6000806000606084860312156114c757600080fd5b600084013567ffffffffffffffff8111156114e157600080fd5b6114ed8682870161137b565b935050602084013567ffffffffffffffff81111561150a57600080fd5b6115168682870161137b565b925050604084013567ffffffffffffffff81111561153357600080fd5b61153f86828701611351565b9150509250925092565b60006020828403121561155b57600080fd5b6000611569848285016113a5565b91505092915050565b61157b81611af3565b82525050565b61159261158d82611af3565b611c3a565b82525050565b6115a181611b05565b82525050565b6115b081611b11565b82525050565b6115c76115c282611b11565b611c4c565b82525050565b60006115d882611a76565b6115e28185611a81565b93506115f2818560208601611b8d565b6115fb81611cc6565b840191505092915050565b600061161182611a76565b61161b8185611a92565b935061162b818560208601611b8d565b80840191505092915050565b6000611644601883611a81565b915061164f82611ce4565b602082019050919050565b6000611667601f83611a81565b915061167282611d0d565b602082019050919050565b600061168a601c83611a92565b915061169582611d36565b601c82019050919050565b60006116ad602283611a81565b91506116b882611d5f565b604082019050919050565b60006116d0601683611a81565b91506116db82611dae565b602082019050919050565b60006116f3602e83611a81565b91506116fe82611dd7565b604082019050919050565b6000611716602283611a81565b915061172182611e26565b604082019050919050565b61173581611b67565b82525050565b61174481611b71565b82525050565b60006117568284611606565b915081905092915050565b600061176d8285611606565b91506117798284611581565b6014820191508190509392505050565b60006117958285611606565b91506117a18284611606565b91508190509392505050565b60006117b98286611606565b91506117c58285611606565b91506117d18284611581565b601482019150819050949350505050565b60006117ed8261167d565b91506117f982846115b6565b60208201915081905092915050565b600060208201905061181d6000830184611572565b92915050565b60006020820190506118386000830184611598565b92915050565b600060808201905061185360008301876115a7565b611860602083018661173b565b61186d60408301856115a7565b61187a60608301846115a7565b95945050505050565b6000606082019050818103600083015261189d81866115cd565b90506118ac6020830185611572565b6118b96040830184611572565b949350505050565b600060808201905081810360008301526118db81876115cd565b905081810360208301526118ef81866115cd565b90506118fe6040830185611572565b61190b6060830184611572565b95945050505050565b6000602082019050818103600083015261192d81611637565b9050919050565b6000602082019050818103600083015261194d8161165a565b9050919050565b6000602082019050818103600083015261196d816116a0565b9050919050565b6000602082019050818103600083015261198d816116c3565b9050919050565b600060208201905081810360008301526119ad816116e6565b9050919050565b600060208201905081810360008301526119cd81611709565b9050919050565b60006020820190506119e9600083018461172c565b92915050565b60006119f9611a0a565b9050611a058282611bc0565b919050565b6000604051905090565b600067ffffffffffffffff821115611a2f57611a2e611c97565b5b611a3882611cc6565b9050602081019050919050565b600067ffffffffffffffff821115611a6057611a5f611c97565b5b611a6982611cc6565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b6000611aa882611b67565b9150611ab383611b67565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611ae857611ae7611c68565b5b828201905092915050565b6000611afe82611b47565b9050919050565b60008115159050919050565b6000819050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b82818337600083830152505050565b60005b83811015611bab578082015181840152602081019050611b90565b83811115611bba576000848401525b50505050565b611bc982611cc6565b810181811067ffffffffffffffff82111715611be857611be7611c97565b5b80604052505050565b6000611bfc82611b67565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611c2f57611c2e611c68565b5b600182019050919050565b6000611c4582611c56565b9050919050565b6000819050919050565b6000611c6182611cd7565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b60008160601b9050919050565b7f45434453413a20696e76616c6964207369676e61747572650000000000000000600082015250565b7f45434453413a20696e76616c6964207369676e6174757265206c656e67746800600082015250565b7f19457468657265756d205369676e6564204d6573736167653a0a333200000000600082015250565b7f45434453413a20696e76616c6964207369676e6174757265202773272076616c60008201527f7565000000000000000000000000000000000000000000000000000000000000602082015250565b7f455243313136373a20637265617465206661696c656400000000000000000000600082015250565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f45434453413a20696e76616c6964207369676e6174757265202776272076616c60008201527f7565000000000000000000000000000000000000000000000000000000000000602082015250565b611e7e81611af3565b8114611e8957600080fd5b50565b611e9581611b1b565b8114611ea057600080fd5b50565b611eac81611b67565b8114611eb757600080fd5b5056fea2646970667358221220589409d0f92a2c1218903e49db0224176c754d67660827a5e1208d58dc2e2e5564736f6c63430008040033";

export class Factory__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Factory> {
    return super.deploy(overrides || {}) as Promise<Factory>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Factory {
    return super.attach(address) as Factory;
  }
  connect(signer: Signer): Factory__factory {
    return super.connect(signer) as Factory__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FactoryInterface {
    return new utils.Interface(_abi) as FactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Factory {
    return new Contract(address, _abi, signerOrProvider) as Factory;
  }
}