// src/SudokuContext.tsx
import React, { createContext, useState, ReactNode, useRef } from "react"
import sampleData from "./sample-data.json"

interface note {
  value: boolean
  highlight: boolean
  reason: string | null
  blame: SquareData[]
}

interface SquareData {
  num: {
    value: number | null
    highlight: boolean
  }
  notes: note[]
  highlight: boolean
  isProvided: boolean
  row: number
  col: number
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
  fillSquare: (newValue: SquareData) => void
  solveStep: () => void
  solveUntilNot: () => void
  clear: () => void
  reset: () => void
  example: () => void
  log: any
}

const initialSquares: SquareData[][] =
  JSON.parse(localStorage.getItem("savedData") || "false") ||
  sampleData ||
  Array(9)
    .fill(null)
    .map((_, r) =>
      Array(9)
        .fill(null)
        .map(
          (_, c): SquareData => ({
            num: {
              value: Math.ceil(Math.random() * 9),
              highlight: !Math.round(Math.random()),
            },
            notes: Array(9)
              .fill(null)
              .map(() => ({
                value: !Math.round(Math.random()),
                highlight: !Math.round(Math.random()),
                reason: null,
                blame: [],
              })),
            highlight: !Math.round(Math.random()),
            isProvided: !Math.round(Math.random()),
            row: r + 1,
            col: c + 1,
          }),
        ),
    )

const colorPreset: colorScheme = {
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
  solveUntilNot: () => {},
  clear: () => {},
  reset: () => {},
  example: () => {},
  log: () => {},
})

