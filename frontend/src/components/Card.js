// frontend/src/components/Card.js
import React from "react";
import { Card as MUICard, CardContent, Typography } from "@mui/material";
import { EmojiEmotions, Warning, Shuffle, Block } from "@mui/icons-material";

const Card = ({ type }) => {
  const renderCardIcon = () => {
    switch (type) {
      case "😼":
        return <EmojiEmotions fontSize="large" color="primary" />;
      case "💣":
        return <Warning fontSize="large" color="error" />;
      case "🔀":
        return <Shuffle fontSize="large" color="secondary" />;
      case "🙅‍♂️":
        return <Block fontSize="large" color="action" />;
      default:
        return null;
    }
  };

  const getCardName = () => {
    switch (type) {
      case "😼":
        return "Cat Card";
      case "💣":
        return "Exploding Kitten";
      case "🔀":
        return "Shuffle Card";
      case "🙅‍♂️":
        return "Defuse Card";
      default:
        return "Unknown Card";
    }
  };

  return (
    <MUICard sx={{ minWidth: 100, margin: 1, textAlign: "center" }}>
      <CardContent>
        {renderCardIcon()}
        <Typography variant="subtitle1" mt={1}>
          {getCardName()}
        </Typography>
      </CardContent>
    </MUICard>
  );
};

export default Card;
