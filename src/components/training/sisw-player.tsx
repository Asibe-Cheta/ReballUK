"use client";

import { useState, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings } from "lucide-react";

interface SISWPlayerProps {
  videoUrl: string;
  voiceoverUrl: string;
  sessionTitle: string;
  analysisPoints: {
    timestamp: number;
    title: string;
    description: string;
  }[];
}

export default function SISWPlayer({ 
  videoUrl, 
  voiceoverUrl, 
  sessionTitle, 
  analysisPoints 
}: SISWPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.25); // Default slow-motion
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.playbackRate = playbackSpeed;
    }
  };

  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentAnalysisPoint = () => {
    return analysisPoints.find(
      (point, index) => {
        const nextPoint = analysisPoints[index + 1];
        return currentTime >= point.timestamp && 
               (!nextPoint || currentTime < nextPoint.timestamp);
      }
    );
  };

  const currentAnalysis = getCurrentAnalysisPoint();

  return (
    <div className="glass rounded-2xl p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display text-2xl text-pure-black mb-2">{sessionTitle}</h2>
        <p className="text-text-gray">Session in Slow-motion with Voiceover</p>
      </div>

      {/* Video Player */}
      <div className="relative bg-pure-black rounded-xl overflow-hidden mb-6">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          muted={isMuted}
        />
        
        {/* Video Overlay Controls */}
        <div className="absolute inset-0 bg-pure-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-pure-white/90 text-pure-black p-4 rounded-full hover:bg-pure-white transition-colors duration-200"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm text-text-gray">{formatTime(currentTime)}</span>
          <div className="flex-1 bg-light-gray rounded-full h-2 relative">
            <div 
              className="bg-pure-black h-2 rounded-full transition-all duration-100"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            {/* Analysis point markers */}
            {analysisPoints.map((point, index) => (
              <button
                key={index}
                className="absolute top-0 w-3 h-3 bg-dark-gray rounded-full transform -translate-y-0.5 hover:bg-pure-black transition-colors duration-200"
                style={{ left: `${(point.timestamp / duration) * 100}%` }}
                onClick={() => seekTo(point.timestamp)}
                title={point.title}
              />
            ))}
          </div>
          <span className="text-sm text-text-gray">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="bg-pure-black text-pure-white p-3 rounded-lg hover:bg-charcoal transition-colors duration-200"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => seekTo(0)}
            className="glass text-pure-black p-3 rounded-lg hover:glass-strong transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="glass text-pure-black p-3 rounded-lg hover:glass-strong transition-all duration-200"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-gray mr-2">Speed:</span>
          {[0.25, 0.5, 0.75, 1].map((speed) => (
            <button
              key={speed}
              onClick={() => changeSpeed(speed)}
              className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
                playbackSpeed === speed
                  ? 'bg-pure-black text-pure-white'
                  : 'glass text-pure-black hover:glass-strong'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Current Analysis Point */}
      {currentAnalysis && (
        <div className="glass-strong rounded-xl p-4">
          <h3 className="font-semibold text-pure-black mb-2">{currentAnalysis.title}</h3>
          <p className="text-text-gray text-sm leading-relaxed">
            {currentAnalysis.description}
          </p>
        </div>
      )}

      {/* Analysis Timeline */}
      <div className="mt-6">
        <h3 className="font-semibold text-pure-black mb-4">Analysis Points</h3>
        <div className="space-y-3">
          {analysisPoints.map((point, index) => (
            <button
              key={index}
              onClick={() => seekTo(point.timestamp)}
              className={`w-full text-left glass rounded-lg p-4 hover:glass-strong transition-all duration-200 ${
                currentAnalysis === point ? 'ring-2 ring-pure-black' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-pure-black">{point.title}</h4>
                <span className="text-sm text-text-gray">{formatTime(point.timestamp)}</span>
              </div>
              <p className="text-sm text-text-gray">{point.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
