import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const BriefDescriptionBox = () => (
  <Box
    style={{
      marginTop: "50px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "10px",
      width: "25%",
      maxHeight: "300px",
      overflowY: "auto",
      position: "absolute",
      top: "20px",
      left: "10px",
      backgroundColor: "white",
      overflow: "auto",
    }}
  >
    <Typography variant="h4" gutterBottom style={{ color: "#02a95c" }}>
      Why Donate for This Axie?
    </Typography>
    <Typography variant="body1">
      In the vibrant realm of Lunacia, where Axies thrive in harmony, a unique
      Axie named Rono finds himself in a heart-wrenching situation. Once
      cherished by his previous owner, circumstances took a turn, and Rono was
      left abandoned, longing for companionship and care. Rono, with his
      striking colors and endearing personality, now faces the challenges of the
      wilderness alone. His once-playful demeanor has given way to a sense of
      loneliness and uncertainty. However, there is hope on the horizon. Our
      mission is to rescue Rono from his plight and provide him with the love
      and care he deserves. Urgent funds are needed to ensure Rono's well-being,
      covering essential expenses like medical care, nourishing meals, and a
      safe haven. Your generous donations will be the beacon of hope that lights
      up Rono's world and gives him a second chance at a joyful life. By
      contributing to Rono's rescue, you become a hero in his story, offering
      him a brighter future and a community that cares. Join us in this journey
      of compassion and make a difference in the life of a deserving Axie.
      Together, we can rewrite Rono's tale from one of abandonment to a story of
      resilience, love, and the power of a united community. Your donation, no
      matter the size, will be a crucial step in ensuring Rono's recovery and
      bringing warmth back into his eyes. Let's come together to turn the page
      on Rono's past and create a new chapter filled with hope, kindness, and
      the shared joy of giving.
    </Typography>
  </Box>
);

export default BriefDescriptionBox;
