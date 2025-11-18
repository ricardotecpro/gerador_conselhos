import React, { useContext, useRef, useState } from 'react'
import styled from 'styled-components'
import { AdviceContext } from '../contexts/AdviceContext'
import AdviceCard from './AdviceCard'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f0f4f8;
  position: relative;
  padding: 24px 12px;
  gap: 16px;
`

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`

const Title = styled.h1`
  margin: 0;
  font-size: 50px;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: center;
  z-index: 10;
`

const Button = styled.button`
  background: #2b6cb0;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const ControlsRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const NumberInput = styled.input`
  width: 72px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e0;
  font-size: 16px;
  text-align: center;
`

const HistoryList = styled.ul`
  margin: 12px 0 0 0;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  max-width: 640px;
  list-style: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
`

const HistoryItem = styled.li`
  padding: 6px 0;
  border-bottom: 1px solid #edf2f7;
  &:last-child { border-bottom: none }
`

export default function App() {
  const { advice, setAdvice, loading, setLoading, error, setError } = useContext(AdviceContext)
  const { addToHistory, getLastN } = useContext(AdviceContext)
  const cooldownRef = useRef(false)
  const controlsRef = useRef(null)
  const [showHistory, setShowHistory] = useState(false)
  const [historyCount, setHistoryCount] = useState(3)
  const [currentHistory, setCurrentHistory] = useState([])
  const [warning, setWarning] = useState('')


  async function fetchAdvice() {
    if (cooldownRef.current) return
    cooldownRef.current = true
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`https://api.adviceslip.com/advice?_=${Date.now()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const text = data.slip.advice
      setAdvice(text)
      // adicionar ao histórico
      try { addToHistory(text) } catch (e) { /* noop */ }
    } catch (err) {
      setError(err.message || 'Erro ao buscar conselho')
    } finally {
      setLoading(false)
      // libera o cooldown após 800ms
      setTimeout(() => {
        cooldownRef.current = false
      }, 800)
    }
  }

  function handleShowHistory() {
    setWarning('')
    const n = Number(historyCount)
    if (Number.isNaN(n) || !isFinite(n)) {
      setWarning('Por favor insira um número válido.')
      return
    }
    if (n <= 1) {
      setWarning('O número precisa ser maior que 1.')
      return
    }

    const list = getLastN(n)
    if (list.length === 0) {
      setWarning('Nenhum histórico disponível.')
      setCurrentHistory([])
      setShowHistory(true)
      return
    }

    if (list.length < n) {
      setWarning(`Só existem ${list.length} item(ns) no histórico — mostrando os disponíveis.`)
    }

    setCurrentHistory(list)
    setShowHistory(true)
  }

  return (
    <Container>
      <Title>{'💌 Gerador de Conselhos'}</Title>
      <Controls ref={controlsRef}>
        <AdviceCard advice={advice} loading={loading} error={error} />
        <ControlsRow>
          <Button onClick={fetchAdvice} disabled={loading} aria-disabled={loading}>
            {loading ? 'Buscando...' : 'Gerar conselho'}
          </Button>
          <NumberInput type="number" min="1" value={historyCount} onChange={(e) => setHistoryCount(e.target.value)} aria-label="Quantidade de históricos" />
          <Button onClick={handleShowHistory}>
            {showHistory ? 'Ocultar histórico' : 'Mostrar histórico'}
          </Button>
        </ControlsRow>

        {warning && <div style={{ color: '#a65', marginTop: 8 }}>{warning}</div>}

        {showHistory && (
          <HistoryList>
            {currentHistory.length === 0 && <HistoryItem>Nenhum histórico para mostrar</HistoryItem>}
            {currentHistory.map((h, idx) => (
              <HistoryItem key={idx}>“{h}”</HistoryItem>
            ))}
          </HistoryList>
        )}
      </Controls>
    </Container>
  )
}