export const SudokuProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  let [squares, setSquares] = useState<SquareData[][]>(initialSquares)
  const isInit = useRef(false)
  let [logs, setLogs] = useState<string>("在这里显示日志")

  const log = (txt: String) => {
    logs = txt + "\n" + logs
    setLogs(logs)
  }

  const address = (row: number, col: number) => {
    return `${String.fromCharCode("A".charCodeAt(0) + col - 1)}${row}`
  }

  const save = () => {
    const squaresCopy: SquareData[][] = JSON.parse(JSON.stringify(squares))
    squaresCopy.flat().forEach((square) => {
      if (!square.isProvided) {
        square.num.value = null
      }
      square.highlight = false
      square.num.highlight = false
      square.notes.forEach((n) => {
        n.highlight = false
        n.value = false
        n.reason = null
        n.blame = []
      })
    })
    localStorage.setItem("savedData", JSON.stringify(squaresCopy))
  }

  const fillSquare = (newValue: SquareData) => {
    const newSquares = [...squares]
    const oldValue = newSquares[newValue.row - 1][newValue.col - 1].num.value
    newSquares[newValue.row - 1][newValue.col - 1] = newValue
    setSquares(newSquares)
    reset()
    save()
    log(
      `在${address(newValue.row, newValue.col)}中${
        newValue.num.value
          ? `填入数字` + newValue.num.value
          : "删除数字" + oldValue
      }，重启计算过程......`,
    )
    isInit.current = false
  }

  const colors = colorPreset

  const getRowGroups = (squares: SquareData[][]) => {
    const groups: SquareData[][] = []
    for (let rowIndex = 0; rowIndex < squares.length; rowIndex++) {
      const rowGroup = []
      for (let colIndex = 0; colIndex < squares[0].length; colIndex++) {
        rowGroup.push(squares[rowIndex][colIndex])
      }
      groups.push(rowGroup)
    }
    return groups
  }

  const getColGroups = (squares: SquareData[][]) => {
    const groups: SquareData[][] = []
    for (let colIndex = 0; colIndex < squares[0].length; colIndex++) {
      const colGroup = []
      for (let rowIndex = 0; rowIndex < squares.length; rowIndex++) {
        colGroup.push(squares[rowIndex][colIndex])
      }
      groups.push(colGroup)
    }
    return groups
  }

  const getSmallGroups = (squares: SquareData[][]) => {
    const groups: SquareData[][] = []
    const n = Math.sqrt(squares.length)
    if (!Number.isInteger(n)) {
      return groups
    }
    for (let nRowIndex = 0; nRowIndex < n; nRowIndex++) {
      for (let nColIndex = 0; nColIndex < n; nColIndex++) {
        const nGroup = []
        for (let nr = 0; nr < n; nr++) {
          for (let nc = 0; nc < n; nc++) {
            nGroup.push(squares[nRowIndex * 3 + nr][nColIndex * 3 + nc])
          }
        }
        groups.push(nGroup)
      }
    }
    return groups
  }

  const getSquareGroups = (squares: SquareData[][]) => {
    let groups: SquareData[][] = []
    groups = groups.concat(getRowGroups(squares))
    groups = groups.concat(getColGroups(squares))
    groups = groups.concat(getSmallGroups(squares))
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

  // const getSquareIndex = (square: SquareData, squares: SquareData[][]) => {
  //   for (let rowIndex = 0; rowIndex < squares.length; rowIndex++) {
  //     for (let colIndex = 0; colIndex < squares[0].length; colIndex++) {
  //       if (squares[rowIndex][colIndex] === square) {
  //         return { rowIndex, colIndex }
  //       }
  //     }
  //   }
  // }

  const initNotes = () => {
    // 重置所有可能解
    squares.flat().forEach((square) => {
      square.notes.forEach((n, num) => {
        if (square.num.value) {
          n.value = num + 1 === square.num.value
        } else {
          n.value = true
        }
        n.reason = null
        n.blame = []
      })
    })
    isInit.current = true
  }

  const cyclingSolver = () => {
    //循环暗解
    const squareGroups = getSquareGroups(squares)
    const n_max = squares.length
    return Array(n_max)
      .fill(null)
      .some((_, i) => {
        let n = i + 1
        return squareGroups.some((group) => {
          return getCombinations(group, n).some((combo) => {
            const numbers = [
              ...new Set(
                combo
                  .map((square) =>
                    square.notes.map((n, i) => (n.value ? i + 1 : 0)),
                  )
                  .flat()
                  .filter((n) => n !== 0),
              ),
            ]
            if (numbers.length === n) {
              return group
                .filter((square) => !combo.includes(square))
                .some((square) => {
                  return numbers.some((number) => {
                    if (square.notes[number - 1].value) {
                      const note = square.notes[number - 1]
                      note.value = false
                      note.reason = "循环解"
                      note.blame = note.blame.concat(...combo)
                      return true
                    }
                  })
                })
            }
          })
        })
      })
  }

  const nByNSolver = () => {
    // 3x3暗解
    return getSmallGroups(squares).some((group) => {
      for (let num = 1; num <= 9; num++) {
        const contains = group.filter((square) => square.notes[num - 1].value)
        const rows = [...new Set(contains.map((square) => square.row))]
        const cols = [...new Set(contains.map((square) => square.col))]
        if (rows.length === 1) {
          squares.flat().filter((square) => {
            if (square.row === rows[0] && !contains.includes(square)) {
              if (square.notes[num - 1].value) {
                const note = square.notes[num - 1]
                note.value = false
                note.reason = "3x3暗解"
                note.blame = note.blame.concat(...contains)
                return true
              }
            }
          })
        }
        if (cols.length === 1) {
          squares.flat().filter((square) => {
            if (square.col === cols[0] && !contains.includes(square)) {
              if (square.notes[num - 1].value) {
                const note = square.notes[num - 1]
                note.value = false
                note.reason = "3x3暗解"
                note.blame = note.blame.concat(...contains)
                return true
              }
            }
          })
        }
      }
    })
  }

  const colName = (col: number) => {
    return String.fromCharCode("A".charCodeAt(0) + col - 1)
  }

  const checkNum: () => boolean = () => {
    return squares.some((row) =>
      row
        .filter((square) => square.num.value === null)
        .some((square) => {
          if (
            square.notes
              .map((n) => (n.value ? 1 : 0))
              .reduce<number>((p, c) => p + c, 0) === 1
          ) {
            square.num.value =
              square.notes.findIndex((n) => n.value === true) + 1
            square.num.highlight = true
            square.highlight = true
            const blames = [
              ...new Set(square.notes.map((note) => note.blame).flat()),
            ]
            blames.forEach((square) => {
              square.highlight = true
            })
            log(
              `发现${colName(square.col)}${square.row}的明解为${
                square.num.value
              }，原因为${blames.map((b) => address(b.row, b.col)).join("、")}。`,
            )
            return true
          }
        }),
    )
  }

  const checkFail = () => {
    return (
      squares.flat().some((square) => {
        if (!square.notes.some((note) => note.value === true)) {
          clearAllHighlights()
          square.highlight = true
          return true
        }
      }) ||
      getSquareGroups(squares).some((group) => {
        return getCombinations(group, 2).some((combo) => {
          if (combo.some((square) => square.num.value === null)) return false
          if (
            [...new Set(combo.map((square) => square.num.value))].length === 1
          ) {
            clearAllHighlights()
            combo.forEach((square) => (square.num.highlight = true))
            return true
          }
        })
      })
    )
  }

  const checkWin = () => {
    return !squares.flat().some((square) => {
      if (square.num.value === null) {
        return true
      }
    })
  }

  // @ts-ignore
  const clearAllHighlights = () => {
    squares.flat().forEach((square) => {
      square.highlight = false
      square.num.highlight = false
      square.notes.forEach((n) => {
        n.highlight = false
      })
    })
    setSquares([...squares])
  }

  const solveStep: () => boolean = () => {
    if (isInit.current === false) initNotes()
    clearAllHighlights()
    if (checkFail()) {
      log("解算失败")
      return false
    }
    if (checkWin()) {
      log("解算完毕")
      return false
    }
    while (cyclingSolver() || nByNSolver()) {
      setSquares([...squares])
      if (checkNum()) return true
    }
    return false
  }

  const solveUntilNot = () => {
    if (isInit.current === false) initNotes()
    while (solveStep()) {}
    setSquares([...squares])
  }

  const reset = () => {
    squares.flat().forEach((square) => {
      square.num.value = square.isProvided ? square.num.value : null
      square.isProvided = square.num.value === null ? false : true
      square.num.highlight = false
      square.notes.forEach((note) => {
        note.highlight = false
        note.value = false
        note.reason = null
        note.blame = []
      })
      square.highlight = false
    })
    setSquares([...squares])
    isInit.current = false
  }

  const clear = () => {
    squares.flat().forEach((square) => {
      square.num.value = null
      square.num.highlight = false
      square.isProvided = false
      square.highlight = false
      square.notes.forEach((note) => {
        note.value = false
        note.highlight = false
        note.reason = null
        note.blame = []
      })
    })
    setSquares([...squares])
    setLogs("")
    save()
  }

  const example = () => {
    squares = JSON.parse(JSON.stringify(sampleData))
    isInit.current = false
    setSquares([...squares])
    log("加载示例数据")
    save()
  }

  return (
    <SudokuContext.Provider
      value={{
        squares,
        logs,
        colors,
        fillSquare,
        solveStep,
        solveUntilNot,
        clear,
        reset,
        example,
        log,
      }}
    >
      {children}
    </SudokuContext.Provider>
  )
}
