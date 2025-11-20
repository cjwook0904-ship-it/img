import React, { useState, useCallback } from 'react';
import { AspectRatio, GeneratedImage, GenerationMode } from './types';
import { generateImageFromPrompt, editImage } from './services/geminiService';
import ControlPanel from './components/ControlPanel';
import DisplayArea from './components/DisplayArea';
import HistoryGrid from './components/HistoryGrid';
import { WandIcon } from './components/Icons';

const App: React.FC = () => {
  // State
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.Generate);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.Square);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Handlers
  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    if (mode === GenerationMode.Edit && !sourceImage) {
      setError("Please upload or select an image to edit.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentImage(null); // Clear current while generating

    try {
      let imageUrl: string;

      if (mode === GenerationMode.Generate) {
        imageUrl = await generateImageFromPrompt(prompt, aspectRatio);
      } else {
        // Mode is Edit
        if (!sourceImage) throw new Error("Source image missing");
        
        // Extract mime type and base64 data from Data URL
        const matches = sourceImage.match(/^data:(.+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          throw new Error("Invalid image format");
        }
        const mimeType = matches[1];
        const base64Data = matches[2];
        
        imageUrl = await editImage(base64Data, mimeType, prompt);
      }
      
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        prompt: prompt,
        imageUrl: imageUrl,
        aspectRatio: mode === GenerationMode.Generate ? aspectRatio : null, // Aspect ratio might be preserved or unknown
        createdAt: Date.now(),
      };

      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, aspectRatio, mode, sourceImage]);

  const handleDelete = useCallback((id: string) => {
    setHistory(prev => prev.filter(img => img.id !== id));
    if (currentImage?.id === id) {
      setCurrentImage(null);
    }
  }, [currentImage]);

  const handleSelectFromHistory = useCallback((img: GeneratedImage) => {
    setCurrentImage(img);
    // Also scroll to top smooth
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleQuickEdit = useCallback((imageUrl: string) => {
    setSourceImage(imageUrl);
    setMode(GenerationMode.Edit);
    setPrompt('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-accent-500/30 selection:text-accent-200">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg">
              <WandIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Visionary AI
            </span>
          </div>
          <div className="hidden sm:block text-xs text-slate-500 border border-slate-800 rounded-full px-3 py-1">
            Powered by Imagen 3 & Gemini 2.5
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-8 pb-12 px-4 flex flex-col min-h-[calc(100vh-64px)]">
        
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Turn words into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">visual reality</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Create stunning images or edit existing ones with simple text commands using Google's latest AI models.
          </p>
        </div>

        <ControlPanel 
          mode={mode}
          setMode={setMode}
          prompt={prompt}
          setPrompt={setPrompt}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          sourceImage={sourceImage}
          setSourceImage={setSourceImage}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {error && (
          <div className="w-full max-w-4xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center justify-center text-center animate-pulse">
            <p>{error}</p>
          </div>
        )}

        <DisplayArea 
          currentImage={currentImage}
          isGenerating={isGenerating}
          onEditImage={handleQuickEdit}
        />

        <HistoryGrid 
          images={history}
          onSelect={handleSelectFromHistory}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default App;