import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { SourceMapTest } from "./SourceMapTest";
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
      <p> Built <b>{((Date.now() - import.meta.env.BUILD_TIME)/1000).toFixed(0)} seconds ago</b></p>
      <p> Version: <b>{(()=>{

        const { VERSION } = import.meta.env;

        return VERSION;

      })()}</b></p>
      <p> SSR: <b>{import.meta.env.SSR ? 'true' : 'false'}</b></p>
      <p> SSR: <b>{import.meta.env[
        'SSR'
      ] ? 'true' : 'false'}</b></p>
      <SourceMapTest />
    </>
  )
}

export default App
