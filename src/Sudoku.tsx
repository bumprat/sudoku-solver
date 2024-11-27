// src/Sudoku.tsx
import React, { useContext } from "react"
import Square from "./Square"
import { SudokuContext } from "./SudokuContext"

const Sudoku: React.FC = () => {
  let { logs, solveStep } = useContext(SudokuContext)
  return (
    <div className="flex flex-col items-center m-4">
      <div className="flex flex-col select-none">
        <div className="flex flex-row">
          {Array(10)
            .fill(null)
            .map((_, colIndex) => (
              <div
                key={colIndex}
                className="w-[50px] h-[50px] flex items-center justify-center"
              >
                {colIndex == 0
                  ? "行列"
                  : String.fromCharCode("A".charCodeAt(0) + colIndex - 1)}
              </div>
            ))}
        </div>
        {Array(9)
          .fill(null)
          .map((_, rowIndex) => (
            <div className="flex" key={rowIndex}>
              <div className="w-[50px] flex justify-center items-center">
                {rowIndex + 1}
              </div>
              {Array(9)
                .fill(null)
                .map((_, colIndex) => (
                  <Square
                    key={`${rowIndex}-${colIndex}`}
                    row={rowIndex}
                    col={colIndex}
                  />
                ))}
            </div>
          ))}
      </div>
      <div className="text-left w-[500px] m-4 flex flex-row justify-center space-x-8">
        <button
          className="border border-solid border-black p-4 rounded-full"
          onClick={solveStep}
        >
          运算一步
        </button>
        <button className="border border-solid border-black p-4 rounded-full">
          运算到结束
        </button>
        <button className="border border-solid border-black p-4 rounded-full">
          清空
        </button>
      </div>
      <div className="text-left w-[500px] m-4 max-h-[100px] overflow-auto">
        <pre>{logs}</pre>
      </div>
    </div>
  )
}

export default Sudoku
