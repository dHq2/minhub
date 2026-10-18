const fs=require('fs'); const h=fs.readFileSync(__dirname+'/build/gul-battle.html','utf8');
fs.writeFileSync(__dirname+'/build/wrapped.html','<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><style>[hidden]{display:none!important}body{margin:0}</style></head><body>'+h+'\n</body></html>');
console.log('wrapped');
