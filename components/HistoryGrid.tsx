import React from 'react';
import { GeneratedImage } from '../types';
import { DownloadIcon, TrashIcon, ExpandIcon } from './Icons';

interface HistoryGridProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
}

const HistoryGrid: React.FC<HistoryGridProps> = ({ images, onSelect, onDelete }) => {
  if (images.length === 0) return null;

  const downloadImage = (e: React.MouseEvent, url: string, id: string) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = url;
    link.download = `visionary-${id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete(id);
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-20">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-200">Creation History</h2>
        <span className="text-sm text-slate-500">{images.length} items</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div 
            key={img.id}
            onClick={() => onSelect(img)}
            className="group relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-accent-500/50 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl shadow-black"
          >
            <img 
              src={img.imageUrl} 
              alt={img.prompt} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
               <div className="flex justify-end">
                 <button 
                   onClick={(e) => handleDelete(e, img.id)}
                   className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                   title="Delete"
                 >
                   <TrashIcon className="w-4 h-4" />
                 </button>
               </div>
               
               <div className="flex items-end justify-between">
                 <button 
                    onClick={(e) => downloadImage(e, img.imageUrl, img.id)}
                    className="p-2 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white hover:text-black transition-all"
                    title="Download"
                 >
                   <DownloadIcon className="w-4 h-4" />
                 </button>
                 
                 <div className="p-2 text-white/80">
                   <ExpandIcon className="w-4 h-4" />
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryGrid;