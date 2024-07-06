import { useEffect, useState } from "react";
import "./App.css";
import {
  CHESS_PIECES,
  CHESSS_OBJ,
  INIT_CHESS_BOARD,
  LIMIT_CHESS_BY_TYPE,
} from "./constants";
export const ACCEPTED_POSITION_INIT_RANDOM: Array<[number, number]> = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 8],
  [2, 1],
  [2, 7],
  [3, 0],
  [3, 2],
  [3, 4],
  [3, 6],
  [3, 8],
  [7, 1],
  [7, 7],
  [6, 0],
  [6, 2],
  [6, 4],
  [6, 6],
  [6, 8],
  [9, 0],
  [9, 1],
  [9, 2],
  [9, 3],
  [9, 5],
  [9, 6],
  [9, 7],
  [9, 8],
];
function App() {
  const [isRandomize, setIsRandomize] = useState(false);
  const [selectedPostion, setSelectedPostion] = useState<{
    row: number;
    col: number;
  }>();
  const initChessBoard: (
    | ""
    | (CHESSS_OBJ & {
        show?: boolean;
      })
  )[][] = JSON.parse(JSON.stringify(INIT_CHESS_BOARD));
  const limitChessByType = JSON.parse(JSON.stringify(LIMIT_CHESS_BY_TYPE));
  const [selectedChess, setSelectedChess] = useState<CHESSS_OBJ | "">();
  const [currentChessBoard, setCurrentChessBoard] = useState<
    Array<(CHESSS_OBJ & { show?: boolean }) | "">[]
  >(
    [...initChessBoard].map((row) =>
      row.map((c) => (c ? { ...c, show: false } : ""))
    )
  );
  const [log, setLog] = useState<string[]>([]);
  const randomizeChessInit = () => {
    const randomizedBoard: Array<CHESSS_OBJ>[] = [...initChessBoard].map(
      (row, rowIndex) => {
        const isBlack = rowIndex < 5;
        return row.map((c) => {
          return {
            type: c
              ? c.type.endsWith("k")
                ? c.type
                : isBlack
                ? "bn"
                : "rn"
              : "",
            key: c ? c.key : c,
          };
        });
      }
    );

    setCurrentChessBoard(randomizedBoard);
  };
  const moveChess = (from: [number, number], to: [number, number]) => {
    if (from[0] === to[0] && from[1] === to[1]) return;
    const newChessBoard = [...currentChessBoard];
    newChessBoard[to[0]][to[1]] = newChessBoard[from[0]][from[1]];
    newChessBoard[from[0]][from[1]] = "";
    setCurrentChessBoard(newChessBoard);
    setLog((prev) => [
      ...prev,
      `Move from ${from} to ${to} (${selectedChess ? selectedChess?.key : ""})`,
    ]);
  };
  const showChess = ({
    row,
    col,
    type,
  }: {
    row: number;
    col: number;
    type?: CHESS_PIECES;
  }) => {
    const newChessBoard = [...currentChessBoard];
    if (!newChessBoard?.[row]?.[col]) return;
    newChessBoard[row][col].show = true;
    if (type) {
      newChessBoard[row][col].type = type;
    }
    setCurrentChessBoard(newChessBoard);
  };
  const handleMove = (from: [number, number], to: [number, number]) => {
    moveChess(from, to);
  };
  const randomPosition = () => {
    const chessLimited = { ...limitChessByType };
    let randomedPosition: string[] = [];
    initChessBoard.forEach((row, rowIndex) => {
      row.forEach((_, colIndex) => {
        randomedPosition.push(`${rowIndex}-${colIndex}`);
      });
    });

    const chessBoard = [...initChessBoard].map(
      (row) => row.map(() => "") as any
    );
    const types = Object.keys(limitChessByType) as CHESS_PIECES[];
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      const limit = chessLimited[type];
      if (limit > 0) {
        if (randomedPosition.length === 0) break;
        if (type === "bk") {
          const randomRow = Math.floor(Math.random() * 3);
          const randomCol = Math.floor(Math.random() * 3) + 3;
          randomedPosition = randomedPosition.filter(
            (pos) => pos !== `${randomRow}-${randomCol}`
          );
          chessBoard[randomRow][randomCol] = {
            type: type,
            key: `${type}${limit}`,
          };
          chessLimited[type] -= 1;
          i--;
          continue;
        }
        if (type === "rk") {
          const randomRow = Math.floor(Math.random() * 3) + 7;
          const randomCol = Math.floor(Math.random() * 3) + 3;
          randomedPosition = randomedPosition.filter(
            (pos) => pos !== `${randomRow}-${randomCol}`
          );
          chessBoard[randomRow][randomCol] = {
            type: type,
            key: `${type}${limit}`,
          };
          chessLimited[type] -= 1;
          i--;
          continue;
        }
        const randomIndex = Math.floor(Math.random() * randomedPosition.length);
        const [randomRow, randomCol] = randomedPosition[randomIndex]
          .split("-")
          .map(Number);
        randomedPosition.splice(randomIndex, 1);
        chessBoard[randomRow][randomCol] = {
          type: type,
          key: `${type}${limit}`,
        };
        chessLimited[type] -= 1;
        i--;
      }
    }
    setCurrentChessBoard(chessBoard);
  };

  return (
    <>
      <div className="w-[694px] h-[789px] bg-[url('./assets/images/broad.png')] p-3">
        {currentChessBoard.map((row, rowIndex) => (
          <div className="flex" key={rowIndex}>
            {row.map((col, colIndex: number) => {
              return (
                <div
                  key={colIndex}
                  className={`w-[77px] h-[74px] flex justify-center items-center scale-[1.3] `}
                  onClick={() => {
                    if (selectedPostion) {
                      handleMove(
                        [selectedPostion.row, selectedPostion.col],
                        [rowIndex, colIndex]
                      );
                      setSelectedPostion(undefined);
                      setSelectedChess("");
                    } else {
                      if (!col || col.type === "") return;
                      setSelectedPostion({ row: rowIndex, col: colIndex });
                      setSelectedChess(col);
                    }
                  }}
                >
                  {col && (
                    <div
                      className={`w-[50px] h-[50px] flex justify-center items-center transition-all duration-500 ${
                        rowIndex === selectedPostion?.row &&
                        colIndex === selectedPostion?.col
                          ? "scale-[1.2]"
                          : ""
                      }`}
                    >
                      <img src={`src/assets/images/${col.type}.png`} alt="" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex gap-x-2 mt-4">
        <button
          className="bg-purple-200 py-2 px-3 rounded-lg"
          onClick={() => {
            setCurrentChessBoard([...initChessBoard]);
            if (isRandomize) {
              randomizeChessInit();
            }
          }}
        >
          Reset
        </button>
        <button
          className="bg-purple-200 py-2 px-3 rounded-lg"
          onClick={() => {
            if (!isRandomize) {
              randomizeChessInit();
            } else {
              setCurrentChessBoard(initChessBoard);
            }
            setIsRandomize(!isRandomize);
          }}
        >
          {isRandomize ? "Cờ úp" : "Cờ ngửa"}
        </button>
        <button
          className="bg-purple-200 py-2 px-3 rounded-lg"
          onClick={randomPosition}
        >
          Random All
        </button>
      </div>
    </>
  );
}

export default App;
