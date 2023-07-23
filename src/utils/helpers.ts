
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


export const shiftHeadingsDown = (html: string) => {
  const headings = [5, 4, 3, 2, 1];
  let modifiedHtml = html;
  console.log('before', modifiedHtml);
  headings.forEach((heading, index) => {
    const nextHeading = headings[index - 1] || 6;
    const regexOpen = new RegExp(`<h${heading}`, 'g');
    const regexClose = new RegExp(`${heading}h>`, 'g');
    console.log(heading, '=>', nextHeading);
    modifiedHtml = modifiedHtml
      .replace(regexOpen, `<h${nextHeading}`)
      .replace(regexClose, `${nextHeading}h>`);
  });
  console.log('after', modifiedHtml);

  return modifiedHtml;
};
