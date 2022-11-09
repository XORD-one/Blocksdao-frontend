export const BlocksSeeder_Address =
  "0x6BA3Ca2C591718BA114966BD9164154088d1AC3b";

export const BlocksSeeder_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "blockTokenId",
        type: "uint256",
      },
      {
        internalType: "contract IBlocksDaoDescriptorMinimal",
        name: "descriptor",
        type: "address",
      },
    ],
    name: "generateSeed",
    outputs: [
      {
        components: [
          {
            internalType: "uint48",
            name: "background",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "body",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "accessory",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "capStyle",
            type: "uint48",
          },
        ],
        internalType: "struct IBlocksDaoSeeder.Seed",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
