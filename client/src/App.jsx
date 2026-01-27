import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    // This fetches from http://localhost:5173/api
    // The Proxy forwards it to http://localhost:5000/
    fetch('/api')
      .then(res => res.json())
      .then(data => setMessage(data.message)) // "Server is running..."
      .catch(err => console.error("Error connecting to server:", err))
  }, [])

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial' }}>
      <h1>Portfolio Dashboard</h1>
      <p>Backend Status: <strong>{message || "Loading..."}</strong></p>
    </div>
  )
}

export default App