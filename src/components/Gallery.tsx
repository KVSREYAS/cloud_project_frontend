import { useState } from 'react'
import './Gallery.css'
import { Image } from '../types'

interface GalleryProps {
  images: Image[]
}

const Gallery = ({ images }: GalleryProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)

  const handleImageClick = (image: Image) => {
    setSelectedImage(image)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  return (
    <>
      <div className="gallery">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="gallery-item"
            style={{ animationDelay: `${index * 0.05}s` }}
            onMouseEnter={() => setHoveredId(image.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handleImageClick(image)}
          >
            <div className="image-wrapper">
              <img src={image.url} alt={image.filename} loading="lazy" />
              <div className={`image-overlay ${hoveredId === image.id ? 'visible' : ''}`}>
                <div className="image-info-overlay">
                  <p className="image-filename">{image.filename}</p>
                  {image.size && (
                    <p className="image-size">{(image.size / 1024).toFixed(2)} KB</p>
                  )}
                  {image.labels && image.labels.length > 0 && (
                    <p className="image-labels-count">{image.labels.length} label{image.labels.length !== 1 ? 's' : ''}</p>
                  )}
                </div>
                <div className="image-actions">
                  <button 
                    className="action-button" 
                    title="View Labels"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleImageClick(image)
                    }}
                  >
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
                  <button 
                    className="action-button" 
                    title="Download"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(image.url, '_blank')
                    }}
                  >
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

      {selectedImage && (
        <div className="image-modal-overlay" onClick={closeModal}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="modal-image-container">
              <img src={selectedImage.url} alt={selectedImage.filename} />
            </div>
            <div className="modal-content">
              <h3 className="modal-filename">{selectedImage.filename}</h3>
              {selectedImage.labels && selectedImage.labels.length > 0 && (
                <div className="modal-labels">
                  <h4 className="modal-labels-title">Labels</h4>
                  <div className="labels-container">
                    {selectedImage.labels.map((label, index) => (
                      <span key={index} className="label-tag">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Gallery

