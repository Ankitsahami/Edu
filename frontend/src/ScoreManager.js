import React, { useState, useEffect } from "react";
import { BrowserProvider, BigNumber } from "ethers";
import { getContract } from "./contract";

export default function ScoreManager() {
  const [walletAddress, setWalletAddress] = useState("");
  const [score, setScore] = useState(null);
  const [newScore, setNewScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      if (!window.ethereum) {
        setError("Please install MetaMask!");
        return;
      }
      try {
        const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(address);

        const provider = new BrowserProvider(window.ethereum);
        const contract = getContract(provider);

        const onChainScore = await contract.getScore(address);
        setScore(onChainScore.toNumber());
      } catch (err) {
        setError("Error connecting wallet or fetching score: " + err.message);
      }
    }
    init();
  }, []);

  async function handleUpdateScore() {
    setError("");
    if (!window.ethereum) {
      setError("Please install MetaMask!");
      return;
    }
    if (!newScore || isNaN(newScore) || newScore < 0) {
      setError("Please enter a valid non-negative number for new score.");
      return;
    }
    setLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.updateScore(BigNumber.from(newScore));
      await tx.wait();

      setScore(Number(newScore));
      setNewScore("");
      alert("Score updated on blockchain!");
    } catch (err) {
      setError("Transaction failed: " + (err.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", maxWidth: 400, margin: "auto" }}>
      <h3>Wallet: {walletAddress || "Not connected"}</h3>
      <p>Current Score: {score !== null ? score : "Loading..."}</p>
      <input
        type="number"
        placeholder="Enter new score"
        value={newScore}
        onChange={e => setNewScore(e.target.value)}
        disabled={loading}
        min={0}
      />
      <button onClick={handleUpdateScore} disabled={loading}>
        {loading ? "Updating..." : "Update Score On-Chain"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
