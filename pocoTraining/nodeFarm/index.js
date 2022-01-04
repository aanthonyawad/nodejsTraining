
// IMPORTS
import http from "http";
import url from 'url';
import fs from 'fs';

//DIRNMAE ALT
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const  data= fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);
const server = http.createServer((req,res)=>{
    const pathName = req.url;

    if(pathName === '/' || pathName === '/overview'){

        return res.end('Hello from Overview');
    }else if (pathName === '/product') {
        return res.end('Hello from Product');
    }else if(pathName === '/api'){
        res.writeHead(200,{'Content-Type':'application/json'});
        return res.end(data);
    }else{
        res.writeHead(404);
        return res.end('Page Not found');
    }

});

server.listen(8000,'127.0.0.1',()=>{
    console.log('Listening on server 8000');
})