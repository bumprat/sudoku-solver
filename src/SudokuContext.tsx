// src/SudokuContext.tsx
import React, { createContext, useState, useRef, ReactNode } from "react"

interface SquareData {
  num: {
    value: number | null
    highlight: boolean
  }
  notes: {
    value: boolean
    highlight: boolean
  }[]
  highlight: boolean
  isProvided: boolean
}

interface colorScheme {
  textProvided: string
  squareProvided: string
  squareTextHighlight: string
  squareHighlight: string
  noteHighlight: string
  noteTextHighlight: string
}

interface SudokuContextProps {
  squares: SquareData[][]
  colors: colorScheme
  logs: String
  fillSquare: (row: number, col: number, newValue: SquareData) => void
  solveStep: () => void
  solveAll: () => void
}

const initialSquares: SquareData[][] =
  JSON.parse(localStorage.getItem("savedData") || "false") &&
  Array(9)
    .fill(null)
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => ({
          num: {
            value: Math.ceil(Math.random() * 9),
            highlight: !Math.round(Math.random()),
          },
          notes: Array(9)
            .fill(null)
            .map(() => ({
              value: !Math.round(Math.random()),
              highlight: !Math.round(Math.random()),
            })),
          highlight: !Math.round(Math.random()),
          isProvided: !Math.round(Math.random()),
        }))
    )

const colorPreset = {
  textProvided: "#000",
  squareProvided: "#eee",
  squareTextHighlight: "#126bc4",
  squareHighlight: "#e0f7ff",
  noteHighlight: "#e0f7ff",
  noteTextHighlight: "#126bc4",
}

export const SudokuContext = createContext<SudokuContextProps>({
  squares: initialSquares,
  logs: "",
  colors: colorPreset,
  fillSquare: () => {},
  solveStep: () => {},
  solveAll: () => {},
})

export const SudokuProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [squares, setSquares] = useState<SquareData[][]>(initialSquares)
  const [logs, setLogs] = useState<string>("在这里显示日志")

  const log = (txt: String) => {
    setLogs(txt + "\n" + logs)
  }

  const address = (row: number, col: number) => {
    return `${String.fromCharCode("A".charCodeAt(0) + col)}${row + 1}`
  }

  const fillSquare = (row: number, col: number, newValue: SquareData) => {
    const newSquares = [...squares]
    const oldValue = newSquares[row][col].num.value
    newSquares[row][col] = newValue
    newSquares.forEach((row) => {
      row.forEach((square) => {
        square.num.value = square.isProvided ? square.num.value : null
        square.num.highlight = false
        square.notes.forEach((note) => {
          note.highlight = false
          note.value = false
        })
        square.highlight = false
      })
    })
    setSquares(newSquares)
    localStorage.setItem("savedData", JSON.stringify(newSquares))
    log(
      `在${address(row, col)}中${
        newValue.num.value
          ? `填入数字` + newValue.num.value
          : "删除数字" + oldValue
      }，重启计算过程......`
    )
  }

  const colors = colorPreset

  const solveStep = () => {}

  const solveAll = () => {}

  return (
    <SudokuContext.Provider
      value={{ squares, logs, colors, fillSquare, solveStep, solveAll }}
    >
      {children}
    </SudokuContext.Provider>
  )
}
