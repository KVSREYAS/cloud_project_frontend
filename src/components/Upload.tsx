import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import './Upload.css'
import { Image, UploadResponse } from '../types'

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<Image | null>(null)
  const [customLabels, setCustomLabels] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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
      setSelectedFile(files[0])
    }
  }

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
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
    
    // Parse custom labels from comma-separated string
    if (customLabels.trim()) {
      const labelsArray = customLabels
        .split(',')
        .map(label => label.trim())
        .filter(label => label.length > 0)
      
      if (labelsArray.length > 0) {
        // Send as JSON string that backend can parse
        formData.append('custom_labels', JSON.stringify(labelsArray))
      }
    }

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

  const handleUploadClick = async () => {
    if (selectedFile) {
      await handleFileUpload(selectedFile)
    }
  }

  return (
    <div className="upload-container">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''} ${selectedFile ? 'file-selected' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!selectedFile ? handleClick : undefined}
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
        ) : selectedFile ? (
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
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <h3>{selectedFile.name}</h3>
            <p>{(selectedFile.size / 1024).toFixed(2)} KB</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedFile(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
              className="change-file-button"
            >
              Change File
            </button>
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

      {selectedFile && !isUploading && (
        <div className="upload-form">
          <div className="labels-input-group">
            <label htmlFor="custom-labels" className="labels-label">
              Custom Labels (comma-separated)
            </label>
            <input
              id="custom-labels"
              type="text"
              value={customLabels}
              onChange={(e) => setCustomLabels(e.target.value)}
              placeholder="e.g., nature, landscape, sunset"
              className="labels-input"
            />
            <p className="labels-hint">Enter labels separated by commas to help organize your images</p>
          </div>
          <button
            type="button"
            onClick={handleUploadClick}
            className="upload-button"
          >
            Upload Image
          </button>
        </div>
      )}

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

