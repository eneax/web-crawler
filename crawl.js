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

async function crawlPage(currentURL) {
  console.log(`Crawling: ${currentURL}`);

  try {
    const response = await fetch(currentURL);

    if (response.status > 399) {
      console.error(
        `Error fetching with status code ${response.status} on page: ${currentURL}`
      );
      return;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.error(
        `Skipping non-HTML page: ${currentURL} (content-type: ${contentType})`
      );
      return;
    }

    console.log(await response.text());
  } catch (error) {
    console.error(`Error fetching ${currentURL}: ${error.message}`);
  }
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
