import { useEffect, useRef } from "react";

type VideoProps = {
  stream: MediaStream;
  isMuted?: boolean;
};

export default function VideoComp({ stream, isMuted }: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
  }, [stream, videoRef.current]);

  return (
    <video
      className="absolute w-full h-full rounded-lg top-0 left-0"
      ref={videoRef}
      muted={isMuted}
      autoPlay
    ></video>
  );
}
