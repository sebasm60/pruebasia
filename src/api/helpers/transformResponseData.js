export const transformResponseData = (response) => {
  const trimProperties = (obj) => {
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        return obj.map(trimProperties);
      } else {
        for (const key in obj) {
          obj[key] = trimProperties(obj[key]);
        }
      }
    } else if (typeof obj === 'string') {
      return obj.trim().replace(/  +/g, ' ');
    }
    return obj;
  };

  if (typeof response.data === 'object' && response.data !== null) {
    response.data = trimProperties(response.data);
  }

  return response;
};