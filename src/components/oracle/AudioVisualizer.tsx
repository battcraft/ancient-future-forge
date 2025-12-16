import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  isActive: boolean;
  className?: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    if (isActive && !audioContext) {
      const ctx = new AudioContext();
      setAudioContext(ctx);

      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;
      }).catch(console.error);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, audioContext]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barWidth = width / dataArray.length;
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, 'hsl(36, 91%, 55%)'); // saffron
        gradient.addColorStop(1, 'hsl(245, 50%, 21%)'); // cosmic

        dataArray.forEach((value, index) => {
          const barHeight = (value / 255) * height;
          const x = index * barWidth;

          ctx.fillStyle = gradient;
          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
        });
      } else {
        // Idle animation when no audio context
        const bars = 16;
        const barWidth = width / bars;
        const time = Date.now() / 500;

        for (let i = 0; i < bars; i++) {
          const barHeight = Math.sin(time + i * 0.3) * 10 + 15;
          const x = i * barWidth;

          ctx.fillStyle = 'hsl(36, 91%, 55%)';
          ctx.globalAlpha = 0.5;
          ctx.fillRect(x + 2, (height - barHeight) / 2, barWidth - 4, barHeight);
        }
        ctx.globalAlpha = 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={40}
      className={cn('rounded-lg', className)}
    />
  );
};

export default AudioVisualizer;
