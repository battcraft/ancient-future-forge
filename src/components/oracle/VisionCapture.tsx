import React, { useRef, useState, useCallback } from 'react';
import { Camera, X, Send, SwitchCamera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VisionCaptureProps {
  onCapture: (imageData: string, prompt: string) => void;
  isDisabled?: boolean;
}

const VisionCapture: React.FC<VisionCaptureProps> = ({ onCapture, isDisabled }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const presetPrompts = [
    'Analyze my posture',
    'Check this mudra position',
    'What can you see in my practice space?',
    'Suggest improvements for my form',
  ];

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setIsOpen(true);
      setCapturedImage(null);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsOpen(false);
    setCapturedImage(null);
  }, [stream]);

  const switchCamera = useCallback(async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error('Error switching camera:', error);
    }
  }, [stream, facingMode]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
      }
    }
  }, []);

  const sendWithPrompt = useCallback((prompt: string) => {
    if (capturedImage) {
      onCapture(capturedImage, prompt);
      stopCamera();
    }
  }, [capturedImage, onCapture, stopCamera]);

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-xl"
        onClick={startCamera}
        disabled={isDisabled}
      >
        <Camera className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/90 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl overflow-hidden max-w-lg w-full">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display text-lg text-foreground">Vision Mode</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={switchCamera}>
              <SwitchCamera className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={stopCamera}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative aspect-video bg-muted">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-4 space-y-3">
          {capturedImage ? (
            <>
              <p className="text-sm text-muted-foreground">What would you like the Oracle to analyze?</p>
              <div className="flex flex-wrap gap-2">
                {presetPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendWithPrompt(prompt)}
                    className="px-3 py-1.5 text-sm bg-muted hover:bg-accent rounded-full transition-colors flex items-center gap-1"
                  >
                    {prompt}
                    <Send className="w-3 h-3" />
                  </button>
                ))}
              </div>
              <Button variant="outline" className="w-full" onClick={() => setCapturedImage(null)}>
                Retake Photo
              </Button>
            </>
          ) : (
            <Button variant="saffron" className="w-full" onClick={captureImage}>
              <Camera className="w-4 h-4 mr-2" />
              Capture
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisionCapture;
