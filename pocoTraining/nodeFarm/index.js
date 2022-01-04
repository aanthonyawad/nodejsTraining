import http from "http";
import url from 'url';

const server = http.createServer((req,res)=>{
    const pathName = req.url;

    if(pathName === '/' || pathName === '/overview'){

        return res.end('Hello from Overview');
    }else if (pathName === '/product'){
        return res.end('Hello from Product');
    }else{
        res.writeHead(404);
        return res.end('Page Not found');
    }

});

server.listen(8000,'127.0.0.1',()=>{
    console.log('Listening on server 8000');
})