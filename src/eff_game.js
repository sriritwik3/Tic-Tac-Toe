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

  const isBoardFull = (tempValues) => {
    for (let i = 0; i < 9; i++) {
      if (tempValues[i] === null) return 0;
    }
    return 1;
  };

  const minimaxAB = (tempValues, currentSymbol, depth, alpha, beta) => {
    let bestScore = currentSymbol === "X" ? 1000 : -1000;
    let bestMove = -1;
    if (isBoardFull(tempValues) || gameWinner(tempValues) !== null) {
      bestScore = gameWinner(tempValues) === "X" ? -1000 : 1000;
      return [bestScore, bestMove];
    }
    const legalValues = [];
    for (let i = 0; i < 9; i++) {
      if (tempValues[i] === null) legalValues.push(i);
    }
    for (let i = 0; i < legalValues.length; i++) {
      let currentMove = legalValues[i];
      tempValues[currentMove] = currentSymbol;
      if (currentSymbol === "O") {
        let score = minimaxAB(tempValues, "X", depth + 1, alpha, beta)[0];
        if (bestScore < score) {
          bestScore = score - depth * 10;
          bestMove = currentMove;
          alpha = Math.max(alpha, bestScore);
          tempValues[currentMove] = null;
          if (beta <= alpha) break;
        }
      } else {
        let score = minimaxAB(tempValues, "O", depth + 1, alpha, beta)[0];
        if (bestScore > score) {
          bestScore = score + depth * 10;
          bestMove = currentMove;
          beta = Math.min(beta, bestScore);
          tempValues[currentMove] = null;
          if (beta <= alpha) break;
        }
      }
      tempValues[currentMove] = null;
    }
    return [bestScore, bestMove];
  };

  const handleClick = async (i) => {
    history = history.slice(0, step + 1);
    const values = history[history.length - 1];
    const newValues = values.slice();
    if (gameWinner(values) || values[i]) return;
    newValues[i] = isNext;
    newValues[i] = "X";
    setHistory(history.concat([newValues]));
    setStep(history.length);
    if (gameWinner(newValues) || isBoardFull(newValues)) return;
    let tempValues = newValues.slice();
    let computerMove = minimaxAB(tempValues, "O", 1, -1000, 1000);
    if (computerMove[1] < 9 && computerMove[1] >= 0)
      tempValues[computerMove[1]] = "O";
    setHistory(history.concat([tempValues]));
    setStep(history.length);
  };

  const winner = gameWinner(history[step]);
  let status;
  if (winner) {
    if (winner === "X") status = "CONGRATS! You won the game :)";
    else status = "Better luck next time mama :(";
  } else if (isBoardFull(history[step]))
    status = "A good one ended in a xDraw (:( ";
  console.log(history[step], status);

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
