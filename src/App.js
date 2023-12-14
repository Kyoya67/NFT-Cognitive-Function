import React, { useState } from 'react';
import { ethers } from 'ethers';
import nftContractABI from './component/abi/nftContract.json';
import './App.css';

// ここにNFTスマートコントラクトのアドレスとABIを設定します
const nftContractAddress = '0x666dA5F2FCDA493b02bD8B2F34A6422Fdfc533c8';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [nftOwned, setNftOwned] = useState(false);

  const connectWalletHandler = async () => {
    if (window.ethereum) {
      try {
        const newAccounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setUserAddress(newAccounts[0]);
        checkNFTOwnership(newAccounts[0]);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Install MetaMask');
    }
  };

  const getMaxTokenID = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(nftContractAddress, nftContractABI, provider);

      const totalSupply = await contract.getAllTokenIds();
      const maxTokenID = totalSupply.toNumber()

      return maxTokenID;
    } catch (error) {
      console.error(error);
      return null;
    }
  };


  const checkNFTOwnership = async (userAddress) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(nftContractAddress, nftContractABI, provider);

      const totalTokenIDs = await getMaxTokenID();
      if (totalTokenIDs === null) {
        console.error("Failed to retrieve total token IDs.");
        return;
      }

      let TotalBalance = 0;
      for (let i = 1; i <= totalTokenIDs; i++) {
        const balance = await contract.balanceOf(userAddress, i);
        const intBalance = balance.toNumber();
        console.log(`tokenID ${i} : ${intBalance}`);
        TotalBalance += intBalance;
      }
      console.log(TotalBalance);
      if (TotalBalance > 0) {
        setNftOwned(true);
      } else {
        setNftOwned(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="title">Discord Server</h1>
      <button className="connect-button" onClick={connectWalletHandler}>Connect to MetaMask</button>
      {userAddress && <p className="address">Connected: {userAddress}</p>}
      <p className="nft-status">{nftOwned ? 'You own the NFT!' : 'You do not own the NFT'}</p>
    </>
  );
}

export default App;
