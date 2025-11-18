import React from 'react'
import styled from 'styled-components'

const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  min-width: 320px;
  max-width: 640px;
  text-align: center;
`

const Text = styled.p`
  font-size: 18px;
  color: #1a202c;
  margin: 0;
`

const Placeholder = styled.div`
  color: #718096;
`

const ErrorText = styled.div`
  color: #c53030;
`

export default function AdviceCard({ advice, loading, error }) {
  return (
    <Card>
      {loading && <Placeholder>Buscando conselho...</Placeholder>}
      {!loading && error && <ErrorText>{error}</ErrorText>}
      {!loading && !error && !advice && (
        <Placeholder>Clique no botão para gerar um conselho</Placeholder>
      )}
      {!loading && !error && advice && <Text>“{advice}”</Text>}
    </Card>
  )
}
