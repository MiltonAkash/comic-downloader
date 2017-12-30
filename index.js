let cheerio = require('cheerio');
let rp = require('request-promise');
let fs = require('fs');
let base_url = 'http://explosm.net/comics/';
let success = 0,failure = 0;
rp = rp.defaults({proxy:'http://proxy.ssn.net:8080'});

for (let i = 8000; i < 16000; i++) {
    let options = {
        uri: base_url + i,
	//	proxy:'http://proxy.ssn.net:8080',
        transform: body => cheerio.load(body)
    };
    rp(options).then($ => {
        let image = $('#main-comic').eq(0).attr('src');
        console.log(image);
        success++;
        console.log(success,failure);

        download(image,i);
    }).catch(err => {console.log("ERROR on "+i);failure++;        console.log(success,failure);
    });


}

 const download = (url,id)=>{
     url = 'http:'+url;
     let name = url.split('/').pop();
     let options = {uri:url,encoding:null};
     rp(options).then(res=> {
         fs.writeFile('./comics/'+id+'.png',res,'binary',()=> console.log(id));
     });

 }
