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

export const createTimestamps = (data) => {
  const now = new Date();
  return {...data,
    createdAt: now,
    updatedAt: now,
  };
};
