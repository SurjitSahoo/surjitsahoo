const puppeteer = require('puppeteer');
class PuppeteerService {
  browser;
  page;

  async init() {
    this.browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--incognito',
        // '--proxy-server=http=194.67.37.90:3128',
        // '--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"', //
      ],
      // headless: false,
    });
  }

  /**
   * @param {string} url
   */
  async goToPage(url) {
    if (!this.browser) {
      await this.init();
    }
    this.page = await this.browser.newPage();

    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US',
    });

    await this.page.goto(url, {
      waitUntil: `networkidle0`,
    });
  }

  async close() {
    await this.page.close();
    await this.browser.close();
  }

  /**
   * @param {string} acc Account to crawl
   * @param {number} n Qty of image to fetch
   */
  async getLatestInstagramPostsFromAccount(acc, n) {
    await this.goToPage(`https://www.picuki.com/profile/${acc}`);

    await this.page.screenshot({ path: 'ab.png' });
    try {
      const nodes = await this.page.evaluate(() => {
        const images = document.querySelectorAll('.post-image');
        return [].map.call(images, img => img.src);
      });

      return nodes.slice(0, n ?? 5);
    } catch (error) {
      console.log('Error', error);
      process.exit();
    }
  }
}

const puppeteerService = new PuppeteerService();

module.exports = puppeteerService;
