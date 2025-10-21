import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HLSVideoPlayerProps {
  url: string;
}

const HLSVideoPlayer: React.FC<HLSVideoPlayerProps> = ({ url }) => {
  // Note the generic <HTMLVideoElement | null>
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => {
          console.warn("Play error:", err);
        });
      });

      return () => {
        hls.destroy();
      };
    } else {
      // fallback for browsers that support native HLS via <video> element
      video.src = url;
      video.play().catch(err => {
        console.warn("Play error:", err);
      });
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      style={{ width: "100%" }}
    />
  );
};

export default HLSVideoPlayer;
