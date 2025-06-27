'use client';

import { useState } from 'react';

const GamePage = () => {
  // State to track which squares have been clicked
  const [clickedSquares, setClickedSquares] = useState<Set<number>>(new Set());

  // Handle square click
  const handleSquareClick = (index: number) => {
    setClickedSquares((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index); // Remove if already clicked (toggle behavior)
      } else {
        newSet.add(index); // Add if not clicked
      }
      return newSet;
    });
  };

  // Create the 9 squares
  const renderSquare = (index: number) => {
    const isClicked = clickedSquares.has(index);

    return (
      <button
        key={index}
        onClick={() => handleSquareClick(index)}
        className={`
          w-24 h-24 border-2 border-gray-400 
          flex items-center justify-center 
          text-2xl font-bold
          transition-colors duration-200
          hover:bg-gray-100 dark:hover:bg-gray-800
          ${isClicked ? 'bg-red-500 text-white' : 'bg-white dark:bg-gray-900'}
        `}
      >
        {/* You can add X or O here later */}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Tic Tac Toe</h1>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-1 bg-gray-600 p-2 rounded-lg shadow-lg">
        {Array.from({ length: 9 }, (_, index) => renderSquare(index))}
      </div>

      {/* Reset Button */}
      <button
        onClick={() => setClickedSquares(new Set())}
        className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Reset Board
      </button>
    </div>
  );
};

export default GamePage;
