export async function generateImageUri(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.set('file', file)

    const response = await fetch('/api/files', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const url = await response.json()
    return url
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image to IPFS')
  }
}
