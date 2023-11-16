import React, { useState, useEffect } from "react";
import { WalletSDK } from "@roninnetwork/wallet-sdk";
import axios from "axios";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { CardMedia, Typography } from "@mui/material";

export default function Home() {
  const [userWalletAddress, setUserWalletAddress] = useState(
    sessionStorage.getItem("userWalletAddress") || undefined
  );
  const [totalDonationValue, setTotalDonationValue] = useState(0);
  const [top5Donors, setTop5Donors] = useState({});

  const donationAddress = "0x8f11877d6181484568b93b30039f5418f787c61c";

  const config = {
    method: "get",
    maxBodyLength: Infinity,
    // url: "https://saigon-testnet.roninchain.com/rpc/accounts/0x60f642408a5e661da0489081f2951d046769ca6f", // Replac
    // url: "https://api-gateway.skymavis.com/skynet-test/ronin/accounts/0x60f642408a5e661da0489081f2951d046769ca6f", // Test Net
    url: `https://api-gateway.skymavis.com/skynet/ronin/accounts/${donationAddress}`,
    headers: {
      Accept: "application/json",
      "X-API-KEY": process.env.REACT_APP_X_API_KEY,
    },
  };

  // need to make this polling
  useEffect(() => {
    const calcTotalDonationValue = async () => {
      return axios(config)
        .then((response: { data: any }) => {
          setTotalDonationValue(response.data.result.balance);
          return response.data.balance;
        })
        .catch((error: any) => {
          console.log(error);
          throw error;
        });
    };

    const interval = setInterval(() => {
      calcTotalDonationValue();
    }, 3000); // Poll every 3 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://api-gateway.skymavis.com/explorer/txs/${donationAddress}`,
        headers: {
          Accept: "application/json",
          "X-API-Key": process.env.REACT_APP_X_API_KEY,
        },
      };

      axios(config)
        .then((response) => {
          const data = response.data.results;
          const dictionary: { [key: string]: number } = {};

          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.to === `${donationAddress}` && item.status === 1) {
              const from = item.from;
              const value = Number(item.value);

              if (dictionary[from]) {
                dictionary[from] += value;
              } else {
                dictionary[from] = value;
              }
            }
          }

          // Sort the dictionary by value in descending order
          const sortedArray = Object.entries(dictionary).sort(
            ([, a], [, b]) => b - a
          );

          // Limit to the top 5 entries
          const top5Array = sortedArray.slice(0, 5);

          // Convert the array back to a dictionary
          const top5Dictionary = Object.fromEntries(top5Array);
          setTop5Donors(top5Dictionary);

          console.log(top5Dictionary);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 3000); // Runs every 5 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const accountChangeListener = (
      newAddresses: React.SetStateAction<string>[]
    ) => {
      console.log("Account is changed to: ", newAddresses[0]);
      setUserWalletAddress(newAddresses[0] as string);
      sessionStorage.setItem("userWalletAddress", newAddresses[0] as string);
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

  const checkRoninInstalled = () => {
    if ("ronin" in window) {
      return true;
    }

    window.open("https://wallet.roninchain.com", "_blank");
    return false;
  };

  const connectRoninWallet = async () => {
    const sdk = new WalletSDK();
    await sdk.connectInjected();

    const isInstalled = checkRoninInstalled();
    if (isInstalled === false) {
      console.log("Open installation window");
    }

    const accounts = await sdk.requestAccounts();
    if (accounts) {
      console.log(`Wallet Connected! Current address: ${accounts[0]}`);
      setUserWalletAddress(accounts[0]);
      // Also save the new userWalletAddress in sessionStorage
      sessionStorage.setItem("userWalletAddress", accounts[0]);
    } else {
      console.log("Failed to connect to the wallet");
    }
  };

  const handleConnectWallet = async () => {
    if (userWalletAddress) {
      console.log("connected user wallet address", userWalletAddress);
    }
    // else if (userWalletAddress === undefined) {
    //   console.log("Log in to your Ronin Account through the extension"); // make this into a modal
    // }
    else {
      connectRoninWallet();
    }
  };

  const handleDonate = async () => {
    if (userWalletAddress === undefined) {
      console.log("Log in to your Ronin Account through the extension");
      connectRoninWallet();
    } else {
      try {
        await window.ronin!.provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              to: donationAddress,
              from: userWalletAddress,
              value: "0xDE0B6B3A7640000", // 1000000000000000000, 1 RON
              gas: "0x5208",
              data: "",
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
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
          Total Donated Value: {totalDonationValue} WEI
        </Typography>

        {Object.entries(top5Donors).map(([key, value], index) => (
          <Typography key={index} variant="body1">
            {key}: {value as number}
          </Typography>
        ))}

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
