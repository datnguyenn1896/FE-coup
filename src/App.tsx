import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import {
  CHESS_PIECES,
  CHESSS_OBJ,
  INIT_CHESS_BOARD,
  LIMIT_CHESS_BY_TYPE,
  NAME_CHESS,
} from "./constants";
import { Button } from "./components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
function App() {
  const [isRandomize, setIsRandomize] = useState(false);
  const [selectedPostion, setSelectedPostion] = useState<{
    row: number;
    col: number;
  }>();
  const [chessSide, setChessSide] = useState<"blackTop" | "redTop">("blackTop");
  const socket = io("http://localhost:5000");
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
  useEffect(() => {
    socket.on(
      "move",
      (data: { from: number[]; to: number[]; chess?: string }) => {
        const [fromRow, fromCol] = data.from;
        const [toRow, toCol] = data.to;
        moveChess([fromRow, fromCol], [toRow, toCol]);
        if (data.chess) {
          showChess({
            row: toRow,
            col: toCol,
            type: data.chess as CHESS_PIECES,
          });
        }
      }
    );
    socket.on("change-side", ({ side }) => {
      if (side === chessSide) return;
      swapSide();
      setChessSide(side);
    });
    socket.on("update-board", ({ board }) => {
      updateBoard(board);
    });
    return () => {
      socket.disconnect();
    };
  }, [currentChessBoard]);
  const updateBoard = (board: Record<string, CHESS_PIECES>) => {
    const temp = [...currentChessBoard];
    const result = temp.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        return {
          ...col,
          type: board[`${rowIndex}-${colIndex}`]
            ? board[`${rowIndex}-${colIndex}`]
            : "",
        };
      });
    });

    setCurrentChessBoard(result as any);
    const chessMoved = getMovedChessByBoard(result, temp);
    if (chessMoved.from && chessMoved.to) {
      socket.emit("moved", { chessMoved });
    }
  };
  const getMovedChessByBoard = (currentBoard: any, prevBoard: any) => {
    const newLog: { from?: number[]; to?: number[] } = {};
    for (let i = 0; i < currentBoard.length; i++) {
      for (let j = 0; j < currentBoard[i].length; j++) {
        if (
          typeof currentBoard[i][j]?.type === "undefined" ||
          currentBoard[i][j]?.type === ""
        ) {
          if (
            typeof prevBoard[i][j]?.type !== "undefined" &&
            prevBoard[i][j]?.type !== ""
          ) {
            newLog.from = [i, j];
          }
        }
        if (
          typeof prevBoard[i][j]?.type === "undefined" ||
          prevBoard[i][j]?.type === ""
        ) {
          if (
            typeof currentBoard[i][j]?.type !== "undefined" &&
            currentBoard[i][j]?.type !== ""
          ) {
            newLog.to = [i, j];
          }
        }
      }
    }
    return newLog;
  };

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
    console.log(from, to);
    socket.emit("moved", { chessMoved: { from, to } });
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
  const swapSide = () => {
    const newChessBoard = [...currentChessBoard].reverse();
    setCurrentChessBoard(newChessBoard);
  };
  return (
    <>
      <div className="w-[580px] h-[660px] bg-[url('./assets/images/broad.png')] p-3 object-scale-down bg-no-repeat bg-cover">
        {currentChessBoard.map((row, rowIndex) => (
          <div className="flex" key={rowIndex}>
            {row.map((col, colIndex: number) => {
              return (
                <div
                  key={colIndex}
                  className={`w-[70px] h-[62px] flex justify-center items-center gap-0 scale-[1.4] mx-1`}
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
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <div
                          className={`w-[50px] h-[50px] flex justify-center items-center transition-all duration-500 ${
                            rowIndex === selectedPostion?.row &&
                            colIndex === selectedPostion?.col
                              ? "scale-[1.2]"
                              : ""
                          }`}
                        >
                          <img
                            src={`src/assets/images/${col.type}.png`}
                            alt=""
                          />
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        {Object.keys(LIMIT_CHESS_BY_TYPE)
                          .sort()
                          .filter((item) => {
                            return item[0] === col.type[0] && item[1] !== "k";
                          })
                          .map((item, index) => {
                            return (
                              <ContextMenuItem
                                key={index}
                                onClick={(e: Event) => {
                                  e.stopPropagation();
                                  const temp = [...currentChessBoard];
                                  if (temp[rowIndex][colIndex] !== "") {
                                    temp[rowIndex][colIndex].type =
                                      item as CHESS_PIECES;
                                  }
                                  setCurrentChessBoard(temp);
                                }}
                              >
                                {
                                  NAME_CHESS[
                                    item as Exclude<
                                      CHESS_PIECES,
                                      "" | "bn" | "rn"
                                    >
                                  ]
                                }
                              </ContextMenuItem>
                            );
                          })}
                      </ContextMenuContent>
                    </ContextMenu>
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
        <button
          className="bg-purple-200 py-2 px-3 rounded-lg"
          onClick={swapSide}
        >
          Swap
        </button>
        <select
          name="chessList"
          id="chess-dropdown"
          value={"bk"}
          onChange={(e) => {
            const chess = e.target.value as CHESS_PIECES;

            setCurrentChessBoard(
              [...currentChessBoard].map((row) =>
                row.map((c) => (c ? { ...c, show: false, type: chess } : ""))
              )
            );
          }}
        >
          {Object.keys(limitChessByType).map((chess) => (
            <option value={chess}>{chess}</option>
          ))}
        </select>
      </div>
    </>
  );
}

export default App;
