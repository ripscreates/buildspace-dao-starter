import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0x585a56fCa6e4C9630A7b7d09D27f949C7Ca3aA52",
);
const tokenModule = sdk.getTokenModule(
  "0x2c936E0a34BEffc271457685AB12102097964307"
);
const voteModule = sdk.getVoteModule(
  "0x31e4A7eE1A60572D21efcDC5364bf81405cec2e0",
);


const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 addy:", address)

  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);

  // Holds the amount of token each member has in state.
const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
// The array holding all of our members addresses.
const [memberAddresses, setMemberAddresses] = useState([]);

// A fancy function to shorten someones wallet address, no need to show the whole thing. 
const shortenAddress = (str) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

// this is where i inserted Lesson 4 bloopcode
const [proposals, setProposals] = useState([]);
const [isVoting, setIsVoting] = useState(false);
const [hasVoted, setHasVoted] = useState(false);

// Retrieve all our existing proposals from the contract.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }
  // A simple call to voteModule.getAll() to grab the proposals.
  voteModule
    .getAll()
    .then((proposals) => {
      // Set state!
      setProposals(proposals);
      console.log("🌈😜 derProposalz:", proposals)
    })
    .catch((err) => {
      console.error("❌ FAILZ gettin derp-proposals ❌😭", err);
    });
}, [hasClaimedNFT]);

// We also need to check if the user already voted.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // If we haven't finished retrieving the proposals from the useEffect above
  // then we can't check if the user voted yet!
  if (!proposals.length) {
    return;
  }

  // Check if the user has already voted on the first proposal.
  voteModule
    .hasVoted(proposals[0].proposalId, address)
    .then((hasVoted) => {
      setHasVoted(hasVoted);
      console.log("❌ 😜User already voted")
    })
    .catch((err) => {
      console.error("❌FAILZED checkin if wallet has voted", err);
    });
}, [hasClaimedNFT, proposals, address]);

//This is where it ends from lesson 4

// This useEffect grabs all our the addresses of our members holding our NFT.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }
  
  // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
  // with tokenId 0.
  bundleDropModule
    .getAllClaimerAddresses("0")
    .then((addresess) => {
      console.log("✨😜 Members addresses", addresess)
      setMemberAddresses(addresess);
    })
    .catch((err) => {
      console.error("❌ FAILZ gettin member list ", err);
    });
}, [hasClaimedNFT]);

// This useEffect grabs the # of token each member holds.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // Grab all the balances.
  tokenModule
    .getAllHolderBalances()
    .then((amounts) => {
      console.log("🤑 amountz", amounts)
      setMemberTokenAmounts(amounts);
    })
    .catch((err) => {
      console.error("❌ FAILZ gettin token amounts", err);
    });
}, [hasClaimedNFT]);

// Now, we combine the memberAddresses and memberTokenAmounts into a single array
const memberList = useMemo(() => {
  return memberAddresses.map((address) => {
    return {
      address,
      tokenAmount: ethers.utils.formatUnits(
        // If the address isn't in memberTokenAmounts, it means they don't
        // hold any of our token.
        memberTokenAmounts[address] || 0,
        18,
      ),
    };
  });
}, [memberAddresses, memberTokenAmounts]);


  // Another useEffect!
  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract!
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    if (!address) {
      return;
    }
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🎉 connected addy has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("😭 connected addy has no derp membership NFT.")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failz ❌ nft balance", error);
      });
  }, [address]);

  if (error && error.name === "UnsupportedChainIdError") {
  return (
    <div className="unsupported-network">
      <h2>😭 Please connect to Rinkeby 😭</h2>
      <p>
        This derpy-dapp only works on the Rinkeby network, please switch networks
        in your connected wallet.
      </p>
    </div>
  );
}

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to DerpDAO 😜</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect yer wallet
        </button>
      </div>
    );
  }

      // Add this little piece!
      // If the user has already claimed their NFT we want to display the interal DAO page to them
// only DAO members will see this. Render all the members + token amounts.
// if (hasClaimedNFT) {
//   return (
//     <div className="member-page">
//       <h1>😜 DerpDAO Member Page</h1>
//       <p>Congratz Derp! You're a member!</p>
//       <div>
//         <div>
//           <h2>Member List</h2>
//           <table className="card">
//             <thead>
//               <tr>
//                 <th>Address</th>
//                 <th>Token Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {memberList.map((member) => {
//                 return (
//                   <tr key={member.address}>
//                     <td>{shortenAddress(member.address)}</td>
//                     <td>{member.tokenAmount}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }; just gonna paste the updated if(hasClaimedNFT) right underneath this!

  if (hasClaimedNFT) {
    return (
        <div class="snowflakes">
          <div class="snowflake">
         😋
          </div>
          <div class="snowflake">
         🤑
          </div>
          <div class="snowflake">
         😝
          </div>
          <div class="snowflake">
          😜
          </div>
          <div class="snowflake">
         😛
          </div>
          <div class="snowflake">
         🎉
          </div>
          <div class="snowflake">
          😜
          </div>
          <div class="snowflake">
          😜
          </div>
          <div class="snowflake">
          😜
          </div>
          <div class="snowflake">
          😜
          </div>

      <div className="member-page">
      <h1>😜 DerpDAO Member Page</h1>
        <p>Congratz Derp! You're a member!</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Addy</th>
                  <th>Token Amount 🤑</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active derProposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  let voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await tokenModule.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === ethers.constants.AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await tokenModule.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async (vote) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await voteModule.get(vote.proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return voteModule.vote(vote.proposalId, vote.vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async (vote) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await voteModule.get(
                            vote.proposalId
                          );

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return voteModule.execute(vote.proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("YAY 🌈😜 derp successfully voted!");
                    } catch (err) {
                      console.error("😭FAILZ to execute votes", err);
                    }
                  } catch (err) {
                    console.error("😭FAILZ to vote", err);
                  }
                } catch (err) {
                  console.error("😭FAILZ to delegate tokens");
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal, index) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map((vote) => (
                      <div key={vote.type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + vote.type}
                          name={proposal.proposalId}
                          value={vote.type}
                          //default the "abstain" vote to chedked
                          defaultChecked={vote.type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + vote.type}>
                          {vote.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "😝 We are Voting..."
                  : hasVoted
                    ? "You Already Voted 😛"
                    : "Submit Votes 🎉"}
              </button>
              <small>
                This will trigger multiple transactions that you will need to
                sign.
              </small>
            </form>
          </div>
        </div>
      </div>        </div>
    );
  };



  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
    bundleDropModule
    .claim("0", 1)
    .catch((err) => {
      console.error("failz ❌ to claim", err);
      setIsClaiming(false);
    })
    .finally(() => {
      // Stop loading state.
      setIsClaiming(false);
      // Set claim state.
      setHasClaimedNFT(true);
      // Show user their fancy new NFT!
      console.log(
        `Woohoo 🌊 We Successfully Minted 🤑! Go see on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
      );
    });
  }

  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free 😜 DerpDAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => mintNft()}
      >
        {isClaiming ? "🤑 Minting...😛" : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;