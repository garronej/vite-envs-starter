import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p> Title: <b>{import.meta.env.TITLE}</b></p>
      <p> Build time: <b>{new Date(import.meta.env.BUILD_TIME).toString()}</b></p>
      <p> Version: <b>{import.meta.env.VERSION}</b></p>
    </>
  )
}

console.log("TITLE", import.meta.env.TITLE);
console.log("SSR", import.meta.env.SSR);
console.log("SSR2", import.meta.env["SSR"]);
console.log("SSR3", import.meta.env['SSR']);
console.log("SSR4", import.meta
  .env['SSR']);

export default App
