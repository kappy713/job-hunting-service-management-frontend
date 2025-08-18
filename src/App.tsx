import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo Section */}
        <div className="flex justify-center items-center space-x-8 mb-8">
          <a 
            href="https://vite.dev" 
            target="_blank" 
            className="group transition-transform hover:scale-110 duration-300"
          >
            <img 
              src={viteLogo} 
              className="h-16 w-16 drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300" 
              alt="Vite logo" 
            />
          </a>
          <div className="text-4xl font-bold text-white opacity-70">+</div>
          <a 
            href="https://react.dev" 
            target="_blank" 
            className="group transition-transform hover:scale-110 duration-300"
          >
            <img 
              src={reactLogo} 
              className="h-16 w-16 drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300 animate-spin" 
              style={{animationDuration: '10s'}}
              alt="React logo" 
            />
          </a>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-white mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Vite + React
        </h1>

        {/* Counter Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            Count is {count}
          </button>
          <p className="text-white/80 mt-6 text-lg">
            Edit <code className="bg-black/30 px-2 py-1 rounded text-cyan-300 font-mono">src/App.tsx</code> and save to test HMR
          </p>
        </div>

        {/* Footer */}
        <p className="text-white/60 text-lg hover:text-white/80 transition-colors duration-300">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
