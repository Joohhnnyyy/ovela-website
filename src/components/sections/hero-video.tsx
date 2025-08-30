"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const HeroVideo = () => {
  const [isPlayerOpen, setPlayerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const playerVideoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = "https://cdn.shopify.com/videos/c/o/v/ca375a1da1f54edbabad68bbb8e91fc7.mp4";

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayerOpen = () => {
    setPlayerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handlePlayerClose = useCallback(() => {
    if (playerVideoRef.current) {
      playerVideoRef.current.pause();
    }
    setPlayerOpen(false);
    setIsPlaying(false);
    document.body.style.overflow = '';
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = playerVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = playerVideoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };
  
  useEffect(() => {
    const video = playerVideoRef.current;
    if (isPlayerOpen && video) {
      setIsMuted(false);
      video.muted = false;
      video.play().then(() => setIsPlaying(true)).catch(() => {});

      const handleTimeUpdate = () => {
        setCurrentTime(formatTime(video.currentTime));
      };
      
      const handleLoadedMetadata = () => {
        setDuration(formatTime(video.duration));
      };

      const handleVideoEnd = () => {
        handlePlayerClose();
      };
      
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('ended', handleVideoEnd);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [isPlayerOpen, handlePlayerClose]);

  return (
    <>
      <section className="relative grid w-full bg-black min-h-[100svh] lg:h-screen lg:max-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <video
            key={videoSrc}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/70" />

        <div className="relative z-10 col-span-full row-span-full grid place-items-center">
          <motion.button
            onClick={handlePlayerOpen}
            aria-label="Watch the video"
            className="c-button-group col-span-full row-span-full flex gap-x-2 self-center justify-self-center items-center text-white bg-black/30 backdrop-blur-sm border border-white/20 rounded-full py-2 px-3 lg:px-4 group hover:bg-white/10 transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Video className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
            <span className="text-sm font-sans uppercase hidden lg:!grid">
              Watch video
            </span>
          </motion.button>
        </div>

        <div className="absolute z-10 inset-0 flex items-center justify-between px-16 lg:px-70 pointer-events-none">
          <motion.div 
            className="flex w-full justify-between lg:w-1/4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="font-body text-[20px] uppercase text-white">0FLYN</p>
            <p className="font-body text-[20px] uppercase text-white">memory</p>
          </motion.div>
          <motion.div 
            className="hidden w-1/4 justify-between lg:flex"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="font-body text-[20px] uppercase text-white">collection</p>
            <p className="font-body text-[20px] uppercase text-white">2025</p>
          </motion.div>
        </div>
      </section>

      {/* Video Player Modal */}
      <AnimatePresence>
        {isPlayerOpen && (
          <motion.div 
            className="fixed inset-0 z-[100] grid bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handlePlayerClose}
          >
            <motion.video
              ref={playerVideoRef}
              src={videoSrc}
              playsInline
              className="col-span-full row-span-full h-full w-full object-contain cursor-pointer"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <source src={videoSrc} type="video/mp4" />
            </motion.video>

            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-4 lg:p-10 flex items-end justify-between" 
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Button variant="ghost" size="icon" onClick={toggleMute} aria-label="Mute video" className="bg-black/50 hover:bg-white/20 text-white rounded-full">
                {isMuted ? <VolumeX className="h-[18px] w-[18px]" /> : <Volume2 className="h-[18px] w-[18px]" />}
              </Button>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={togglePlay} aria-label="Play video" className="bg-black/50 hover:bg-white/20 text-white rounded-full">
                  {isPlaying ? <Pause className="h-[18px] w-[18px]" /> : <Play className="h-[18px] w-[18px]" />}
                </Button>
                <div className="font-mono text-sm bg-black/50 px-3 py-2 rounded-full text-white pointer-events-none">
                  {currentTime} / {duration}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroVideo;