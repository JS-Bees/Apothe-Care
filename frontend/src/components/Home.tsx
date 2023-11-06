"use client";
import React, { useState, useEffect } from "react";
import { WalletSDK } from "@roninnetwork/wallet-sdk";
import { ethers } from "ethers";
// import { Web3Provider } from "@ethersproject/providers";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { CardMedia, Typography } from "@mui/material";
// import { ExternallyOwnedAccount } from "@ethersproject/abstract-signer";

export default function Home() {
  const [userWalletAddress, setUserWalletAddress] = useState("");

  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://saigon-testnet.roninchain.com/rpc"
  // ); // using testnet change to mainnet

  const checkRoninInstalled = () => {
    if ("ronin" in window) {
      return true;
    }

    window.open("https://wallet.roninchain.com", "_blank");
    return false;
  };

  useEffect(() => {
    const accountChangeListener = (
      newAddresses: React.SetStateAction<string>[]
    ) => {
      console.log("Account is changed to: ", newAddresses[0]);
      setUserWalletAddress(newAddresses[0]);
    };

    window.ronin!.provider.addListener(
      "accountsChanged",
      accountChangeListener
    );

    // Return a cleanup function to remove the event listener
    return () => {
      window.ronin!.provider.removeListener(
        "accountsChanged",
        accountChangeListener
      );
    };
  }, []);

  // remove
  console.log("user wallet", "1" + userWalletAddress + "1");

  const handleConnectWallet = async () => {
    // const sdk = new WalletSDK(); // make sure this is run first before connectInjected

    // check if ronin extension is installed
    const isInstalled = checkRoninInstalled();
    if (isInstalled === false) {
      console.log("Open installation window");
    }

    if (userWalletAddress) {
      console.log("Wallet is already connected"); // make this into a modal
    } else {
      const sdk = new WalletSDK(); // make sure this is run first before connectInjected
      await sdk.connectInjected();

      const accounts = await sdk.requestAccounts();
      if (accounts) {
        console.log(`Wallet Connected! Current address: ${accounts[0]}`);
        setUserWalletAddress(accounts[0]);
        console.log("connected");
      } else {
        console.log("Failed to connect to the wallet");
      }
    }
  };

  const handleDonate = async () => {
    try {
      const valueInWei = (0.00001 * 10 ** 18).toString(16);
      await window.ronin!.provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: "0x8f11877d6181484568b93b30039f5418f787c61c",
            from: userWalletAddress,
            // value: "0xDE0B6B3A7640000", // 1000000000000000000, 1 RON
            value: "0x" + valueInWei, // 0.00001 RON
            gas: "0x5208",
            data: "",
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  // // DON'T SHARE THIS WITH ANYONE
  // const privateKey = "test";
  // const toAddress = "0x8f11877d6181484568b93b30039f5418f787c61c";
  // const amount = "0.1";

  // const handleDonate = async (
  //   privateKey:
  //     | ethers.utils.BytesLike
  //     | ExternallyOwnedAccount
  //     | ethers.utils.SigningKey,
  //   toAddress: string,
  //   amount: string
  // ) => {
  //   // Create a wallet from the private key
  //   const wallet = new ethers.Wallet(privateKey, provider);

  //   // Convert amount to Wei
  //   const weiAmount = ethers.utils.parseEther(amount);

  //   // Create a transaction object
  //   const transaction = {
  //     to: toAddress,
  //     value: weiAmount,
  //   };

  //   // Sign and send the transaction
  //   const transactionResponse = await wallet.sendTransaction(transaction);
  //   console.log(transactionResponse);

  //   // Wait for the transaction to be confirmed
  //   await transactionResponse.wait();

  //   // Verify the balance after the transaction
  //   const balance = await provider.getBalance(wallet.address);
  //   console.log(
  //     "Balance after sending RON:",
  //     ethers.utils.formatEther(balance),
  //     "RON"
  //   );

  //   console.log("Donated");
  // };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        paddingY={4}
      >
        <Typography variant="h2" gutterBottom>
          Apothe-Care
        </Typography>
        <CardMedia
          component="img"
          alt="Apothe-Care Logo"
          height="200" // Adjust the height as needed
          image="../assets/axie_1.png" // path to your image
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleConnectWallet}
          fullWidth
          size="large"
          style={{ borderRadius: "25px", marginBottom: "20px" }}
        >
          Connect Wallet
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDonate}
          // onClick={() =>
          //   handleDonate(privateKey, toAddress, amount).catch(console.error)
          // }
          fullWidth
          size="large"
          style={{ borderRadius: "25px" }}
        >
          Donate
        </Button>
      </Box>
    </Container>
  );
}
