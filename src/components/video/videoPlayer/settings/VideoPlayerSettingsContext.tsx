import React, {createContext, useContext, useState} from "react";

interface Language {
  index: number;
  title?: string;
  language?: string;
  selected?: boolean;
}

interface VideoPlayerSettings {
  speed?: number;
  setSpeed?: (speed: number) => void;
  languages: Language[];
  setLanguages: (languages: Language[], videoId?: string) => void;
  selectedLanguage?: Language;
  selectLanguage: (language: Language) => void;
}

const VideoPlayerSettingsCtx = createContext<VideoPlayerSettings>({
  setLanguages: () => console.warn("No context provider found"),
  languages: [],
  selectLanguage: () => console.warn("No context provider found"),
});

export function VideoPlayerSettingsContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [speed, setSpeed] = useState(1);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<
    Language | undefined
  >(undefined);
  const [manualSelections, setManualSelections] = useState<Record<string, boolean>>({});
  const [currentVideoId, setCurrentVideoId] = useState<string>("");

  // Helper function to find the best audio track (original or last)
  const findBestAudioTrack = (languages: Language[]) => {
    if (languages.length === 0) return undefined;
    
    const originalTrack = languages.find(lang => 
      lang.title?.toLowerCase().includes('original')
    );
    
    if (originalTrack) {
      return originalTrack;
    }
    return languages[languages.length - 1];
  };

  // Automatically select the best audio track (original or last) for new videos
  const handleSetLanguages = (newLanguages: Language[], videoId?: string) => {
    setLanguages(newLanguages);
    
    // If videoId is provided and it's a new video, reset manual selection for this video
    if (videoId && videoId !== currentVideoId) {
      setCurrentVideoId(videoId);
      setManualSelections(prev => ({ ...prev, [videoId]: false }));
      
      if (newLanguages.length > 0) {
        const lastLanguage = findBestAudioTrack(newLanguages);
        setSelectedLanguage(lastLanguage);
      } else {
        setSelectedLanguage(undefined);
      }
    } else if (newLanguages.length > 0) {
      const hasManuallySelectedForThisVideo = manualSelections[currentVideoId] || false;
      
      // No manual selection for this video yet, select best track
      if (!hasManuallySelectedForThisVideo) {
        const lastLanguage = findBestAudioTrack(newLanguages);
        setSelectedLanguage(lastLanguage);
      } else {
        // Manual selection exists, check if selected language is still valid
        if (selectedLanguage && !newLanguages.find(lang => lang.index === selectedLanguage.index)) {
          const lastLanguage = findBestAudioTrack(newLanguages);
          setSelectedLanguage(lastLanguage);
        }
      }
    }
  };

  const handleSelectLanguage = (language: Language) => {
    setSelectedLanguage(language);
    if (currentVideoId) {
      setManualSelections(prev => ({ ...prev, [currentVideoId]: true }));
    }
  };

  return (
    <VideoPlayerSettingsCtx.Provider
      value={{
        speed,
        setSpeed,
        languages,
        setLanguages: handleSetLanguages,
        selectLanguage: handleSelectLanguage,
        selectedLanguage,
      }}>
      {children}
    </VideoPlayerSettingsCtx.Provider>
  );
}

export function useVideoPlayerSettings() {
  return useContext(VideoPlayerSettingsCtx);
}
