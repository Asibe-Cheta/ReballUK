import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
})

export default cloudinary

// Utility functions for video upload and management
export const generateUploadSignature = (params: Record<string, unknown>) => {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    {
      ...params,
      timestamp,
    },
    process.env.CLOUDINARY_API_SECRET!
  )

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  }
}

export const createVideoTransformation = (options: {
  width?: number
  height?: number
  quality?: string
  format?: string
  crop?: string
}) => {
  const transformations = []
  
  if (options.width) transformations.push(`w_${options.width}`)
  if (options.height) transformations.push(`h_${options.height}`)
  if (options.quality) transformations.push(`q_${options.quality}`)
  if (options.format) transformations.push(`f_${options.format}`)
  if (options.crop) transformations.push(`c_${options.crop}`)
  
  return transformations.join(',')
}

export const generateThumbnailUrl = (publicId: string, options: {
  width?: number
  height?: number
  quality?: string
} = {}) => {
  const transformations = createVideoTransformation({
    width: options.width || 400,
    height: options.height || 225,
    quality: options.quality || 'auto',
    crop: 'fill',
  })
  
  return cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: transformations,
    format: 'jpg',
  })
}

export const deleteVideo = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video',
    })
    return result
  } catch (error) {
    console.error('Error deleting video from Cloudinary:', error)
    throw error
  }
}

export const getVideoInfo = async (publicId: string) => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: 'video',
    })
    return result
  } catch (error) {
    console.error('Error getting video info from Cloudinary:', error)
    throw error
  }
}

export const createVideoAnalysisUrl = (publicId: string, options: {
  startTime?: number
  endTime?: number
  speed?: number
} = {}) => {
  const transformations = []
  
  if (options.startTime !== undefined) {
    transformations.push(`so_${options.startTime}`)
  }
  if (options.endTime !== undefined) {
    transformations.push(`eo_${options.endTime}`)
  }
  if (options.speed !== undefined) {
    transformations.push(`du_${options.speed}`)
  }
  
  return cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: transformations.length > 0 ? transformations.join(',') : undefined,
  })
}
