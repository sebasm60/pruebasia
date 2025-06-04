export const truncateText = (doc, text, maxWidth) => {
  let truncated = text;
  const ellipsis = "...";
  while (doc.getTextWidth(truncated + ellipsis) > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + (truncated?.length < text?.length ? ellipsis : "");
};