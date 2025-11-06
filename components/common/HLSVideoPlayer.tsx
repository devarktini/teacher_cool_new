import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface HLSVideoPlayerProps {
  url: string;
}

const HLSVideoPlayer: React.FC<HLSVideoPlayerProps> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setHasError(false);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log("Video and HLS.js are now bound together");
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log(
          `Manifest loaded, found ${data.levels.length} quality level(s)`
        );
        setIsLoading(false);
        video.play().catch((err) => {
          console.warn("Autoplay prevented:", err);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS Error:", data);
        if (data.fatal) {
          setHasError(true);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setErrorMessage("Network error occurred. Please check your connection.");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setErrorMessage("Media error occurred. Attempting to recover...");
              hls.recoverMediaError();
              break;
            default:
              setErrorMessage("Fatal error occurred. Unable to play video.");
              hls.destroy();
              break;
          }
        }
      });

      hls.loadSource(url);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = url;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
      });
      video.addEventListener("error", () => {
        setHasError(true);
        setErrorMessage("Error loading video. Please try again.");
      });
      video.play().catch((err) => {
        console.warn("Autoplay prevented:", err);
      });
    } else {
      setHasError(true);
      setErrorMessage("HLS is not supported in this browser.");
    }
  }, [url]);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl group">
      {/* Loading Spinner */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-white text-sm font-medium">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900 to-gray-900 z-10 p-6">
          <div className="text-center max-w-md">
            <div className="mb-4">
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              Playback Error
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-4">
              {errorMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-lg font-medium text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        controls
        controlsList="nodownload"
        playsInline
        preload="metadata"
        className="w-full h-full aspect-video bg-black focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        style={{
          maxHeight: "80vh",
        }}
      >
        <track kind="captions" />
        Your browser does not support the video tag.
      </video>

      {/* Video Overlay Information (optional) */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="flex items-center justify-between text-white text-xs sm:text-sm">
          <span className="font-medium">HD Quality Available</span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-white/20 rounded backdrop-blur-sm">
              HLS Streaming
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HLSVideoPlayer;




// import React, { useEffect, useRef } from "react";
// import Hls from "hls.js";

// interface HLSVideoPlayerProps {
//   url: string;
// }

// const HLSVideoPlayer: React.FC<HLSVideoPlayerProps> = ({ url }) => {
//   // Note the generic <HTMLVideoElement | null>
//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (Hls.isSupported()) {
//       const hls = new Hls();
//       hls.loadSource(url);
//       hls.attachMedia(video);

//       hls.on(Hls.Events.MANIFEST_PARSED, () => {
//         video.play().catch(err => {
//           console.warn("Play error:", err);
//         });
//       });

//       return () => {
//         hls.destroy();
//       };
//     } else {
//       // fallback for browsers that support native HLS via <video> element
//       video.src = url;
//       video.play().catch(err => {
//         console.warn("Play error:", err);
//       });
//     }
//   }, [url]);

//   return (
//     <video
//       ref={videoRef}
//       controls
//       style={{ width: "100%" }}
//     />
//   );
// };

// export default HLSVideoPlayer;
