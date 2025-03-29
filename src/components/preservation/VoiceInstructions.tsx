
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { VolumeX, Volume1, Volume2, Download, PlayCircle, PauseCircle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface VoiceInstructionsProps {
  audioUrl: string;
  qrCodeUrl: string;
}

const VoiceInstructions: React.FC<VoiceInstructionsProps> = ({ audioUrl, qrCodeUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element if it doesn't exist
  if (!audioRef.current) {
    audioRef.current = new Audio(audioUrl);
    audioRef.current.volume = volume;
    
    // Update progress
    audioRef.current.addEventListener('timeupdate', () => {
      if (audioRef.current) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
    });
    
    // Reset when ended
    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
    });
  }
  
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume / 100);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };
  
  // Download audio file
  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'meal-instructions.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Icon based on volume level
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  
  return (
    <div className="my-4">
      <h4 className="text-sm font-medium mb-2">Voice Instructions</h4>
      
      <div className="bg-muted/30 rounded-md p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={togglePlayback}
          >
            {isPlaying ? (
              <PauseCircle className="h-5 w-5" />
            ) : (
              <PlayCircle className="h-5 w-5" />
            )}
          </Button>
          
          <div className="w-full">
            <Slider
              value={[progress]}
              max={100}
              step={1}
              className="h-1"
            />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={downloadAudio}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <VolumeIcon className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="h-1"
          />
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-xs text-muted-foreground mb-2">Scan to listen on your phone</p>
        <div className="flex justify-center">
          <img src={qrCodeUrl} alt="QR Code for audio instructions" className="h-24 w-24" />
        </div>
      </div>
    </div>
  );
};

export default VoiceInstructions;
