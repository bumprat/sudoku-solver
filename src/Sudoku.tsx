// src/Sudoku.tsx
import React, { useContext } from "react"
import Square from "./Square"
import { SudokuContext } from "./SudokuContext"

const Sudoku: React.FC = () => {
  let { logs, solveStep, clear, solveUntilNot, reset, example } =
    useContext(SudokuContext)
  return (
    <div className="justify-top flex h-full flex-grow flex-col items-center">
      <div className="flex flex-grow-0 select-none flex-col">
        <div className="flex flex-row">
          {Array(10)
            .fill(null)
            .map((_, colIndex) => (
              <div
                key={colIndex}
                className="flex h-[9vw] max-h-[4vh] w-[9vw] max-w-[4vh] items-center justify-center"
              >
                {colIndex == 0
                  ? ""
                  : String.fromCharCode("A".charCodeAt(0) + colIndex - 1)}
              </div>
            ))}
        </div>
        {Array(9)
          .fill(null)
          .map((_, rowIndex) => (
            <div className="flex" key={rowIndex}>
              <div className="flex h-[9vw] max-h-[4vh] w-[9vw] max-w-[4vh] items-center justify-center">
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
      <div className="m-4 flex h-12 w-full flex-grow-0 flex-row items-stretch justify-center space-x-2 text-left text-xs">
        <button
          className="flex-1 border-[2px] border-solid border-black hover:bg-white"
          onClick={solveStep}
        >
          <img
            src="./play-pause-svgrepo-com.svg"
            className="inline h-6 align-middle"
            alt="icon"
          />
          <span>&nbsp;一步</span>
        </button>
        <button
          className="flex-1 border-[2px] border-solid border-black hover:bg-white"
          onClick={solveUntilNot}
        >
          <img
            src="./play-svgrepo-com.svg"
            className="inline h-6 align-middle"
            alt="icon"
          />
          &nbsp;全部
        </button>
        <button
          className="flex-1 border-[2px] border-solid border-black hover:bg-white"
          onClick={reset}
        >
          <img
            src="./restart-svgrepo-com.svg"
            className="inline h-6 align-middle"
            alt="icon"
          />
          &nbsp;重来
        </button>
        <button
          className="flex-1 border-[2px] border-solid border-black hover:bg-white"
          onClick={example}
        >
          <img
            src="./sudoku-svgrepo-com.svg"
            className="inline h-6 align-middle"
            alt="icon"
          />
          &nbsp;示例
        </button>
        <button
          className="flex-1 border-[2px] border-solid border-black hover:bg-white"
          onClick={clear}
        >
          <img
            src="./delete-dustbin-garbage-svgrepo-com.svg"
            className="inline h-6 align-middle"
            alt="icon"
          />
          &nbsp;清空
        </button>
      </div>
      <div className="m-2 w-[80vw] flex-1 basis-0 overflow-auto border-[2px] border-solid border-gray-500 bg-gray-200 p-2 text-left text-sm">
        <pre>{logs}</pre>
      </div>
    </div>
  )
}

export default Sudoku
