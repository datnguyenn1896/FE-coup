import { useEffect, useState } from "react";
import "./App.css";
import {
  CHESS_PIECES,
  CHESSS_OBJ,
  INIT_CHESS_BOARD,
  MAX_CHESS_BY_TYPE,
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
  const [isRandomize, setIsRandomize] = useState(true);
  const [isInit, setIsInit] = useState(true);
  const [modePlay, setModePlay] = useState<"hide" | "show">("hide");
  const [selectedPostion, setSelectedPostion] = useState<{
    row: number;
    col: number;
  }>();
  const [selectedChess, setSelectedChess] = useState<CHESSS_OBJ | "">();
  const [currentChessBoard, setCurrentChessBoard] = useState<
    Array<(CHESSS_OBJ & { show?: boolean }) | "">[]
  >(
    INIT_CHESS_BOARD.map((row) =>
      row.map((c) => (c ? { ...c, show: false } : ""))
    )
  );
  const [log, setLog] = useState<string[]>([]);
  useEffect(() => {
    if (isRandomize) {
      randomizeChessInit();
    } else {
      setCurrentChessBoard(INIT_CHESS_BOARD);
    }
  }, [isRandomize]);
  const randomizeChessInit = () => {
    const chessTypes: CHESS_PIECES[] = Object.keys(
      MAX_CHESS_BY_TYPE
    ) as CHESS_PIECES[];
    const randomizedBoard: Array<CHESSS_OBJ>[] = INIT_CHESS_BOARD.map((row) =>
      row.map((c) => ({
        type: "",
        key: c ? c.key : c,
      }))
    );
    const listRandomBlackChess = ACCEPTED_POSITION_INIT_RANDOM.slice(0, 15);
    const listRandomRedChess = ACCEPTED_POSITION_INIT_RANDOM.slice(15);

    chessTypes.forEach((type) => {
      if (type === "") return;
      if (type === "rk" || type === "bk") {
        const col = 4;
        const row = type === "rk" ? 9 : 0;
        randomizedBoard[row][col].type = type;
        return;
      }
      const maxChess = MAX_CHESS_BY_TYPE[type];
      let count = 0;

      while (count < maxChess) {
        let randomRow = 0;
        let randomCol = 0;
        if (type.startsWith("r")) {
          const randomPositionAcepeted = Math.floor(
            Math.random() * listRandomRedChess.length
          );
          [randomRow, randomCol] = listRandomRedChess[randomPositionAcepeted];
          listRandomRedChess.splice(randomPositionAcepeted, 1);
        } else {
          const randomPositionAcepeted = Math.floor(
            Math.random() * listRandomBlackChess.length
          );
          [randomRow, randomCol] = listRandomBlackChess[randomPositionAcepeted];
          listRandomBlackChess.splice(randomPositionAcepeted, 1);
        }

        if (
          randomizedBoard[randomRow][randomCol].type === "" &&
          randomizedBoard
        ) {
          randomizedBoard[randomRow][randomCol].type = type;
          count++;
        } else {
          count++;
        }
      }
    });
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
  const showChess = (row: number, col: number) => {
    const newChessBoard = [...currentChessBoard];
    if (!newChessBoard[row][col]) return;
    newChessBoard[row][col].show = true;
    setCurrentChessBoard(newChessBoard);
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
                      moveChess(
                        [selectedPostion.row, selectedPostion.col],
                        [rowIndex, colIndex]
                      );
                      setSelectedPostion(undefined);
                      setSelectedChess("");
                      showChess(rowIndex, colIndex);
                    } else {
                      if (!col || col.type === "") return;
                      setSelectedPostion({ row: rowIndex, col: colIndex });
                      setSelectedChess(col);
                    }
                  }}
                >
                  {col &&
                    col.type !== "" &&
                    (modePlay === "hide" &&
                    col.type !== "bk" &&
                    col.type !== "rk" &&
                    !col.show ? (
                      <div
                        className={`w-[50px] h-[50px] flex justify-center items-center transition-all duration-500 ${
                          rowIndex === selectedPostion?.row &&
                          colIndex === selectedPostion?.col
                            ? "scale-[1.2]"
                            : ""
                        }`}
                      >
                        <img src={`src/assets/images/bn.png`} alt="" />
                      </div>
                    ) : (
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
                    ))}
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
            isRandomize ? setIsRandomize(false) : setIsRandomize(true);
          }}
        >
          {isRandomize ? "Randomize" : "Unrandomize"}
        </button>
        <button
          className="bg-purple-200 py-2 px-3 rounded-lg"
          onClick={() => {
            modePlay === "hide" ? setModePlay("show") : setModePlay("hide");
          }}
        >
          Show/hide
        </button>
        <button
          className="bg-purple-200 py-2 px-3 rounded-lg"
          onClick={() => {
            setIsInit(true);
            setCurrentChessBoard(INIT_CHESS_BOARD);
            if (isRandomize) {
              randomizeChessInit();
            }
          }}
        >
          Reset
        </button>
      </div>
    </>
  );
}

export default App;
