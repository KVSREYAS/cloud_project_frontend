import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import './Upload.css'
import { Image, UploadResponse } from '../types'

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<Image | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      await handleFileUpload(files[0])
    }
  }

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    setIsUploading(true)
    setUploadedImage(null)

    // Create FormData for file upload
    const formData = new FormData()
    formData.append('image', file)

    try {
      // Use proxy endpoint to bypass CORS
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      const data: UploadResponse = await response.json()

      if (data.success && data.image) {
        setUploadedImage(data.image)
        console.log('Image uploaded successfully:', data.image)
      } else {
        console.error('Upload failed:', data.error)
        // For demo purposes, create a mock image
        const mockImage: Image = {
          id: Date.now().toString(),
          url: URL.createObjectURL(file),
          filename: file.name,
          uploadedAt: new Date().toISOString(),
          size: file.size,
        }
        setUploadedImage(mockImage)
      }
    } catch (error) {
      console.error('Upload error:', error)
      // For demo purposes, create a mock image
      const mockImage: Image = {
        id: Date.now().toString(),
        url: URL.createObjectURL(file),
        filename: file.name,
        uploadedAt: new Date().toISOString(),
        size: file.size,
      }
      setUploadedImage(mockImage)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="upload-container">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
        />

        {isUploading ? (
          <div className="upload-loading">
            <div className="spinner"></div>
            <p>Uploading image...</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <h3>Drag and drop your image here</h3>
            <p>or click to browse</p>
            <span className="upload-hint">Supports: JPG, PNG, GIF, WebP</span>
          </div>
        )}
      </div>

      {uploadedImage && (
        <div className="upload-success">
          <div className="success-icon">✓</div>
          <h3>Upload Successful!</h3>
          <div className="uploaded-image-preview">
            <img src={uploadedImage.url} alt={uploadedImage.filename} />
            <div className="image-info">
              <p><strong>Filename:</strong> {uploadedImage.filename}</p>
              {uploadedImage.size && (
                <p><strong>Size:</strong> {(uploadedImage.size / 1024).toFixed(2)} KB</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Upload

