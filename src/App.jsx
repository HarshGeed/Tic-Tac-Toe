import { useState } from "react";
import GameBoard from "./Components/GameBoard";
import Player from "./Components/Player";
import Log from "./Components/Log";
import GameOver from "./Components/GameOver";
import { WINNING_COMBINATIONS } from "./Components/winning-combinations";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurn) {
  return gameTurn.length % 2 === 0 ? "X" : "O";
}

function deriveWinner(gameBoard) {
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];
    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      return PLAYERS[firstSquareSymbol];
    }
  }
  return null;
}

function deriveGameBoard(gameTurn) {
  let gameBoard = [...initialGameBoard.map((array) => [...array])];
  for (const turn of gameTurn) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }
  return gameBoard;
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurn, setGameTurn] = useState([]);

  const gameBoard = deriveGameBoard(gameTurn);
  const winner = deriveWinner(gameBoard);
  const hasDraw = gameTurn.length === 9 && !winner;

  const activePlayer = deriveActivePlayer(gameTurn);

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurn((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [
        ...prevTurns,
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
      ];
      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurn([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={players.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={players.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurn} />
    </main>
  );
}

export default App;
