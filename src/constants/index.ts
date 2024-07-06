export type CHESS_PIECES =
  | "bx"
  | "bm"
  | "bt"
  | "bs"
  | "bk"
  | "bp"
  | "bb"
  | "rb"
  | "rp"
  | "rx"
  | "rm"
  | "rt"
  | "rs"
  | "rk"
  | ""
  | "bn"
  | "rn";
export type CHESSS_OBJ = { key: string; type: CHESS_PIECES };

export const INIT_CHESS_BOARD: Array<(CHESSS_OBJ & { show?: boolean }) | "">[] =
  [
    [
      {
        type: "bx",
        key: "bx1",
      },
      {
        type: "bm",
        key: "bm1",
      },
      {
        type: "bt",
        key: "bt1",
      },
      {
        type: "bs",
        key: "bs1",
      },
      {
        type: "bk",
        key: "bk1",
      },
      {
        type: "bs",
        key: "bs2",
      },
      {
        type: "bt",
        key: "bt2",
      },
      {
        type: "bm",
        key: "bm2",
      },
      {
        type: "bx",
        key: "bx2",
      },
    ],
    ["", "", "", "", "", "", "", "", ""],

    [
      "",
      { type: "bp", key: "bp1" },
      "",
      "",
      "",
      "",
      "",
      { type: "bp", key: "bp2" },
      "",
    ],
    [
      {
        type: "bb",
        key: "bb1",
      },
      "",
      {
        type: "bb",
        key: "bb2",
      },
      "",
      {
        type: "bb",
        key: "bb3",
      },
      "",
      {
        type: "bb",
        key: "bb4",
      },
      "",
      {
        type: "bb",
        key: "bb5",
      },
    ],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    [
      {
        type: "rb",
        key: "rb1",
      },
      "",
      {
        type: "rb",
        key: "rb2",
      },
      "",
      {
        type: "rb",
        key: "rb3",
      },
      "",
      {
        type: "rb",
        key: "rb4",
      },
      "",
      {
        type: "rb",
        key: "rb5",
      },
    ],
    [
      "",
      { type: "rp", key: "rp1" },
      "",
      "",
      "",
      "",
      "",
      { type: "rp", key: "rp2" },
      "",
    ],
    ["", "", "", "", "", "", "", "", ""],
    [
      {
        type: "rx",
        key: "rx1",
      },
      {
        type: "rm",
        key: "rm1",
      },
      {
        type: "rt",
        key: "rt1",
      },
      {
        type: "rs",
        key: "rs1",
      },
      {
        type: "rk",
        key: "rk1",
      },
      {
        type: "rs",
        key: "rs2",
      },
      {
        type: "rt",
        key: "rt2",
      },
      {
        type: "rm",
        key: "rm2",
      },
      {
        type: "rx",
        key: "rx2",
      },
    ],
  ];
export const KING_POSITION = {
  rk: { row: 9, col: 4 },
  bk: { row: 0, col: 4 },
};
export const LIMIT_CHESS_BY_TYPE = {
  rk: 1,
  bk: 1,
  rp: 2,
  bp: 2,
  rx: 2,
  bx: 2,
  rm: 2,
  bm: 2,
  rt: 2,
  bt: 2,
  rs: 2,
  bs: 2,
  bb: 5,
  rb: 5,
};
