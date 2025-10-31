// BatchVideo.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { X } from 'lucide-react';

interface VideoUrlResponse {
  embed_url: string;
}

interface BatchVideoProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: VideoUrlResponse;
  loading: boolean;
}

function BatchVideo({ isOpen, onClose, videoUrl, loading }: BatchVideoProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.2 }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              duration: 0.3
            }}
          >
            <div
              className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 p-2 hover:bg-gray-100 rounded-lg transition duration-200 text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>

              {/* Video Container */}
              <div className="bg-black aspect-video flex items-center justify-center relative">
                {loading ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-12 h-12">
                      <motion.div
                        className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    <p className="text-white text-sm font-medium">Loading video...</p>
                  </div>
                ) : videoUrl.embed_url ? (
                  <iframe
                    src={videoUrl.embed_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Recorded Session Video"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4 text-white">
                    <svg
                      className="w-16 h-16 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-400">Unable to load video</p>
                  </div>
                )}
              </div>

              {/* Video Info Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Recorded Session</p>
                    <p className="text-xs text-gray-500 mt-1">Full screen available</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BatchVideo;




// function BatchVideo({ isOpen, onClose, videoUrl, loading }: { isOpen: boolean; onClose: () => void; videoUrl: { embed_url: string }; loading: boolean }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center transition-all">
//       <div className="bg-gray-50 p-6 rounded-xl shadow-2xl w-11/12 max-w-4xl border border-gray-200">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             🎬 Video Preview
//           </h2>
//           <button 
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
//           >
//             <svg 
//               className="w-6 h-6 text-gray-600"
//               fill="none" 
//               stroke="currentColor" 
//               viewBox="0 0 24 24"
//             >
//               <path 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round" 
//                 strokeWidth={2} 
//                 d="M6 18L18 6M6 6l12 12" 
//               />
//             </svg>
//           </button>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-gray-600"></div>
//           </div>
//         ) : (
//           <div className="aspect-video relative group">
//             <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-gray-200/20 rounded-lg" />
//             <div className="absolute top-2 right-2 w-12 h-12 bg-transparent z-10" />
//             <iframe
//               src={videoUrl.embed_url}
//               className="w-full h-full rounded-lg shadow-lg relative z-0 transform transition-transform duration-300 hover:scale-[1.01]"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
//               allowFullScreen
//               title="Video Playback"
//               frameBorder="0"
//               loading="eager"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BatchVideo

