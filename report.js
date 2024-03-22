function sortPages(pages) {
  const pagesArray = Object.entries(pages);
  return pagesArray.sort((pageA, pageB) => pageB[1] - pageA[1]);
}

function printReport(pages) {
  console.log("==========");
  console.log("Report");
  console.log("==========");
  const sortedPages = sortPages(pages);
  for (const sortedPage of sortedPages) {
    const url = sortedPage[0];
    const count = sortedPage[1];
    console.log(`Found ${count} internal links to ${url}`);
  }
  console.log("==========");
  console.log("The End");
  console.log("==========");
}

module.exports = {
  sortPages,
  printReport,
};
