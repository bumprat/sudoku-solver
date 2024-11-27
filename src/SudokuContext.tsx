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
  JSON.parse(localStorage.getItem("savedData") || "false") ||
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

  const getSquareGroups = (squares: SquareData[][]) => {
    const groups = []
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      const rowGroup = []
      for (let colIndex = 0; colIndex < 9; colIndex++) {
        rowGroup.push(squares[rowIndex][colIndex])
      }
      groups.push(rowGroup)
    }
    for (let colIndex = 0; colIndex < 9; colIndex++) {
      const colGroup = []
      for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
        colGroup.push(squares[rowIndex][colIndex])
      }
      groups.push(colGroup)
    }
    for (let _3x3RowIndex = 0; _3x3RowIndex < 3; _3x3RowIndex++) {
      for (let _3x3ColIndex = 0; _3x3ColIndex < 3; _3x3ColIndex++) {
        const _3x3Group = []
        for (let _3x3r = 0; _3x3r < 3; _3x3r++) {
          for (let _3x3c = 0; _3x3c < 3; _3x3c++) {
            _3x3Group.push(
              squares[_3x3RowIndex * 3 + _3x3r][_3x3ColIndex * 3 + _3x3c]
            )
          }
        }
        groups.push(_3x3Group)
      }
    }
    return groups
  }

  /**
   * Generates all combinations of n elements from the given array
   * @param arr - The input array
   * @param n - Number of elements in each combination
   * @returns - An array of combinations
   */
  function getCombinations<T>(arr: T[], n: number): T[][] {
    const result: T[][] = []

    // Recursive helper function
    function helper(start: number, combo: T[]) {
      if (combo.length === n) {
        result.push([...combo])
        return
      }
      for (let i = start; i < arr.length; i++) {
        combo.push(arr[i])
        helper(i + 1, combo)
        combo.pop()
      }
    }

    helper(0, [])
    return result
  }

  const solveStep = () => {
    console.log("求解一步")
    // 重置所有可能解
    squares.forEach((row, rowIndex) => {
      row.forEach((square, colIndex) => {
        square.notes.forEach((n, num) => {
          if (square.num.value) {
            n.value = num + 1 === square.num.value
          } else {
            n.value = true
          }
        })
      })
    })
    const squareGroups = getSquareGroups(squares)
    console.log(squareGroups)
    setSquares([...squares])
  }

  const solveAll = () => {}

  return (
    <SudokuContext.Provider
      value={{ squares, logs, colors, fillSquare, solveStep, solveAll }}
    >
      {children}
    </SudokuContext.Provider>
  )
}
