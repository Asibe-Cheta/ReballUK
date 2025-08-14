"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Upload, 
  Video, 
  FileVideo, 
  Cloud, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Target,
  BarChart3,
  Users,
  User,
  Settings,
  X,
  Play,
  Pause
} from "lucide-react"

interface VideoUploadProps {
  onUploadComplete: (uploadData: any) => void
}

interface UploadProgress {
  status: "idle" | "uploading" | "processing" | "completed" | "error"
  progress: number
  message: string
}

export default function VideoUpload({ onUploadComplete }: VideoUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    status: "idle",
    progress: 0,
    message: "Ready to upload"
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoTitle, setVideoTitle] = useState("")
  const [videoDescription, setVideoDescription] = useState("")
  const [analysisType, setAnalysisType] = useState<"SISW" | "TAV">("SISW")
  const [position, setPosition] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedVideo, setUploadedVideo] = useState<any>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
      setVideoTitle(file.name.replace(/\.[^/.]+$/, ""))
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      setUploadProgress({
        status: "idle",
        progress: 0,
        message: "File selected, ready to upload"
      })
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
      setVideoTitle(file.name.replace(/\.[^/.]+$/, ""))
      
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      setUploadProgress({
        status: "idle",
        progress: 0,
        message: "File selected, ready to upload"
      })
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleUpload = async () => {
    if (!videoFile) return

    setUploadProgress({
      status: "uploading",
      progress: 0,
      message: "Uploading video to Cloudinary..."
    })

    try {
      // Get upload signature from our API
      const signatureResponse = await fetch("/api/videos/upload-signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: videoFile.name,
          analysisType,
          position,
          tags
        })
      })

      if (!signatureResponse.ok) {
        throw new Error("Failed to get upload signature")
      }

      const { signature, timestamp, apiKey, cloudName } = await signatureResponse.json()

      // Create form data for Cloudinary upload
      const formData = new FormData()
      formData.append("file", videoFile)
      formData.append("api_key", apiKey)
      formData.append("timestamp", timestamp)
      formData.append("signature", signature)
      formData.append("folder", "reball-videos")
      formData.append("resource_type", "video")
      formData.append("transformation", "f_auto,q_auto")
      formData.append("context", `analysis_type=${analysisType}|position=${position}|tags=${tags.join(",")}`)

      // Upload to Cloudinary
      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
        method: "POST",
        body: formData
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload to Cloudinary")
      }

      const uploadResult = await uploadResponse.json()

      setUploadProgress({
        status: "processing",
        progress: 75,
        message: "Processing video for analysis..."
      })

      // Save video metadata to our database
      const saveResponse = await fetch("/api/videos/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: videoTitle,
          description: videoDescription,
          videoUrl: uploadResult.secure_url,
          thumbnailUrl: uploadResult.thumbnail_url,
          duration: Math.round(uploadResult.duration),
          analysisType,
          position,
          tags,
          cloudinaryId: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          bytes: uploadResult.bytes
        })
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save video metadata")
      }

      const savedVideo = await saveResponse.json()

      setUploadedVideo(savedVideo)
      setUploadProgress({
        status: "completed",
        progress: 100,
        message: "Video uploaded and processed successfully!"
      })

      // Call the completion callback
      onUploadComplete(savedVideo)

    } catch (error) {
      console.error("Upload error:", error)
      setUploadProgress({
        status: "error",
        progress: 0,
        message: error instanceof Error ? error.message : "Upload failed"
      })
    }
  }

  const resetUpload = () => {
    setVideoFile(null)
    setVideoTitle("")
    setVideoDescription("")
    setAnalysisType("SISW")
    setPosition("")
    setTags([])
    setNewTag("")
    setPreviewUrl(null)
    setUploadedVideo(null)
    setUploadProgress({
      status: "idle",
      progress: 0,
      message: "Ready to upload"
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Upload Video for Analysis
          </CardTitle>
          <CardDescription>
            Upload your training session videos for SISW or TAV analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              uploadProgress.status === "idle" && !videoFile
                ? "border-gray-300 hover:border-gray-400"
                : "border-primary"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {!videoFile ? (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium">Drop your video here</p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse files
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Video File
                </Button>
                <p className="text-xs text-muted-foreground">
                  Supports MP4, MOV, AVI up to 500MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <FileVideo className="mx-auto h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">{videoFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(videoFile.size)}
                  </p>
                </div>
                <Button variant="outline" onClick={resetUpload}>
                  <X className="mr-2 h-4 w-4" />
                  Remove File
                </Button>
              </div>
            )}
          </div>

          {/* Video Preview */}
          {previewUrl && (
            <div className="space-y-2">
              <h4 className="font-medium">Preview</h4>
              <video
                src={previewUrl}
                className="w-full max-h-64 object-cover rounded-lg"
                controls
              />
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress.status !== "idle" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {uploadProgress.message}
                </span>
                <span className="text-sm text-muted-foreground">
                  {uploadProgress.progress}%
                </span>
              </div>
              <Progress value={uploadProgress.progress} />
              {uploadProgress.status === "error" && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {uploadProgress.message}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Details Form */}
      {videoFile && uploadProgress.status === "idle" && (
        <Card>
          <CardHeader>
            <CardTitle>Video Details</CardTitle>
            <CardDescription>
              Configure analysis settings and metadata
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Video Title</label>
                <Input
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter video title"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Analysis Type</label>
                <Select value={analysisType} onValueChange={(value: "SISW" | "TAV") => setAnalysisType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SISW">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        SISW (Session in Slow-motion with Voiceover)
                      </div>
                    </SelectItem>
                    <SelectItem value="TAV">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        TAV (Technical Analysis Video)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Describe the training session, key focus areas, or specific skills being worked on"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STRIKER">Striker</SelectItem>
                    <SelectItem value="WINGER">Winger</SelectItem>
                    <SelectItem value="CAM">CAM</SelectItem>
                    <SelectItem value="FULLBACK">Full-back</SelectItem>
                    <SelectItem value="GOALKEEPER">Goalkeeper</SelectItem>
                    <SelectItem value="DEFENDER">Defender</SelectItem>
                    <SelectItem value="MIDFIELDER">Midfielder</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleUpload}
                disabled={!videoTitle.trim() || uploadProgress.status === "uploading"}
                className="flex-1"
              >
                {uploadProgress.status === "uploading" ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Video
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetUpload}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Success */}
      {uploadedVideo && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Upload Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h4 className="font-medium">{uploadedVideo.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {uploadedVideo.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{uploadedVideo.analysisType}</Badge>
                  {uploadedVideo.position && (
                    <Badge variant="secondary">{uploadedVideo.position}</Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={resetUpload}>
                Upload Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Type Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              SISW Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Session in Slow-motion with Voiceover analysis provides detailed coaching commentary
              and performance markers throughout your training session.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Slow-motion playback controls
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Expert voiceover commentary
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Performance markers and highlights
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Detailed skill breakdown
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              TAV Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Technical Analysis Video provides Match of the Day style tactical breakdown
              with expert commentary and tactical overlays.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Tactical overlays and drawings
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Professional expert commentary
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Key moments and decision analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Tactical recommendations
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
