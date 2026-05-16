export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = {
    'năm': 31536000,
    'tháng': 2592000,
    'tuần': 604800,
    'ngày': 86400,
    'giờ': 3600,
    'phút': 60,
    'giây': 1
  };

  for (let unit in intervals) {
    const counter = Math.floor(seconds / intervals[unit]);
    if (counter >= 1) {
      return `${counter} ${unit} trước`;
    }
  }
  return "vừa xong";
}

export const displayDuration = (seconds) => {
    const totalSeconds = Math.floor(seconds);
    
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");

    if (h > 0) {
      return `${h}:${mm}:${ss}`;
    }
    return `${mm}:${ss}`;
};

export const formatTime = (sec) => {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};