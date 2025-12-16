import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface Preset {
  name: string;
  description: string;
  leftFreq: number;
  rightFreq: number;
  baseFreq: number;
}

const presets: Preset[] = [
  { name: 'Delta', description: 'Deep sleep & healing (0.5-4 Hz)', leftFreq: 200, rightFreq: 202, baseFreq: 200 },
  { name: 'Theta', description: 'Meditation & creativity (4-8 Hz)', leftFreq: 200, rightFreq: 206, baseFreq: 200 },
  { name: 'Alpha', description: 'Relaxation & calm (8-14 Hz)', leftFreq: 200, rightFreq: 210, baseFreq: 200 },
  { name: 'Beta', description: 'Focus & alertness (14-30 Hz)', leftFreq: 200, rightFreq: 220, baseFreq: 200 },
  { name: 'Gamma', description: 'Peak awareness (30-100 Hz)', leftFreq: 200, rightFreq: 240, baseFreq: 200 },
  { name: '432 Hz', description: 'Natural harmony', leftFreq: 432, rightFreq: 440, baseFreq: 432 },
  { name: 'Solfeggio 528', description: 'Transformation & DNA repair', leftFreq: 528, rightFreq: 536, baseFreq: 528 },
];

const BinauralBeatGenerator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [leftFreq, setLeftFreq] = useState(200);
  const [rightFreq, setRightFreq] = useState(206);
  const [activePreset, setActivePreset] = useState<string>('Theta');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const leftOscillatorRef = useRef<OscillatorNode | null>(null);
  const rightOscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const mergerRef = useRef<ChannelMergerNode | null>(null);

  const beatFrequency = Math.abs(rightFreq - leftFreq);

  const startAudio = useCallback(() => {
    if (audioContextRef.current) return;

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    // Create stereo merger for left/right channels
    const merger = audioContext.createChannelMerger(2);
    mergerRef.current = merger;

    // Create gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNodeRef.current = gainNode;

    // Left channel oscillator
    const leftOsc = audioContext.createOscillator();
    leftOsc.type = 'sine';
    leftOsc.frequency.value = leftFreq;
    leftOscillatorRef.current = leftOsc;

    // Right channel oscillator
    const rightOsc = audioContext.createOscillator();
    rightOsc.type = 'sine';
    rightOsc.frequency.value = rightFreq;
    rightOscillatorRef.current = rightOsc;

    // Create individual gain nodes for left/right
    const leftGain = audioContext.createGain();
    const rightGain = audioContext.createGain();

    // Connect left oscillator to left channel (0)
    leftOsc.connect(leftGain);
    leftGain.connect(merger, 0, 0);

    // Connect right oscillator to right channel (1)
    rightOsc.connect(rightGain);
    rightGain.connect(merger, 0, 1);

    // Connect merger to gain to destination
    merger.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start oscillators
    leftOsc.start();
    rightOsc.start();

    setIsPlaying(true);
  }, [leftFreq, rightFreq, volume]);

  const stopAudio = useCallback(() => {
    if (leftOscillatorRef.current) {
      leftOscillatorRef.current.stop();
      leftOscillatorRef.current = null;
    }
    if (rightOscillatorRef.current) {
      rightOscillatorRef.current.stop();
      rightOscillatorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  }, [isPlaying, startAudio, stopAudio]);

  const toggleMute = useCallback(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? volume : 0;
      setIsMuted(!isMuted);
    }
  }, [isMuted, volume]);

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (gainNodeRef.current && !isMuted) {
      gainNodeRef.current.gain.value = newVolume;
    }
  }, [isMuted]);

  const applyPreset = useCallback((preset: Preset) => {
    setActivePreset(preset.name);
    setLeftFreq(preset.leftFreq);
    setRightFreq(preset.rightFreq);

    // Update frequencies if playing
    if (leftOscillatorRef.current && rightOscillatorRef.current && audioContextRef.current) {
      leftOscillatorRef.current.frequency.setValueAtTime(preset.leftFreq, audioContextRef.current.currentTime);
      rightOscillatorRef.current.frequency.setValueAtTime(preset.rightFreq, audioContextRef.current.currentTime);
    }
  }, []);

  // Update frequencies when sliders change
  useEffect(() => {
    if (leftOscillatorRef.current && audioContextRef.current) {
      leftOscillatorRef.current.frequency.setValueAtTime(leftFreq, audioContextRef.current.currentTime);
    }
  }, [leftFreq]);

  useEffect(() => {
    if (rightOscillatorRef.current && audioContextRef.current) {
      rightOscillatorRef.current.frequency.setValueAtTime(rightFreq, audioContextRef.current.currentTime);
    }
  }, [rightFreq]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl text-foreground">Binaural Beat Generator</h3>
          <p className="text-sm text-muted-foreground">
            Use headphones for best effect • {beatFrequency.toFixed(1)} Hz beat frequency
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Settings className={cn('w-5 h-5', showAdvanced && 'text-saffron')} />
        </Button>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {presets.slice(0, 4).map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-all',
              activePreset === preset.name
                ? 'bg-saffron text-primary-foreground'
                : 'bg-muted hover:bg-accent'
            )}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* More presets */}
      <div className="flex flex-wrap gap-2">
        {presets.slice(4).map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              activePreset === preset.name
                ? 'bg-saffron/20 text-saffron border border-saffron'
                : 'bg-muted hover:bg-accent'
            )}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Advanced controls */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Left Ear</span>
              <span className="font-mono text-foreground">{leftFreq} Hz</span>
            </div>
            <Slider
              value={[leftFreq]}
              onValueChange={(v) => setLeftFreq(v[0])}
              min={20}
              max={800}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Right Ear</span>
              <span className="font-mono text-foreground">{rightFreq} Hz</span>
            </div>
            <Slider
              value={[rightFreq]}
              onValueChange={(v) => setRightFreq(v[0])}
              min={20}
              max={800}
              step={1}
              className="w-full"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset(presets.find(p => p.name === 'Theta')!)}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      )}

      {/* Playback controls */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <Button
          variant={isPlaying ? 'destructive' : 'saffron'}
          size="lg"
          onClick={togglePlay}
          className="flex-1"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start Session
            </>
          )}
        </Button>

        <Button variant="outline" size="icon" onClick={toggleMute}>
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>

        <div className="w-24">
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.01}
          />
        </div>
      </div>

      {/* Active preset description */}
      {activePreset && (
        <p className="text-xs text-center text-muted-foreground">
          {presets.find(p => p.name === activePreset)?.description}
        </p>
      )}
    </div>
  );
};

export default BinauralBeatGenerator;
