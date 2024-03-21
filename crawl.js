const { JSDOM } = require("jsdom");

function normalizeURL(url) {
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;

  if (fullPath.length > 0 && fullPath.slice(-1) === "/") {
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const aElements = dom.window.document.querySelectorAll("a");
  for (const aElement of aElements) {
    if (aElement.href.slice(0, 1) === "/") {
      // relative
      try {
        const urlObj = new URL(aElement.href, baseURL);
        urls.push(urlObj.href);
      } catch (err) {
        console.error(`${err.message}: ${aElement.href}`);
      }
    } else {
      // absolute
      try {
        const urlObj = new URL(aElement.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.error(`${err.message}: ${aElement.href}`);
      }
    }
  }

  return urls;
}

async function crawlPage(baseURL, currentURL, pages) {
  // Skip external URLs
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);

  // If we have already crawled this page, increment the count and return
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  // Add the page to the list of crawled pages
  pages[normalizedCurrentURL] = 1;

  // Fetch and parse the HTML of the current page
  console.log(`Crawling: ${currentURL}`);
  let htmlBody = "";

  try {
    const response = await fetch(currentURL);
    if (response.status > 399) {
      console.error(
        `Error fetching with status code ${response.status} on page: ${currentURL}`
      );
      return pages;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.error(
        `Skipping non-HTML page: ${currentURL} (content-type: ${contentType})`
      );
      return pages;
    }

    htmlBody = await response.text();
  } catch (error) {
    console.error(`Error fetching ${currentURL}: ${error.message}`);
  }

  const nextURLs = getURLsFromHTML(htmlBody, baseURL);
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages);
  }

  return pages;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
