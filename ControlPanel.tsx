import React, { useRef } from 'react';
import { AspectRatio, GenerationMode } from '../types';
import { SparklesIcon, EditIcon, UploadIcon, XIcon } from './Icons';

interface ControlPanelProps {
  mode: GenerationMode;
  setMode: (m: GenerationMode) => void;
  prompt: string;
  setPrompt: (p: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  sourceImage: string | null;
  setSourceImage: (img: string | null) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  setMode,
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  sourceImage,
  setSourceImage,
  onGenerate,
  isGenerating,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canGenerate) {
        onGenerate();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const canGenerate = 
    !isGenerating && 
    prompt.trim().length > 0 && 
    (mode === GenerationMode.Generate || (mode === GenerationMode.Edit && sourceImage));

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl shadow-black/50 mb-8 overflow-hidden">
      
      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setMode(GenerationMode.Generate)}
          className={`flex-1 py-4 text-sm font-medium text-center transition-colors duration-200 ${
            mode === GenerationMode.Generate
              ? 'bg-slate-800/50 text-accent-500 border-b-2 border-accent-500'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <SparklesIcon className="w-4 h-4" />
            Text to Image
          </span>
        </button>
        <button
          onClick={() => setMode(GenerationMode.Edit)}
          className={`flex-1 py-4 text-sm font-medium text-center transition-colors duration-200 ${
            mode === GenerationMode.Edit
              ? 'bg-slate-800/50 text-accent-500 border-b-2 border-accent-500'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <EditIcon className="w-4 h-4" />
            Generative Edit
          </span>
        </button>
      </div>

      <div className="p-6 flex flex-col space-y-6">
        
        {/* Edit Mode: Image Upload */}
        {mode === GenerationMode.Edit && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Reference Image
            </label>
            
            {!sourceImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/50 hover:border-accent-500/50 transition-all group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UploadIcon className="w-6 h-6 text-slate-400 group-hover:text-accent-400" />
                </div>
                <p className="text-slate-300 font-medium">Click to upload or drag & drop</p>
                <p className="text-slate-500 text-xs mt-1">JPG, PNG supported</p>
              </div>
            ) : (
              <div className="relative w-full h-48 bg-black/40 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
                <img src={sourceImage} alt="Source" className="h-full object-contain" />
                <button 
                  onClick={() => setSourceImage(null)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500/80 transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-400 mb-2">
            {mode === GenerationMode.Generate ? 'Imagine something...' : 'Describe changes...'}
          </label>
          <div className="relative">
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === GenerationMode.Generate 
                ? "A futuristic city on Mars with neon lights..." 
                : "Add a pair of sunglasses to the cat, change background to beach..."
              }
              className="w-full h-32 bg-slate-950 text-white border border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none resize-none placeholder-slate-600 transition-all duration-200"
              disabled={isGenerating}
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-600">
              {prompt.length} chars
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
          
          {/* Aspect Ratio Selector - ONLY in Generate Mode */}
          {mode === GenerationMode.Generate ? (
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <span className="text-sm text-slate-400 whitespace-nowrap">Aspect Ratio:</span>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(Object.values(AspectRatio) as AspectRatio[]).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                      aspectRatio === ratio
                        ? 'bg-accent-600 text-white shadow-lg shadow-accent-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500 italic">
              Editing maintains original aspect ratio
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={onGenerate}
            disabled={!canGenerate}
            className={`
              relative overflow-hidden group flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 w-full md:w-auto
              ${!canGenerate 
                ? 'bg-slate-800 cursor-not-allowed text-slate-500' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] active:scale-95'}
            `}
          >
             {isGenerating ? (
               <>
                 <span className="absolute inset-0 bg-white/10 animate-shimmer skew-x-12"></span>
                 {mode === GenerationMode.Generate ? 'Generating...' : 'Editing...'}
               </>
             ) : (
               <>
                 {mode === GenerationMode.Generate ? <SparklesIcon className="w-5 h-5" /> : <EditIcon className="w-5 h-5" />}
                 <span>{mode === GenerationMode.Generate ? 'Generate' : 'Edit Image'}</span>
               </>
             )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;