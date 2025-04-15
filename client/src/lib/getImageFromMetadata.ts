import loadingAsset from '@/app/public/loadingAsset.gif'

export async function getImageFromMetadata(metadataUri: string): Promise<string> {
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

    // Return the image URL
    return metadata.image
  } catch (error) {
    console.error('Error fetching image from metadata:', error)
    // Return loading asset path as fallback
    return loadingAsset.src
  }
}
