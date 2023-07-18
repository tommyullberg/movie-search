

export const formatDate = (dateString: string) => {
  const releaseDate = new Date(dateString);
  const formattedDate = releaseDate.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
  return formattedDate;
};


export const formatYear = (dateString: string) => {
  const releaseDate = new Date(dateString);
  const formattedDate = releaseDate.toLocaleDateString('en-US', {
    year: 'numeric'
  });
  return formattedDate;
};