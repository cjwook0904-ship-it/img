import React from 'react';
import { GeneratedImage } from '../types';
import { DownloadIcon, LoaderIcon, EditIcon } from './Icons';

interface DisplayAreaProps {
  currentImage: GeneratedImage | null;
  isGenerating: boolean;
  onEditImage: (imageUrl: string) => void;
}

const DisplayArea: React.FC<DisplayAreaProps> = ({ currentImage, isGenerating, onEditImage }) => {
  
  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentImage && !isGenerating) {
    return (
      <div className="w-full max-w-4xl mx-auto h-96 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 bg-slate-900/30 mb-12">
        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <p className="text-lg font-medium">Your masterpiece will appear here</p>
        <p className="text-sm mt-2">Enter a prompt above to start</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 flex justify-center perspective-1000">
      {isGenerating ? (
        <div className="relative w-full aspect-square max-h-[600px] max-w-[600px] rounded-2xl overflow-hidden bg-slate-900 flex flex-col items-center justify-center shadow-2xl border border-slate-800">
           <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-slate-900 animate-pulse"></div>
           <LoaderIcon className="w-12 h-12 text-indigo-500 animate-spin mb-4 relative z-10" />
           <p className="text-indigo-300 font-medium animate-pulse relative z-10">Dreaming up your image...</p>
           <div className="w-64 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden relative z-10">
             <div className="h-full bg-indigo-500 animate-[shimmer_1.5s_infinite_linear] w-1/2"></div>
           </div>
        </div>
      ) : (
        currentImage && (
          <div className="relative group w-auto rounded-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)] ring-1 ring-slate-700/50 bg-black">
            <img 
              src={currentImage.imageUrl} 
              alt={currentImage.prompt} 
              className="max-h-[80vh] w-auto object-contain"
            />
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <p className="text-white text-sm line-clamp-2 mb-4 font-light bg-black/50 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                {currentImage.prompt}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => downloadImage(currentImage.imageUrl, `visionary-${currentImage.id}.jpg`)}
                  className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-slate-200 transition-colors shadow-lg"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download
                </button>
                <button 
                  onClick={() => onEditImage(currentImage.imageUrl)}
                  className="flex items-center gap-2 bg-slate-800/80 backdrop-blur text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-700 transition-colors shadow-lg border border-white/10"
                >
                  <EditIcon className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default DisplayArea;