import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { CardMedia, Typography } from "@mui/material";

export default function Home() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleConnectWallet = () => {
    console.log("Wallet Connected!");
  };

  const handleDonate = () => {
    console.log("Donated!");
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
        <TextField
          label="Donate to: Enter wallet address here..."
          variant="outlined"
          value={inputValue}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{
            style: {
              borderRadius: "25px", // Apply the border-radius inline style
            },
          }}
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
