import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SudokuProvider } from './SudokuContext.tsx'
import Sudoku from './Sudoku.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SudokuProvider>
      <Sudoku />
    </SudokuProvider>
  </StrictMode>,
)
