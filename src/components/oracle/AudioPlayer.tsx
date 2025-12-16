import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  audioUrl?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, autoPlay = true, onEnded }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioUrl && audioRef.current && autoPlay) {
      audioRef.current.play().catch(console.error);
    }
  }, [audioUrl, autoPlay]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  return (
    <div className="flex items-center gap-2">
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
      />
      {audioUrl && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleMute}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-saffron' : ''}`} />
          )}
        </Button>
      )}
    </div>
  );
};

export default AudioPlayer;
