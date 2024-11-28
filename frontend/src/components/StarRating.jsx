// StarRating.js
import React from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, setRating }) => {
  const handleClick = (value) => {
    setRating(value); // Met à jour la note sélectionnée
  };

  return (
    <div style={{ display: "flex", gap: "5px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={30} // Taille de l'étoile
          onClick={() => handleClick(star)} // Met à jour la note sur clic
          style={{
            cursor: "pointer",
            color: star <= rating ? "gold" : "lightgray", // Étoiles dorées ou grises
          }}
        />
      ))}
    </div>
  );
};

export default StarRating;
