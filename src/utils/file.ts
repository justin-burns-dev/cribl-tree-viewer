export const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  } else {
    return `${Math.round(size / (1024 * 1024))} MB`;
  }
};