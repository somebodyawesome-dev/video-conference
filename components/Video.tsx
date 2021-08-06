import { useEffect, useRef } from "react";

type VideoProps = {
  stream: MediaStream;
};

export default function VideoComp({ stream }: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
  }, [stream, videoRef.current]);

  return (
    <video
      className="absolute w-full h-full rounded-lg top-0 left-0"
      ref={videoRef}
      autoPlay
    ></video>
  );
}
