import React, { useState, useRef } from 'react';
import { Play, Pause, Plus, Scissors, Merge, Trash2, ZoomIn, ZoomOut, Clock, Edit2, Sparkles, Smile } from 'lucide-react';
import { CaptionSegment, CaptionWord } from '../../types';

interface CaptionTimelineProps {
  captions: CaptionSegment[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  onTogglePlay: () => void;
  onUpdateCaptions: (newCaptions: CaptionSegment[]) => void;
  onSelectSegment: (segmentId: string) => void;
  selectedSegmentId: string | null;
  onOpenTranscribe?: () => void;
}

export const CaptionTimeline: React.FC<CaptionTimelineProps> = ({
  captions,
  currentTime,
  duration,
  isPlaying,
  onSeek,
  onTogglePlay,
  onUpdateCaptions,
  onSelectSegment,
  selectedSegmentId,
  onOpenTranscribe
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 to 3
  const [editingWord, setEditingWord] = useState<{ segmentId: string; wordIndex: number } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const timelineTrackRef = useRef<HTMLDivElement>(null);

  const totalDuration = Math.max(duration || 10, 1);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineTrackRef.current) return;
    const rect = timelineTrackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * totalDuration);
  };

  // Add a new caption block at current playhead
  const handleAddCaptionBlock = () => {
    const start = Math.round(currentTime * 100) / 100;
    const end = Math.min(totalDuration, Math.round((start + 2.0) * 100) / 100);
    const newBlock: CaptionSegment = {
      id: `seg-${Date.now()}`,
      start,
      end,
      text: 'New Caption',
      words: [
        { word: 'New', start, end: start + 0.9 },
        { word: 'Caption', start: start + 0.95, end }
      ]
    };

    const updated = [...captions, newBlock].sort((a, b) => a.start - b.start);
    onUpdateCaptions(updated);
    onSelectSegment(newBlock.id);
  };

  // Split selected or current caption at playhead
  const handleSplitCaption = () => {
    const active = captions.find(c => currentTime >= c.start && currentTime <= c.end) ||
      captions.find(c => c.id === selectedSegmentId);

    if (!active || currentTime <= active.start + 0.2 || currentTime >= active.end - 0.2) return;

    const splitTime = Math.round(currentTime * 100) / 100;
    const wordsBefore = active.words.filter(w => w.end <= splitTime);
    const wordsAfter = active.words.filter(w => w.end > splitTime);

    if (wordsBefore.length === 0 || wordsAfter.length === 0) return;

    const firstSegment: CaptionSegment = {
      ...active,
      end: splitTime,
      text: wordsBefore.map(w => w.word).join(' '),
      words: wordsBefore
    };

    const secondSegment: CaptionSegment = {
      id: `seg-${Date.now()}`,
      start: splitTime,
      end: active.end,
      text: wordsAfter.map(w => w.word).join(' '),
      words: wordsAfter
    };

    const updated = captions.map(c => (c.id === active.id ? firstSegment : c));
    updated.push(secondSegment);
    updated.sort((a, b) => a.start - b.start);

    onUpdateCaptions(updated);
    onSelectSegment(secondSegment.id);
  };

  // Merge selected segment with next segment
  const handleMergeNext = (segmentId: string) => {
    const idx = captions.findIndex(c => c.id === segmentId);
    if (idx < 0 || idx >= captions.length - 1) return;

    const current = captions[idx];
    const next = captions[idx + 1];

    const merged: CaptionSegment = {
      id: current.id,
      start: current.start,
      end: next.end,
      text: `${current.text} ${next.text}`.trim(),
      words: [...current.words, ...next.words]
    };

    const updated = [...captions];
    updated.splice(idx, 2, merged);
    onUpdateCaptions(updated);
  };

  // Delete segment
  const handleDeleteSegment = (segmentId: string) => {
    const updated = captions.filter(c => c.id !== segmentId);
    onUpdateCaptions(updated);
  };

  // Update text of segment
  const handleTextChange = (segmentId: string, newText: string) => {
    const updated = captions.map(seg => {
      if (seg.id !== segmentId) return seg;

      const wordsArray = newText.trim().split(/\s+/).filter(Boolean);
      const segDuration = Math.max(0.1, seg.end - seg.start);
      const perWordDur = segDuration / Math.max(1, wordsArray.length);

      const newWords: CaptionWord[] = wordsArray.map((w, i) => ({
        word: w,
        start: Math.round((seg.start + i * perWordDur) * 100) / 100,
        end: Math.round((seg.start + (i + 1) * perWordDur) * 100) / 100
      }));

      return {
        ...seg,
        text: newText,
        words: newWords
      };
    });

    onUpdateCaptions(updated);
  };

  // Update individual word
  const handleWordUpdate = (segmentId: string, wordIdx: number, newWord: string, newStart: number, newEnd: number) => {
    const updated = captions.map(seg => {
      if (seg.id !== segmentId) return seg;
      const words = [...seg.words];
      words[wordIdx] = {
        word: newWord,
        start: newStart,
        end: newEnd
      };
      return {
        ...seg,
        text: words.map(w => w.word).join(' '),
        words
      };
    });
    onUpdateCaptions(updated);
    setEditingWord(null);
  };

  // Add viral emoji to active or selected segment
  const handleAppendEmoji = (emoji: string) => {
    const active = captions.find(c => currentTime >= c.start && currentTime <= c.end) ||
      captions.find(c => c.id === selectedSegmentId) ||
      captions[0];

    if (!active) return;
    const newText = `${active.text} ${emoji}`;
    handleTextChange(active.id, newText);
  };

  const formatTime = (timeInSec: number) => {
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    const ms = Math.floor((timeInSec % 1) * 100);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  const playheadPercent = (currentTime / totalDuration) * 100;

  return (
    <div className="w-full bg-[#080B14] border-t border-cyan-500/20 flex flex-col select-none">
      {/* Timeline Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 border-b border-white/[0.06] bg-[#06080E] gap-2">
        <div className="flex items-center gap-2.5">
          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white flex items-center justify-center transition-all shadow-md shadow-red-500/20"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Timecode Display */}
          <div className="font-mono text-xs text-slate-300 font-bold tracking-wider">
            <span className="text-cyan-300">{formatTime(currentTime)}</span>
            <span className="text-slate-600 mx-1">/</span>
            <span className="text-slate-400">{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Action Tools & Prominent Auto Caption Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Unmissable Auto Captions Button */}
          {onOpenTranscribe && (
            <button
              onClick={onOpenTranscribe}
              className="px-2.5 sm:px-3 py-1 text-xs font-black rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Auto Captions (50+)</span>
            </button>
          )}

          <button
            onClick={handleAddCaptionBlock}
            className="px-2.5 py-1 text-xs font-bold text-slate-200 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 transition-colors flex items-center gap-1.5"
            title="Add a new caption block at playhead"
          >
            <Plus className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Add Block</span>
          </button>

          <button
            onClick={handleSplitCaption}
            className="px-2.5 py-1 text-xs font-bold text-slate-200 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 transition-colors flex items-center gap-1.5"
            title="Split selected caption at current playhead"
          >
            <Scissors className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Split</span>
          </button>

          {/* Quick Viral Emojis */}
          <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 bg-white/[0.03] rounded-md border border-white/[0.06]">
            {['🔥', '🚀', '⚡', '💡', '💰', '👑'].map(em => (
              <button
                key={em}
                type="button"
                onClick={() => handleAppendEmoji(em)}
                className="hover:scale-125 transition-transform text-xs"
                title={`Add ${em} to active caption`}
              >
                {em}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-white/10 mx-0.5 hidden sm:block" />

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 bg-white/[0.03] p-0.5 rounded-md border border-white/[0.06]">
            <button
              onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.5))}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-mono text-cyan-400 px-1 font-bold">
              {zoomLevel}x
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.5))}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Timeline Ruler & Scrubber */}
      <div className="relative w-full h-10 border-b border-white/[0.06] bg-[#05060A] overflow-x-auto scrollbar-none">
        <div
          ref={timelineTrackRef}
          onClick={handleTimelineClick}
          className="relative h-full cursor-pointer"
          style={{ width: `${100 * zoomLevel}%` }}
        >
          {/* Seconds markers */}
          {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, sec) => {
            const leftPercent = (sec / totalDuration) * 100;
            return (
              <div
                key={sec}
                className="absolute top-0 bottom-0 border-l border-white/10 flex flex-col justify-between pt-1 pb-1"
                style={{ left: `${leftPercent}%` }}
              >
                <span className="text-[9px] font-mono text-slate-500 pl-1">
                  {sec}s
                </span>
                <div className="h-1.5 w-px bg-white/20" />
              </div>
            );
          })}

          {/* Caption Segment Blocks on Ruler */}
          {captions.map(seg => {
            const leftPercent = (seg.start / totalDuration) * 100;
            const widthPercent = Math.max(1, ((seg.end - seg.start) / totalDuration) * 100);
            const isSelected = seg.id === selectedSegmentId;
            const isActive = currentTime >= seg.start && currentTime <= seg.end;

            return (
              <div
                key={seg.id}
                onClick={e => {
                  e.stopPropagation();
                  onSelectSegment(seg.id);
                  onSeek(seg.start);
                }}
                className={`absolute top-2 bottom-2 rounded px-2 flex items-center overflow-hidden transition-all text-left ${
                  isSelected
                    ? 'bg-red-500/30 border border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                    : isActive
                    ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-100 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                    : 'bg-white/10 hover:bg-white/15 border border-white/10 text-slate-300'
                }`}
                style={{
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`
                }}
              >
                <span className="text-[11px] font-bold truncate leading-none">
                  {seg.text}
                </span>
              </div>
            );
          })}

          {/* Red/Cyan Playhead line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-20 pointer-events-none"
            style={{ left: `${playheadPercent}%` }}
          >
            <div className="w-3 h-3 bg-cyan-400 rotate-45 -translate-x-[5px] -translate-y-1 shadow-md shadow-cyan-400" />
          </div>
        </div>
      </div>

      {/* Caption Blocks Editor List */}
      <div className="max-h-44 sm:max-h-48 overflow-y-auto divide-y divide-white/[0.04] p-2 space-y-2">
        {captions.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No caption blocks yet. Click "Auto Captions" or "Add Block" to start.
          </div>
        ) : (
          captions.map((seg, idx) => {
            const isSelected = seg.id === selectedSegmentId;
            const isActive = currentTime >= seg.start && currentTime <= seg.end;

            return (
              <div
                key={seg.id}
                onClick={() => onSelectSegment(seg.id)}
                className={`p-2.5 rounded-xl transition-all border ${
                  isSelected
                    ? 'bg-red-500/[0.08] border-red-500/40'
                    : isActive
                    ? 'bg-cyan-500/[0.06] border-cyan-500/30'
                    : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <input
                        type="number"
                        step="0.1"
                        value={seg.start}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          const updated = captions.map(c => (c.id === seg.id ? { ...c, start: val } : c));
                          onUpdateCaptions(updated);
                        }}
                        className="w-14 bg-black/50 border border-white/10 rounded px-1.5 py-0.5 text-center focus:border-cyan-400 text-white"
                      />
                      <span>&rarr;</span>
                      <input
                        type="number"
                        step="0.1"
                        value={seg.end}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          const updated = captions.map(c => (c.id === seg.id ? { ...c, end: val } : c));
                          onUpdateCaptions(updated);
                        }}
                        className="w-14 bg-black/50 border border-white/10 rounded px-1.5 py-0.5 text-center focus:border-cyan-400 text-white"
                      />
                      <span className="text-slate-500 text-[10px]">
                        ({Math.round((seg.end - seg.start) * 100) / 100}s)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {idx < captions.length - 1 && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleMergeNext(seg.id);
                        }}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                        title="Merge with next block"
                      >
                        <Merge className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteSegment(seg.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
                      title="Delete block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Text input */}
                <input
                  type="text"
                  value={seg.text}
                  onChange={e => handleTextChange(seg.id, e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 font-medium mb-2 outline-none"
                  placeholder="Caption text (Hindi, Punjabi, English, Spanish, Japanese...)"
                />

                {/* Word chips with micro-timing */}
                <div className="flex flex-wrap gap-1.5">
                  {seg.words.map((w, wIdx) => {
                    const isWordActive = currentTime >= w.start && currentTime <= w.end;
                    const isEditingThisWord = editingWord?.segmentId === seg.id && editingWord?.wordIndex === wIdx;

                    if (isEditingThisWord) {
                      return (
                        <div
                          key={wIdx}
                          className="flex items-center gap-1 p-1 bg-red-500/20 border border-red-500 rounded-md"
                        >
                          <input
                            type="text"
                            defaultValue={w.word}
                            id={`word-edit-${wIdx}`}
                            className="w-20 bg-black text-xs text-white px-1 py-0.5 rounded border border-white/20"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById(`word-edit-${wIdx}`) as HTMLInputElement;
                              if (input) {
                                handleWordUpdate(seg.id, wIdx, input.value, w.start, w.end);
                              }
                            }}
                            className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold"
                          >
                            Save
                          </button>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={wIdx}
                        onClick={e => {
                          e.stopPropagation();
                          onSeek(w.start);
                        }}
                        onDoubleClick={e => {
                          e.stopPropagation();
                          setEditingWord({ segmentId: seg.id, wordIndex: wIdx });
                        }}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-all flex items-center gap-1 ${
                          isWordActive
                            ? 'bg-cyan-500 text-black border-cyan-300 font-extrabold shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                        title={`Double click to edit word: ${w.word} (${w.start}s - ${w.end}s)`}
                      >
                        <span>{w.word}</span>
                        <span className="text-[9px] opacity-60 font-mono">
                          {Math.round(w.start * 10) / 10}s
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
