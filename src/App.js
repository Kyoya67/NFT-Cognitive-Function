import React, { useState } from 'react';
import { ethers } from 'ethers';
import nftContractABI from './component/abi/nftContract.json';
import './App.css';

// ここにNFTスマートコントラクトのアドレスとABIを設定します
const nftContractAddress = '0x62137c044e65D50E8f3d6512A69488FF5C62a7A7';

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

  const checkNFTOwnership = async (userAddress) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(nftContractAddress, nftContractABI, provider);
      
      // ここでNFTの所有権を確認します。NFTスマートコントラクトによっては、メソッド名が異なる場合があります。
      const balance = await contract.balanceOf(userAddress,2);
      if (balance > 0) setNftOwned(true);
      setNftOwned(balance.gt(0));
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
