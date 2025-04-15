import loadingAsset from '@/app/public/loadingAsset.gif'

// Simple in-memory cache
const imageCache = new Map<string, string>()

export async function getImageFromMetadata(metadataUri: string): Promise<string> {
  // Check cache first
  if (imageCache.has(metadataUri)) {
    return imageCache.get(metadataUri)!
  }

  try {
    // Fetch the metadata
    const response = await fetch(metadataUri)
    if (!response.ok) {
      throw new Error('Failed to fetch metadata')
    }

    const metadata = await response.json()

    // Check if image URL exists in metadata
    if (!metadata.image) {
      throw new Error('No image URL found in metadata')
    }

    // Cache the result
    imageCache.set(metadataUri, metadata.image)

    // Return the image URL
    return metadata.image
  } catch (error) {
    console.error('Error fetching image from metadata:', error)
    // Cache the fallback
    imageCache.set(metadataUri, loadingAsset.src)
    // Return loading asset path as fallback
    return loadingAsset.src
  }
}
