"use client"; // Indica che il componente deve essere eseguito nel client

import React, { useEffect, useState } from "react";

export default function Grid50x50() {
  const gridSize = 50; // Dimensione della griglia
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Posizione iniziale del quadratino
  const speed = 1; // Velocità del movimento

  const squares = Array.from({ length: gridSize * gridSize }, (_, i) => i + 1);

  // Funzione per gestire la pressione dei tasti
  const handleKeyDown = (e) => {
    setPosition((prevPosition) => {
      const newPosition = { ...prevPosition };
      switch (e.key) {
        case "ArrowUp":
          if (newPosition.y > 0) newPosition.y -= 1; // Muovi verso l'alto
          break;
        case "ArrowDown":
          if (newPosition.y < gridSize - 1) newPosition.y += 1; // Muovi verso il basso
          break;
        case "ArrowLeft":
          if (newPosition.x > 0) newPosition.x -= 1; // Muovi verso sinistra
          break;
        case "ArrowRight":
          if (newPosition.x < gridSize - 1) newPosition.x += 1; // Muovi verso destra
          break;
        default:
          break;
      }
      console.log(newPosition);
      return newPosition;
    });
  };

  // Aggiungi l'event listener per la pressione dei tasti quando il componente è montato
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Pulisci l'event listener quando il componente è smontato
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="grid-cols-50 grid gap-0">
      {squares.map((item, idx) => {
        const isActive =
          position.x === idx % gridSize &&
          position.y === Math.floor(idx / gridSize);
        return (
          <div
            className={`size-2 ${isActive ? "bg-red-300" : "bg-gray-300"}`}
            key={idx}
          ></div>
        );
      })}
    </div>
  );
}
