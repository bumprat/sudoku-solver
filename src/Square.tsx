// src/Square.tsx
import React, { useContext } from "react"
import { SudokuContext } from "./SudokuContext"

interface SquareProps {
  row: number
  col: number
}

const Square: React.FC<SquareProps> = ({ row, col }) => {
  const { squares, fillSquare, colors } = useContext(SudokuContext)
  const squareData = squares[row][col]

  const handleValueChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let keyValue
    if (e.key === "Backspace" || e.key === "Delete") {
      keyValue = null
    } else {
      keyValue = parseInt(e.key)
      if (isNaN(keyValue)) return
      if (keyValue === 0) return
    }
    if (keyValue === squareData.num.value) return
    fillSquare(row, col, {
      ...squareData,
      num: { value: keyValue, highlight: false },
      isProvided: true,
    })
  }

  return (
    <div
      className={`
            ${col % 3 === 0 ? "border-l-2" : ""} ${
        col % 3 === 2 ? "border-r-2" : ""
      }
            ${row % 3 === 0 ? "border-t-2" : ""} ${
        row % 3 === 2 ? "border-b-2" : ""
      }
            border border-solid border-black
            w-[50px] h-[50px] relative cursor-default
        `}
    >
      <div
        className={`grid grid-cols-3 grid-rows-3 w-full h-full
            top-0 left-0 absolute ${
              squareData.num.value ? "invisible" : "visible"
            }`}
      >
        {squareData.notes.map((note, index) => (
          <div
            key={index}
            className={`w-full h-full p-0
                                text-center text-[10px] 
                                flex items-center justify-center
                                cursor-none 
                                ${
                                  note.value ? "text-black" : "text-transparent"
                                }
                                ${note.highlight ? "font-black" : ""}`}
            style={{
              backgroundColor: note.highlight
                ? colors.noteHighlight
                : undefined,
              color: note.highlight ? colors.noteTextHighlight : undefined,
            }}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <div
        className={`w-full h-full text-center 
            top-0 left-0 absolute`}
      >
        <input
          type="text"
          maxLength={1}
          className={`w-full h-full text-center
                        border-none outline-none 
                        text-2xl bg-transparent 
                        cursor-pointer caret-transparent
                        ${
                          squareData.isProvided || squareData.num.highlight
                            ? "font-bold"
                            : ""
                        }
                    `}
          style={{
            backgroundColor: squareData.highlight
              ? colors.squareHighlight
              : undefined,
            color: squareData.num.highlight
              ? colors.squareTextHighlight
              : undefined,
          }}
          value={
            squareData.num.value !== null ? squareData.num.value.toString() : ""
          }
          onKeyDown={handleValueChange}
          onChange={() => {}}
          onFocus={(e) => (e.target.style.backgroundColor = "rgb(254 249 195)")}
          onBlur={(e) =>
            (e.target.style.backgroundColor = squareData.highlight
              ? colors.squareHighlight
              : "")
          }
        />
      </div>
    </div>
  )
}

export default Square
