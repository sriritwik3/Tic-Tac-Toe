import "./ttt.css";
import Board from "./board.js";
import React, { useState } from "react";

const gameWinner = (values) => {
  const possibilities = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < possibilities.length; i++) {
    const [a, b, c] = possibilities[i];
    if (values[a] && values[b] === values[a] && values[a] === values[c])
      return values[a];
  }
  return null;
};

const Game = () => {
  let [history, setHistory] = useState([Array(9).fill(null)]);
  const [isNext, setIsNext] = useState("X");
  const [step, setStep] = useState(0);

  const jumpTo = (move) => {
    setStep(move);
    const next = move & 1 ? "O" : "X";
    setIsNext(next);
  };

  const actions = history.map((step, move) => {
    const decider = move ? "Go to move " + move : "RESET";
    return (
      <li className="actions-list" key={move}>
        <button className="button" onClick={() => jumpTo(move)}>
          {decider}
        </button>
        {/* <div class="btn-2">
          <p>Button 2: </p>
          <a href="google.com" onClick={() => jumpTo(move)}>
            <span>{decider}</span>
          </a>
        </div> */}
      </li>
    );
  });

  const handleClick = (i) => {
    history = history.slice(0, step + 1);
    const values = history[history.length - 1];
    const newValues = values.slice();
    if (gameWinner(values) || values[i]) return;
    newValues[i] = isNext;
    setHistory(history.concat([newValues]));
    let next = "X";
    if (isNext === "X") next = "O";
    setStep(history.length);
    setIsNext(next);
  };

  const winner = gameWinner(history[step]);
  let status;
  if (winner) status = "CONGRATS '" + winner + "', You won the game.";
  else status = "Next move " + isNext;

  return (
    <div className="game">
      <div className="game-board">
        <Board history={history[step]} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <h2>{status}</h2> <ol className="actions"> {actions} </ol>
      </div>
    </div>
  );
};

export default Game;
