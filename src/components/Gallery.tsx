import { useState } from 'react'
import './Gallery.css'
import { Image } from '../types'

interface GalleryProps {
  images: Image[]
}

const Gallery = ({ images }: GalleryProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="gallery">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="gallery-item"
          style={{ animationDelay: `${index * 0.05}s` }}
          onMouseEnter={() => setHoveredId(image.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="image-wrapper">
            <img src={image.url} alt={image.filename} loading="lazy" />
            <div className={`image-overlay ${hoveredId === image.id ? 'visible' : ''}`}>
              <div className="image-info-overlay">
                <p className="image-filename">{image.filename}</p>
                {image.size && (
                  <p className="image-size">{(image.size / 1024).toFixed(2)} KB</p>
                )}
              </div>
              <div className="image-actions">
                <button className="action-button" title="View">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                <button className="action-button" title="Download">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Gallery

