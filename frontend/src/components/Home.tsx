import React, { useState, useEffect } from "react";
import { WalletSDK } from "@roninnetwork/wallet-sdk";
import axios from "axios";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { CardMedia, Typography, Modal, TextField } from "@mui/material";
import axieImage from "../assets/axie_1.png";
import pixelBackground from "../assets/PixelBG3.jpg";
import BriefDescriptionBox from "./About";

export default function Home() {
  const [userWalletAddress, setUserWalletAddress] = useState(
    sessionStorage.getItem("userWalletAddress") || undefined
  );
  const [totalDonationValue, setTotalDonationValue] = useState(0);
  const [top5Donors, setTop5Donors] = useState({});
  const [open, setOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const donationAddress = "0x8f11877d6181484568b93b30039f5418f787c61c";

  const config = {
    method: "get",
    maxBodyLength: Infinity,
    // url: "https://api-gateway.skymavis.com/skynet-test/ronin/accounts/0x60f642408a5e661da0489081f2951d046769ca6f", // Test Net
    url: `https://api-gateway.skymavis.com/skynet/ronin/accounts/${donationAddress}`,
    headers: {
      Accept: "application/json",
      "X-API-KEY": process.env.REACT_APP_X_API_KEY,
    },
  };

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
    }, 1000);

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

          const sortedArray = Object.entries(dictionary).sort(
            ([, a], [, b]) => b - a
          );

          const top5Array = sortedArray.slice(0, 5);

          const top5Dictionary = Object.fromEntries(top5Array);
          setTop5Donors(top5Dictionary);

          console.log(top5Dictionary);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 1000);

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
      sessionStorage.setItem("userWalletAddress", accounts[0]);
    } else {
      console.log("Failed to connect to the wallet");
    }
  };

  const handleConnectWallet = async () => {
    if (userWalletAddress) {
      console.log("connected user wallet address", userWalletAddress);
    } else {
      connectRoninWallet();
    }
  };

  const addDonationAmount = async () => {
    handleClose();
    try {
      const valueInWei = (donationAmount * 10 ** 18).toString(16);
      await window.ronin!.provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: "0x8f11877d6181484568b93b30039f5418f787c61c",
            from: userWalletAddress,
            value: "0x" + valueInWei,
            gas: "0x5208",
            data: "",
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDonate = async () => {
    if (userWalletAddress === undefined) {
      console.log("Log in to your Ronin Account through the extension");
      connectRoninWallet();
    } else {
      handleOpen();
    }
  };

  return (
    <Container maxWidth="sm" style={{ minHeight: "100vh" }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        paddingY={4}
        style={{
          backgroundImage: `url(${pixelBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <CardMedia
          component="img"
          alt="Apothe-Care Logo"
          height="400"
          image={axieImage}
        />
        <Typography
          variant="h5"
          gutterBottom
          style={{ color: "white", fontSize: "30px" }}
        >
          Total Donated Value: {totalDonationValue / 1000000000000000000} Ron
        </Typography>

        <BriefDescriptionBox />

        <Box
          style={{
            marginTop: "50px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            width: "25%",
            maxHeight: "200px",
            overflowY: "auto",
            position: "absolute",
            top: "20px",
            right: "10px",
            backgroundColor: "white",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            style={{ color: "#01485c", fontSize: "50px" }}
          >
            Top 5 Donors
          </Typography>
          {Object.entries(top5Donors).map(([key, value], index) => (
            <Typography
              key={index}
              variant="body1"
              style={{ marginBottom: "8px" }}
            >
              {key}: {(value as number) / 1000000000000000000} Ron
            </Typography>
          ))}
        </Box>
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          style={{
            backgroundColor: "white",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            width: "300px",
            height: "300px",
          }}
        >
          <Typography id="simple-modal-title" variant="h6" component="h2">
            Donation Value
          </Typography>
          <TextField
            label="Donation Amount"
            variant="outlined"
            fullWidth
            type="number"
            value={donationAmount}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value < 0) {
                setDonationAmount(0);
              } else {
                setDonationAmount(value);
              }
            }}
            style={{ marginBottom: "20px" }}
          />
          <Button onClick={addDonationAmount}>Confirm Donation Amount</Button>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </Container>
  );
}
