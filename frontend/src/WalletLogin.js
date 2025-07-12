import React, { useState } from "react";
import { ethers } from "ethers";

const API_URL = "https://5000-ankitsahami-edu-9v1pcwyztuw.ws-us120.gitpod.io";

const WalletLogin = ({ onLogin }) => {
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("Please install MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum); // ethers v6
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);

      // 1. Get nonce from backend
      const nonceRes = await fetch(`${API_URL}/api/nonce/${userAddress}`);
      const { nonce } = await nonceRes.json();

      // 2. Ask user to sign the nonce
      const signature = await signer.signMessage(`Login nonce: ${nonce}`);

      // 3. Send to backend for verification
      const loginRes = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: userAddress, signature })
      });

      const loginData = await loginRes.json();
      if (loginData.success) {
        onLogin(userAddress);
      } else {
        setError(loginData.error || "Login failed");
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Check console for details.");
    }
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>🔐 Connect Wallet to Login</h2>
      {address ? (
        <p>✅ Wallet: {address}</p>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default WalletLogin;
