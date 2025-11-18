import React, { createContext, useState, useCallback } from 'react'

export const AdviceContext = createContext()

export function AdviceProvider({ children }) {
  const [advice, setAdvice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // histórico de conselhos 
  const [history, setHistory] = useState([])

  const addToHistory = useCallback((text) => {
    if (!text) return
    setHistory((prev) => [text, ...prev])
  }, [])

  const getLastN = useCallback((n) => {
    if (!n || n <= 0) return []
    return history.slice(0, n)
  }, [history])

  return (
    <AdviceContext.Provider value={{ advice, setAdvice, loading, setLoading, error, setError, history, addToHistory, getLastN }}>
      {children}
    </AdviceContext.Provider>
  )
}
