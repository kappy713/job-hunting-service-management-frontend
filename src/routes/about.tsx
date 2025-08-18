import { Link } from 'react-router'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <nav className="mb-8">
          <Link 
            to="/" 
            className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-lg text-white hover:bg-white/30 transition-all duration-300"
          >
            ← Home
          </Link>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            About Our Project
          </h1>
          <p className="text-xl text-white/80">
            A modern web application built with React and TailwindCSS
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">🎯 Our Mission</h2>
            <p className="text-white/80 leading-relaxed">
              This project demonstrates modern web development practices using 
              React, TypeScript, TailwindCSS, and React Router v7.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">⚡ Key Features</h2>
            <ul className="text-white/80 space-y-2">
              <li>• Modern React with TypeScript</li>
              <li>• Beautiful TailwindCSS styling</li>
              <li>• React Router v7 navigation</li>
              <li>• Responsive design</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">🚀 Technology Stack</h2>
            <p className="text-white/80 leading-relaxed">
              Built with Vite for fast development, React for UI components, 
              and TailwindCSS for beautiful, maintainable styles.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">💝 Open Source</h2>
            <p className="text-white/80 leading-relaxed">
              This project serves as a template for modern React applications 
              with best practices and clean architecture.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link 
            to="/" 
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
