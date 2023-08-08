/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  AuctionMarketplace,
  AuctionMarketplaceInterface,
} from "../AuctionMarketplace";

const _abi = [
  {
    inputs: [],
    name: "auctionItemId",
    outputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "auctionItems",
    outputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "step",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endAuction",
        type: "uint256",
      },
      {
        internalType: "enum AuctionMarketplace.AssetType",
        name: "assetType",
        type: "uint8",
      },
      {
        internalType: "enum AuctionMarketplace.Status",
        name: "status",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
    ],
    name: "cancelAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "comission",
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
    inputs: [
      {
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bid",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "buyer",
        type: "address",
      },
    ],
    name: "finishAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "validator_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "comission_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "weth_",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "startPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "step",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "auctionDuration",
        type: "uint8",
      },
      {
        internalType: "enum AuctionMarketplace.AssetType",
        name: "assetType",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "listAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "setComission",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "validator_",
        type: "address",
      },
    ],
    name: "setValidator",
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
    stateMutability: "pure",
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
  "0x608060405234801561001057600080fd5b50612cd1806100206000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80635e529f961161008c578063c251349811610066578063c251349814610249578063c350a1b514610265578063d2c069f014610281578063f23a6e61146102b8576100ea565b80635e529f96146101e157806396b5a755146101fd578063bc197c8114610219576100ea565b8063150b7a02116100c8578063150b7a02146101575780633a4b4532146101875780633a5381b5146101a557806351629330146101c3576100ea565b806301ffc9a7146100ef5780630be80f391461011f5780631327d3d81461013b575b600080fd5b61010960048036038101906101049190611de0565b6102e8565b60405161011691906122fd565b60405180910390f35b61013960048036038101906101349190611e09565b610339565b005b61015560048036038101906101509190611a5b565b610343565b005b610171600480360381019061016c9190611b50565b610387565b60405161017e919061235d565b60405180910390f35b61018f61039c565b60405161019c91906124f8565b60405180910390f35b6101ad6103a2565b6040516101ba91906121d5565b60405180910390f35b6101cb6103c8565b6040516101d891906124f8565b60405180910390f35b6101fb60048036038101906101f69190611ced565b6103d4565b005b61021760048036038101906102129190611e09565b6106ec565b005b610233600480360381019061022e9190611a84565b61091f565b604051610240919061235d565b60405180910390f35b610263600480360381019061025e9190611e32565b610937565b005b61027f600480360381019061027a9190611c9e565b610b9a565b005b61029b60048036038101906102969190611e09565b610d0a565b6040516102af98979695949392919061227f565b60405180910390f35b6102d260048036038101906102cd9190611bd0565b610dac565b6040516102df919061235d565b60405180910390f35b60006301ffc9a760e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b8060038190555050565b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600063150b7a0260e01b905095945050505050565b60035481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60018060000154905081565b6001600281111561040e577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b826002811115610447577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14156104915760018414610490576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161048790612438565b60405180910390fd5b5b600061049d6001610dc2565b9050600089828a8a8a896040516020016104bc9695949392919061213f565b6040516020818303038152906040528051906020012090506105018184600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610dd0565b610540576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610537906123b8565b60405180910390fd5b61054e878b33308a89610e24565b6000600460008481526020019081526020016000209050848160060160006101000a81548160ff021916908360028111156105b2577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b02179055508a8160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550338160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550878160020181905550868160030181905550888160040181905550620151808660ff1661066a9190612646565b62ffffff164261067a91906125bf565b816005018190555060018160060160016101000a81548160ff021916908360038111156106d0577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b02179055506106df6001610f8b565b5050505050505050505050565b60006004600083815260200190815260200160002090506001600381111561073d577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b8160060160019054906101000a900460ff166003811115610787577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b146107c7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107be906124d8565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff168160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610859576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161085090612458565b60405180910390fd5b6108c881600201548260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16308460010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1685600301548660060160009054906101000a900460ff16610e24565b60038160060160016101000a81548160ff02191690836003811115610916577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b02179055505050565b600063bc197c8160e01b905098975050505050505050565b600060046000858152602001908152602001600020905060016003811115610988577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b8160060160019054906101000a900460ff1660038111156109d2577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14610a12576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a09906124b8565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff168160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610aa4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a9b90612398565b60405180910390fd5b8060050154421015610aeb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ae2906123f8565b60405180910390fd5b610af6848484610fa1565b610b4181600201548260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16308585600301548660060160009054906101000a900460ff16610e24565b60028160060160016101000a81548160ff02191690836003811115610b8f577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b021790555050505050565b600060019054906101000a900460ff16610bc25760008054906101000a900460ff1615610bcb565b610bca6112ec565b5b610c0a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c0190612478565b60405180910390fd5b60008060019054906101000a900460ff161590508015610c5a576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b83600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260038190555081600060026101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508015610d045760008060016101000a81548160ff0219169083151502179055505b50505050565b60046020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154908060030154908060040154908060050154908060060160009054906101000a900460ff16908060060160019054906101000a900460ff16905088565b600063f23a6e6160e01b90509695505050505050565b600081600001549050919050565b60008173ffffffffffffffffffffffffffffffffffffffff16610e0484610df6876112fd565b61132d90919063ffffffff16565b73ffffffffffffffffffffffffffffffffffffffff161490509392505050565b60016002811115610e5e577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b816002811115610e97577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1415610f11578473ffffffffffffffffffffffffffffffffffffffff166323b872dd8585896040518463ffffffff1660e01b8152600401610eda939291906121f0565b600060405180830381600087803b158015610ef457600080fd5b505af1158015610f08573d6000803e3d6000fd5b50505050610f83565b8473ffffffffffffffffffffffffffffffffffffffff1663f242432a858589866040518563ffffffff1660e01b8152600401610f509493929190612227565b600060405180830381600087803b158015610f6a57600080fd5b505af1158015610f7e573d6000803e3d6000fd5b505050505b505050505050565b6001816000016000828254019250508190555050565b60006004600085815260200190815260200160002090506000808260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632a55205a8460020154876040518363ffffffff1660e01b815260040161101e929190612513565b604080518083038186803b15801561103557600080fd5b505afa158015611049573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061106d9190611c62565b809250819350505060006064600354876110879190612683565b6110919190612615565b9050600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd868660010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1684868b61110491906126dd565b61110e91906126dd565b6040518463ffffffff1660e01b815260040161112c939291906121f0565b602060405180830381600087803b15801561114657600080fd5b505af115801561115a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061117e9190611db7565b50600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd8685856040518463ffffffff1660e01b81526004016111de939291906121f0565b602060405180830381600087803b1580156111f857600080fd5b505af115801561120c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112309190611db7565b50600060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd8630846040518463ffffffff1660e01b8152600401611290939291906121f0565b602060405180830381600087803b1580156112aa57600080fd5b505af11580156112be573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112e29190611db7565b5050505050505050565b60006112f730611354565b15905090565b60008160405160200161131091906121af565b604051602081830303815290604052805190602001209050919050565b600080600061133c8585611377565b91509150611349816113fa565b819250505092915050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b6000806041835114156113b95760008060006020860151925060408601519150606086015160001a90506113ad8782858561174b565b945094505050506113f3565b6040835114156113ea5760008060208501519150604085015190506113df868383611858565b9350935050506113f3565b60006002915091505b9250929050565b60006004811115611434577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b81600481111561146d577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b141561147857611748565b600160048111156114b2577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b8160048111156114eb577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b141561152c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161152390612378565b60405180910390fd5b60026004811115611566577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b81600481111561159f577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14156115e0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115d7906123d8565b60405180910390fd5b6003600481111561161a577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b816004811115611653577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1415611694576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161168b90612418565b60405180910390fd5b6004808111156116cd577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b816004811115611706577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1415611747576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161173e90612498565b60405180910390fd5b5b50565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08360001c111561178657600060039150915061184f565b601b8560ff161415801561179e5750601c8560ff1614155b156117b057600060049150915061184f565b6000600187878787604051600081526020016040526040516117d59493929190612318565b6020604051602081039080840390855afa1580156117f7573d6000803e3d6000fd5b505050602060405103519050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156118465760006001925092505061184f565b80600092509250505b94509492505050565b60008060007f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60001b841690506000601b60ff8660001c901c61189b91906125bf565b90506118a98782888561174b565b935093505050935093915050565b60006118ca6118c584612561565b61253c565b9050828152602081018484840111156118e257600080fd5b6118ed8482856127f5565b509392505050565b60008135905061190481612c18565b92915050565b60008151905061191981612c18565b92915050565b60008083601f84011261193157600080fd5b8235905067ffffffffffffffff81111561194a57600080fd5b60208301915083602082028301111561196257600080fd5b9250929050565b60008151905061197881612c2f565b92915050565b60008135905061198d81612c46565b92915050565b60008083601f8401126119a557600080fd5b8235905067ffffffffffffffff8111156119be57600080fd5b6020830191508360018202830111156119d657600080fd5b9250929050565b600082601f8301126119ee57600080fd5b81356119fe8482602086016118b7565b91505092915050565b600081359050611a1681612c5d565b92915050565b600081359050611a2b81612c6d565b92915050565b600081519050611a4081612c6d565b92915050565b600081359050611a5581612c84565b92915050565b600060208284031215611a6d57600080fd5b6000611a7b848285016118f5565b91505092915050565b60008060008060008060008060a0898b031215611aa057600080fd5b6000611aae8b828c016118f5565b9850506020611abf8b828c016118f5565b975050604089013567ffffffffffffffff811115611adc57600080fd5b611ae88b828c0161191f565b9650965050606089013567ffffffffffffffff811115611b0757600080fd5b611b138b828c0161191f565b9450945050608089013567ffffffffffffffff811115611b3257600080fd5b611b3e8b828c01611993565b92509250509295985092959890939650565b600080600080600060808688031215611b6857600080fd5b6000611b76888289016118f5565b9550506020611b87888289016118f5565b9450506040611b9888828901611a1c565b935050606086013567ffffffffffffffff811115611bb557600080fd5b611bc188828901611993565b92509250509295509295909350565b60008060008060008060a08789031215611be957600080fd5b6000611bf789828a016118f5565b9650506020611c0889828a016118f5565b9550506040611c1989828a01611a1c565b9450506060611c2a89828a01611a1c565b935050608087013567ffffffffffffffff811115611c4757600080fd5b611c5389828a01611993565b92509250509295509295509295565b60008060408385031215611c7557600080fd5b6000611c838582860161190a565b9250506020611c9485828601611a31565b9150509250929050565b600080600060608486031215611cb357600080fd5b6000611cc1868287016118f5565b9350506020611cd286828701611a1c565b9250506040611ce3868287016118f5565b9150509250925092565b600080600080600080600080610100898b031215611d0a57600080fd5b6000611d188b828c016118f5565b9850506020611d298b828c01611a1c565b9750506040611d3a8b828c01611a1c565b9650506060611d4b8b828c01611a1c565b9550506080611d5c8b828c01611a1c565b94505060a0611d6d8b828c01611a46565b93505060c0611d7e8b828c01611a07565b92505060e089013567ffffffffffffffff811115611d9b57600080fd5b611da78b828c016119dd565b9150509295985092959890939650565b600060208284031215611dc957600080fd5b6000611dd784828501611969565b91505092915050565b600060208284031215611df257600080fd5b6000611e008482850161197e565b91505092915050565b600060208284031215611e1b57600080fd5b6000611e2984828501611a1c565b91505092915050565b600080600060608486031215611e4757600080fd5b6000611e5586828701611a1c565b9350506020611e6686828701611a1c565b9250506040611e77868287016118f5565b9150509250925092565b611e8a81612711565b82525050565b611ea1611e9c82612711565b612835565b82525050565b611eb081612723565b82525050565b611ebf8161272f565b82525050565b611ed6611ed18261272f565b612847565b82525050565b611ee581612739565b82525050565b611ef4816127d1565b82525050565b611f03816127e3565b82525050565b6000611f166018836125a3565b9150611f2182612966565b602082019050919050565b6000611f396016836125a3565b9150611f448261298f565b602082019050919050565b6000611f5c6011836125a3565b9150611f67826129b8565b602082019050919050565b6000611f7f601f836125a3565b9150611f8a826129e1565b602082019050919050565b6000611fa2601c836125b4565b9150611fad82612a0a565b601c82019050919050565b6000611fc5601a836125a3565b9150611fd082612a33565b602082019050919050565b6000611fe86022836125a3565b9150611ff382612a5c565b604082019050919050565b600061200b601f836125a3565b915061201682612aab565b602082019050919050565b600061202e6015836125a3565b915061203982612ad4565b602082019050919050565b6000612051602e836125a3565b915061205c82612afd565b604082019050919050565b60006120746022836125a3565b915061207f82612b4c565b604082019050919050565b60006120976016836125a3565b91506120a282612b9b565b602082019050919050565b60006120ba6016836125a3565b91506120c582612bc4565b602082019050919050565b60006120dd600083612592565b91506120e882612bed565b600082019050919050565b6120fc816127ba565b82525050565b61211361210e826127ba565b612863565b82525050565b612122816127c4565b82525050565b612139612134826127c4565b61286d565b82525050565b600061214b8289611e90565b60148201915061215b8288612102565b60208201915061216b8287612102565b60208201915061217b8286612102565b60208201915061218b8285612102565b60208201915061219b8284612128565b600182019150819050979650505050505050565b60006121ba82611f95565b91506121c68284611ec5565b60208201915081905092915050565b60006020820190506121ea6000830184611e81565b92915050565b60006060820190506122056000830186611e81565b6122126020830185611e81565b61221f60408301846120f3565b949350505050565b600060a08201905061223c6000830187611e81565b6122496020830186611e81565b61225660408301856120f3565b61226360608301846120f3565b8181036080830152612274816120d0565b905095945050505050565b600061010082019050612295600083018b611e81565b6122a2602083018a611e81565b6122af60408301896120f3565b6122bc60608301886120f3565b6122c960808301876120f3565b6122d660a08301866120f3565b6122e360c0830185611eeb565b6122f060e0830184611efa565b9998505050505050505050565b60006020820190506123126000830184611ea7565b92915050565b600060808201905061232d6000830187611eb6565b61233a6020830186612119565b6123476040830185611eb6565b6123546060830184611eb6565b95945050505050565b60006020820190506123726000830184611edc565b92915050565b6000602082019050818103600083015261239181611f09565b9050919050565b600060208201905081810360008301526123b181611f2c565b9050919050565b600060208201905081810360008301526123d181611f4f565b9050919050565b600060208201905081810360008301526123f181611f72565b9050919050565b6000602082019050818103600083015261241181611fb8565b9050919050565b6000602082019050818103600083015261243181611fdb565b9050919050565b6000602082019050818103600083015261245181611ffe565b9050919050565b6000602082019050818103600083015261247181612021565b9050919050565b6000602082019050818103600083015261249181612044565b9050919050565b600060208201905081810360008301526124b181612067565b9050919050565b600060208201905081810360008301526124d18161208a565b9050919050565b600060208201905081810360008301526124f1816120ad565b9050919050565b600060208201905061250d60008301846120f3565b92915050565b600060408201905061252860008301856120f3565b61253560208301846120f3565b9392505050565b6000612546612557565b90506125528282612804565b919050565b6000604051905090565b600067ffffffffffffffff82111561257c5761257b61290c565b5b6125858261293b565b9050602081019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b60006125ca826127ba565b91506125d5836127ba565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561260a5761260961287f565b5b828201905092915050565b6000612620826127ba565b915061262b836127ba565b92508261263b5761263a6128ae565b5b828204905092915050565b6000612651826127ab565b915061265c836127ab565b92508162ffffff04831182151516156126785761267761287f565b5b828202905092915050565b600061268e826127ba565b9150612699836127ba565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156126d2576126d161287f565b5b828202905092915050565b60006126e8826127ba565b91506126f3836127ba565b9250828210156127065761270561287f565b5b828203905092915050565b600061271c8261278b565b9050919050565b60008115159050919050565b6000819050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600081905061277382612bf0565b919050565b600081905061278682612c04565b919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062ffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60006127dc82612765565b9050919050565b60006127ee82612778565b9050919050565b82818337600083830152505050565b61280d8261293b565b810181811067ffffffffffffffff8211171561282c5761282b61290c565b5b80604052505050565b600061284082612851565b9050919050565b6000819050919050565b600061285c82612959565b9050919050565b6000819050919050565b60006128788261294c565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b60008160f81b9050919050565b60008160601b9050919050565b7f45434453413a20696e76616c6964207369676e61747572650000000000000000600082015250565b7f6f6e6c792073656c6c65722063616e2066696e69736800000000000000000000600082015250565b7f696e76616c6964207369676e6174757265000000000000000000000000000000600082015250565b7f45434453413a20696e76616c6964207369676e6174757265206c656e67746800600082015250565b7f19457468657265756d205369676e6564204d6573736167653a0a333200000000600082015250565b7f6e6f7420656e6f7567682074696d652068617320706173736564000000000000600082015250565b7f45434453413a20696e76616c6964207369676e6174757265202773272076616c60008201527f7565000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524337323120616d6f756e742073686f756c6420626520657175616c203100600082015250565b7f6f6e6c79206f776e65722063616e2063616e63656c0000000000000000000000600082015250565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f45434453413a20696e76616c6964207369676e6174757265202776272076616c60008201527f7565000000000000000000000000000000000000000000000000000000000000602082015250565b7f6974656d2063616e27742062652066696e697368656400000000000000000000600082015250565b7f6974656d2063616e27742062652063616e63656c656400000000000000000000600082015250565b50565b60038110612c0157612c006128dd565b5b50565b60048110612c1557612c146128dd565b5b50565b612c2181612711565b8114612c2c57600080fd5b50565b612c3881612723565b8114612c4357600080fd5b50565b612c4f81612739565b8114612c5a57600080fd5b50565b60038110612c6a57600080fd5b50565b612c76816127ba565b8114612c8157600080fd5b50565b612c8d816127c4565b8114612c9857600080fd5b5056fea2646970667358221220c4443e0cd59369f6ff7c0e8f927af307de0d326de28968346ffd91ca99a43b7c64736f6c63430008040033";

export class AuctionMarketplace__factory extends ContractFactory {
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
  ): Promise<AuctionMarketplace> {
    return super.deploy(overrides || {}) as Promise<AuctionMarketplace>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): AuctionMarketplace {
    return super.attach(address) as AuctionMarketplace;
  }
  connect(signer: Signer): AuctionMarketplace__factory {
    return super.connect(signer) as AuctionMarketplace__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AuctionMarketplaceInterface {
    return new utils.Interface(_abi) as AuctionMarketplaceInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AuctionMarketplace {
    return new Contract(address, _abi, signerOrProvider) as AuctionMarketplace;
  }
}
