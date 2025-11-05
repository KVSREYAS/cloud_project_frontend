import { useState } from 'react'
import './App.css'
import Upload from './components/Upload'
import Search from './components/Search'

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'search'>('upload')

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Image Vault</h1>
        <p className="app-subtitle">Store, search, and discover your images</p>
      </header>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload
        </button>
        <button
          className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'upload' ? <Upload /> : <Search />}
      </div>
    </div>
  )
}

export default App

