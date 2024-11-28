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

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.slice(-1)
    let keyValue
    if (code === "") {
      keyValue = null
    } else {
      keyValue = parseInt(code)
      if (isNaN(keyValue)) return
      if (keyValue === 0) return
    }
    if (keyValue === squareData.num.value) return
    fillSquare({
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
            w-[30px] h-[30px] relative cursor-default
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
          maxLength={2}
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
          onInput={handleValueChange}
          onChange={() => {}}
          onFocus={(e) => {
            e.target.style.backgroundColor = "rgb(254 249 195)"
            setTimeout(() =>
              e.target.setSelectionRange(
                e.target.value.length,
                e.target.value.length
              )
            )
          }}
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
