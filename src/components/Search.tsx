import { useState, FormEvent } from 'react'
import './Search.css'
import Gallery from './Gallery'
import { Image, ImageListResponse } from '../types'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [images, setImages] = useState<Image[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      // Use proxy endpoint to bypass CORS
      const url = `/api/get_images?label=${encodeURIComponent(searchQuery)}`
      console.log('Fetching from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      console.log('Response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ImageListResponse = await response.json()
      console.log('Parsed data:', data)

      if (data.images && Array.isArray(data.images)) {
        // Convert array of URLs to Image objects
        const imageObjects: Image[] = data.images.map((url, index) => {
          // Extract filename from URL
          const urlParts = url.split('/')
          const filename = urlParts[urlParts.length - 1]
          // Decode URL-encoded filename
          const decodedFilename = decodeURIComponent(filename)
          
          return {
            id: `${Date.now()}-${index}`,
            url: url,
            filename: decodedFilename,
            uploadedAt: new Date().toISOString(),
          }
        })
        
        setImages(imageObjects)
        console.log('Search results:', imageObjects)
      } else {
        console.error('Invalid response format:', data)
        setImages([])
      }
    } catch (error) {
      console.error('Search error:', error)
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
      console.error('Error message:', error instanceof Error ? error.message : String(error))
      setImages([])
      
      // Check if it's a CORS error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('CORS Error detected - the server is not sending CORS headers.')
        console.error('Check browser Network tab for details. Postman works because it doesn\'t enforce CORS.')
        alert('CORS error: The server needs to allow cross-origin requests. Check browser console for details.')
      } else {
        alert(`Failed to search images: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images by keyword, filename, or tags..."
            className="search-input"
            disabled={isSearching}
          />
          <button
            type="submit"
            className="search-button"
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <div className="search-spinner"></div>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            )}
          </button>
        </div>
      </form>

      {isSearching && (
        <div className="search-loading">
          <div className="search-loading-spinner"></div>
          <p>Searching...</p>
        </div>
      )}

      {hasSearched && !isSearching && (
        <div className="search-results">
          <h3 className="results-header">
            {images.length > 0
              ? `Found ${images.length} image${images.length !== 1 ? 's' : ''}`
              : 'No images found'}
          </h3>
          {images.length > 0 && <Gallery images={images} />}
        </div>
      )}

      {!hasSearched && (
        <div className="search-placeholder">
          <div className="placeholder-icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          <h3>Start searching for images</h3>
          <p>Enter keywords, filenames, or tags to find your images</p>
        </div>
      )}
    </div>
  )
}

export default Search

