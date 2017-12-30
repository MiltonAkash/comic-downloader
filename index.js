let cheerio = require('cheerio');
let rp = require('request-promise');
let fs = require('fs');
let base_url = 'http://explosm.net';///comics/43';
rp = rp.defaults({proxy:'http://proxy.ssn.net:8080'});


//Status
let state = {
	visited:{},
	max:5000,
	tried:0,
	//tried: Object.keys(state.visited).length,
	success :0,
	failure : 0,
	print:()=>{
		console.log("Success"+state.success ,"Failure:" +state.failure);
	},
	count:()=> state.success+state.failure
};

//SCRAPE THIS URL
const downloadPage = async(base_url,spec) => {
	state.tried++;
	let id = spec.slice(0,-1).split('/').pop();
	if(state.visited[id]) return 0;
	state.visited[id]=1;
	let options = {
        uri:base_url+spec,
        transform: body => cheerio.load(body)
    };
	try{
		let $ = await rp(options);
		let next_page = $('.next-comic').eq(0).attr('href')
        let image_src = $('#main-comic').eq(0).attr('src');
        console.log(next_page,image_src);
		if(state.tried < state.max){
			downloadPage(base_url,next_page);
		}
		downloadImage('http:'+image_src,id);

		state.print();
	}
	catch(err){
		console.log("ERROR on "+i);
		state.failure++;
		state.print();
	}

}

//DOWNLOAD IMAGE
const downloadImage = async(url,id)=>{
	console.log("DWONLOD",url);
    let name = url.split('/').pop();
	let ext = url.split('.').pop();
    let options = {uri:url,encoding:null};
	let res = await rp(options);
    fs.writeFile('./comics/'+id+'.'+ext,res,'binary',()=> console.log(id+'.'+ext));
}


downloadPage(base_url,'/comics/43/');
// downloadImage('http://files.explosm.net/comics/fat0001.jpg',1);