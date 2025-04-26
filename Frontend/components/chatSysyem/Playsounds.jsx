import React from "react";

export function playSound(src) {
  if (!src) return;
  
  const audio = new Audio(src);

  audio.play().catch((error) => {
    console.error("Failed to play sound:", error);
  });
}