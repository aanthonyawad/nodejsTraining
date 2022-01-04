// IMPORTS
import http from 'http';
import url from 'url';
import fs from 'fs';

//DIRNMAE ALT
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// TEMPLATE DATA
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const replaceTemplate = (temp, el) => {
  let out = temp.replace(/{%ID%}/g, el.id);
  out = out.replace(/{%IMAGE%}/g, el.image);
  out = out.replace(/{%PRODUCTNAME%}/g, el.productName);
  out = out.replace(/{%IMAGE%}/g, el.nutrients);
  out = out.replace(/{%IMAGE%}/g, el.quantity);
  out = out.replace(/{%PRICE%}/g, el.price);
  if (!el.organic) out = out.replace(/{%NOTORGANIC%}/g, 'not-organic');
  out = out.replace(/{%IMAGE%}/g, el.description);
  return out;
};

//API DATA
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;
  console.log(pathName);
  //OVERVIEW PAGE
  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const newDataObj = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    let out = tempOverview.replace(/{%PRODUCTCARDS%}/g, newDataObj);
    return res.end(out);
    //PRODUCT PAGE
  } else if (pathName === '/product') {
    const id = parsedUrl.query.id;

    let out = replaceTemplate(tempProduct, dataObj[id]);
    return res.end(out);
    //API
  } else if (pathName === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(data);
    //NOT FOUND
  } else {
    res.writeHead(404);
    return res.end('Page Not found');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening on server 8000');
});
