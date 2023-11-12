import React, { useState, useEffect } from "react";
import { WalletSDK } from "@roninnetwork/wallet-sdk";
import axios from "axios";
// import { Web3Provider } from "@ethersproject/providers";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { CardMedia, Typography } from "@mui/material";
// import { ExternallyOwnedAccount } from "@ethersproject/abstract-signer";

export default function Home() {
  // const [userWalletAddress, setUserWalletAddress] = useState("");
  const [userWalletAddress, setUserWalletAddress] = useState(
    localStorage.getItem("userWalletAddress") || ""
  );
  const [totalDonationValue, setTotalDonationValue] = useState(0);

  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://api-gateway.skymavis.com/skynet/ronin/accounts/0x60f642408a5e661da0489081f2951d046769ca6f",
    headers: {
      Accept: "application/json",
      "X-API-KEY": process.env.REACT_APP_X_API_KEY,
    },
  };

  const calcTotalDonationValue = () => {
    return axios(config)
      .then((response: { data: any }) => {
        console.log(response.data.result);
        console.log(JSON.stringify(response.data.result.ronNetWorth));
        setTotalDonationValue(response.data.result.ronNetWorth);
        return response.data.balance; // return the balance value
      })
      .catch((error: any) => {
        console.log(error);
        throw error; // re-throw the error to be handled by the caller
      });
  };

  // need to make this a useEffect
  calcTotalDonationValue();

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
      localStorage.setItem("userWalletAddress", newAddresses[0] as string);
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

  const handleConnectWallet = async () => {
    // check if ronin extension is installed
    const isInstalled = checkRoninInstalled();
    if (isInstalled === false) {
      console.log("Open installation window");
    }

    if (userWalletAddress) {
      console.log("connected user wallet address", userWalletAddress);
      console.log("Wallet is already connected"); // make this into a modal
    } else if (userWalletAddress === undefined) {
      console.log("Log in to your Ronin Account through the extension"); // make this into a modal
    } else {
      const sdk = new WalletSDK();
      await sdk.connectInjected();

      const accounts = await sdk.requestAccounts();
      if (accounts) {
        console.log(`Wallet Connected! Current address: ${accounts[0]}`);
        setUserWalletAddress(accounts[0]);
        // Also save the new userWalletAddress in localStorage
        localStorage.setItem("userWalletAddress", accounts[0]);
        console.log("connected");
      } else {
        console.log("Failed to connect to the wallet");
      }
    }
  };

  const handleDonate = async () => {
    console.log(userWalletAddress);
    //^remove this after
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
        <Typography variant="h5" gutterBottom>
          Total Donated Value: {totalDonationValue.toFixed(5)} RON
        </Typography>
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
