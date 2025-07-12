import { ethers } from "ethers";
import abi from "./ScoreStorageABI.json"; // Your contract ABI

const CONTRACT_ADDRESS = "0x1462fb2888fFd8425A268de340aac19932626336"; // Correct address

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};
