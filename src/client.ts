import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { offsetLimitPagination } from '@apollo/client/utilities'
import BN from 'bn.js'
import { viewerVar } from './cache'
import config from './app.config'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

function asBN(value: string): BN {
  try {
    return new BN(value)
  } catch {
    return new BN(0)
  }
}
const typeDefs = gql`
  type Viewer {
    id: ID
    balance: Number
  }

  extend type Collection {
    totalVolume: String
    listedCount: Number
    holderCount: Number
  }

  extend type Query {
    viewer(address: String!): Viewer
  }
`

const client = new ApolloClient({
  uri: config.graphqlUrl,
  typeDefs,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          nfts: offsetLimitPagination(),
          viewer: {
            read() {
              return viewerVar()
            },
          },
        },
      },
      Collection: {
        fields: {
          floorPrice: {
            read: (value) => {
              const lamports = asBN(value)

              return (lamports.toNumber() / LAMPORTS_PER_SOL).toFixed(1)
            }
          },
          nftCount: {
            read: (value) => {
              return new Intl.NumberFormat("en-GB", {
                notation: "compact",
                compactDisplay: "short",
              }).format(value);
            }
          },
          totalVolume: {
            read: (_) => {
              return new Intl.NumberFormat("en-GB", {
                notation: "compact",
                compactDisplay: "short",
              }).format(1800000);
            }
          },
          listedCount: {
            read: (_) => {
              return new Intl.NumberFormat("en-GB", {
                notation: "compact",
                compactDisplay: "short",
              }).format(1400);
            }
          },
          holderCount: {
            read: (_) => {
              return new Intl.NumberFormat("en-GB", {
                notation: "compact",
                compactDisplay: "short",
              }).format(6250);
            }
          }
        },
      },
      MintStats: {
        fields: {
          volume24hr: {
            read: asBN,
          },
          volumeTotal: {
            read: asBN,
          },
          average: {
            read: asBN,
          },
          floor: {
            read: asBN,
          },
        },
      },
      PricePoint: {
        fields: {
          price: {
            read: asBN,
          },
        },
      },
      StoreCreator: {
        keyFields: ['creatorAddress', 'storeConfigAddress'],
      },
      Marketplace: {
        keyFields: ['ownerAddress'],
      },
      Nft: {
        keyFields: ['address'],
      },
      Wallet: {
        keyFields: ['address'],
      },
      Creator: {
        keyFields: ['address'],
      },
      NftCreator: {
        keyFields: ['address'],
      },
      NftOwner: {
        keyFields: ['address'],
      },
      Purchase: {
        keyFields: ['id'],
        fields: {
          price: {
            read: asBN,
          },
        },
      },
      AhListing: {
        keyFields: ['id'],
        fields: {
          price: {
            read: asBN,
          },
        },
      },
      NftActivity: {
        keyFields: ['id'],
        fields: {
          price: {
            read: asBN,
          },
        },
      },
      Offer: {
        keyFields: ['id'],
        fields: {
          price: {
            read: asBN,
          },
        },
      },
      NftAttribute: {
        keyFields: ['traitType', 'value'],
      },
    },
  }),
})

export default client