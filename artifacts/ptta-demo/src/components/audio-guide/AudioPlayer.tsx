import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { ModelEntry, ModelId } from "@/content/models";
import { AUDIO_SRC } from "@/content/audio-guide";
import { NextModuleCta } from "@/components/NextModuleCta";
import { StageFrame } from "@/components/prada/StageFrame";

interface Props {
  model: ModelEntry;
  onBack: () => void;
  onSwap?: (id: ModelId) => void;
}

const BAR_COUNT = 32;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ model, onBack, onSwap }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [bars, setBars] = useState<number[]>(() =>
    // Non-zero idle heights so the visualizer isn't flat before play.
    Array.from({ length: BAR_COUNT }, (_, i) =>
      20 + 10 * Math.sin((i / BAR_COUNT) * Math.PI)
    )
  );

  const src = AUDIO_SRC[model.id];

  // Set up Web Audio analysis pipeline the first time the user plays.
  const ensureAudioGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audioCtxRef.current) return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const source = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128; // 64 frequency bins; we'll take 32 low-mid bins
    analyser.smoothingTimeConstant = 0.75;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    sourceRef.current = source;
  }, []);

  // Animate the bars while playing.
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      return;
    }
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      // Take the first BAR_COUNT bins (low/mid — voice lives there).
      const next = Array.from({ length: BAR_COUNT }, (_, i) => {
        const v = data[i] ?? 0;
        // Normalise 0..255 → 8..100 (min 8 so bars stay visible at rest)
        return 8 + (v / 255) * 92;
      });
      setBars(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handlePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    ensureAudioGraph();
    // iOS/Safari suspends the context until a user gesture.
    if (audioCtxRef.current?.state === "suspended") {
      await audioCtxRef.current.resume().catch(() => {});
    }
    if (audio.paused) {
      await audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [ensureAudioGraph]);

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Number(e.target.value);
    audio.currentTime = next;
    setCurrentTime(next);
  };

  const playState = isPlaying ? "Playing" : currentTime > 0 ? "Paused" : "Play the guide";

  return (
    <StageFrame
      label="Audio guide"
      model={model}
      onBack={onBack}
      backLabel="Pick another piece"
      onSwap={onSwap}
      status={{ left: formatTime(currentTime), right: formatTime(duration) }}
      aside={
        <div className="flex flex-col gap-6">
          <p className="prada-body text-[14px] md:text-[15px] leading-[1.6] text-black/65">
            A narrated description written to be heard with the relief under your
            hands: what sits where, what it is made of, and what to feel for.
          </p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pause the audio guide" : "Play the audio guide"}
              aria-pressed={isPlaying}
              className="prada-btn-solid flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              {isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" className="ml-0.5" />
              )}
            </button>
            <span className="prada-mono-caps text-[10px] text-black/60" aria-live="polite">
              {playState}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={currentTime}
            onChange={handleScrub}
            aria-label="Seek"
            className="w-full"
            style={{ accentColor: "var(--color-black)" }}
          />
          <NextModuleCta fromSlug="audio-guide" />
        </div>
      }
    >
      <img
        src={model.image}
        alt={`${model.title} by ${model.artist}`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Live frequency bars over the foot of the plate. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 flex h-1/3 items-end justify-center gap-[3px] px-8 pb-8"
        style={{ background: "linear-gradient(to top, rgba(10,8,6,0.85), transparent)" }}
      >
        {bars.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-full bg-white transition-[height] duration-[90ms] ease-out"
            style={{ height: `${h}%`, minHeight: 3, maxWidth: 6, opacity: 0.35 + (h / 100) * 0.65 }}
          />
        ))}
      </div>

      {/* Hidden audio element driving playback */}
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
        crossOrigin="anonymous"
      />
    </StageFrame>
  );
}
