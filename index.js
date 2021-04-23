const Mustache = require('mustache');
const fs = require('fs');
const puppeteerService = require('./services/puppeteer.service');

const TEMPLATE_FILE = './README.template.md';

let DATA = {};

async function setInstagramPosts() {
  const instagramImages = await puppeteerService.getLatestInstagramPostsFromAccount('nanhaajaan', 5);
  DATA.img1 = instagramImages[0];
  DATA.img2 = instagramImages[1];
  DATA.img3 = instagramImages[2];
  DATA.img3 = instagramImages[3];
  DATA.img3 = instagramImages[4];
}

async function generateReadMe() {
  await fs.readFile(TEMPLATE_FILE, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

async function action() {
  await setInstagramPosts();

  await generateReadMe();

  await puppeteerService.close();
}

action();
