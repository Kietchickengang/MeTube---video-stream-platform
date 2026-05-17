import React, { useEffect, useRef, useState } from "react";
import { Settings, Check } from "lucide-react";

const VideoSettings = ({ hls, currentQuality, setCurrentQuality, controlBtnClass, }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const qualityLevels = hls?.levels || [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const changeQuality = (index) => {
    if (!hls) return;
    hls.currentLevel = index;

    if (index === -1) {
      setCurrentQuality("Auto");
    } 
    else {
      setCurrentQuality(
        `${hls.levels[index].height}p`
      );
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* SETTINGS BUTTON */}
      <button
        type="button"
        onClick={(e) => {e.stopPropagation(); setOpen((v) => !v);}}
        className={controlBtnClass}
      >
        <Settings size={20} />
      </button>

      {/* MENU */}
      {open && (
        <div className="
            absolute bottom-14 right-0
            w-52
            bg-[#282828]/85
            border-none
            rounded-xl
            shadow-[0_8px_32px_rgba(0,0,0,0.35)]
            overflow-hidden
            z-50
          "
          onClick={
            (e) => stopPropagation()
          }
        >
          {/* TITLE */}
          <div className="px-4 py-3 border-b border-gray-400 text-sm font-semibold text-white">
            Quality
          </div>

          {/* AUTO */}
          <button
            onClick={(e) => {e.stopPropagation(); changeQuality(-1)}} className="
              w-full flex items-center justify-between
              px-4 py-3
              text-sm text-white
              hover:bg-[#2a2a2a]
              transition-colors
            "
          >
            <span>Auto</span>
            {currentQuality === "Auto" && (
              <Check size={16} />
            )}
          </button>

          {/* LEVELS */}
          {[...qualityLevels]
            .sort((a, b) => b.height - a.height)
            .map((level, idx) => {
              const originalIndex =
                qualityLevels.findIndex(
                  (l) => l.height === level.height
                );
              const label = `${level.height}p`;

              return (
                <button
                  key={`${level.height}-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeQuality(originalIndex);
                    }
                  }
                  className="
                    w-full flex items-center justify-between
                    px-4 py-3
                    text-sm text-white
                    hover:bg-[#2a2a2a]/55
                    transition-colors
                  "
                >
                  <span>{label}</span>
                  {currentQuality === label && (
                    <Check size={16} />
                  )}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default React.memo(VideoSettings);