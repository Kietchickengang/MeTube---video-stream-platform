const now = new Date();

const replacePattern = {
    "/" : "-",
    " " : "_",
}

export const vnTimeString = now.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    dateStyle: "short",
    timeStyle: "medium",
})
.replace(/[ /]/g, change => replacePattern[change]);

export const getFileExtension = (filename) => {return filename.split(".").pop();}

export const checkValidFormat = (filename) => {
    const file_extension = getFileExtension(filename);
    return ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'webm'].includes(file_extension);
}

export const createTimestamps = (data) => {
  const now = new Date();
  return {...data,
    createdAt: now,
    updatedAt: now,
  };
};
