var fs = require('fs');
var express = require('express');
var multer  = require('multer');
var path = require('path');
var compressing = require('compressing');
var translate = require('google-translate-api');
var iconv = require('iconv-lite');
var zipper = require('zip-local');

let port = 5000;

var app = express();
//read from POST request
const storage = multer.diskStorage({destination: 'zipped', filename: function (req, file, cb) {
    cb(null, file.fieldname + path.extname(file.originalname));
}});

const upload = multer({
    storage: storage
});

app.post('/form', upload.single('demo'), (req, response) => {
    //compress
    compressing.zip.uncompress('zipped/demo.zip', 'unzipped/')
    .then(() => {
        console.log('unzipping successful!');
        //read MAP.JSON file
        fs.readFile("unzipped/MAP.JSON", (err, json_string) => {
            var json_obj = JSON.parse(json_string);
            translate_eachtxt(json_obj, () => {
                dirzip()
                .then(() => {//send the zip file back to front end
                    response.download(__dirname + "/zipped/result.zip", (err) => {
                    if(err) console.log(err);
                    })
                })
            })
        })
    })
    .catch(err => {
        console.error(err);
    });

});


//translate each text file
async function translate_eachtxt (json_obj,callback){

    for(let eachtxt of Object.keys(json_obj)){//let "eachtxt" stands for file name
        await new Promise(resolve => {
        console.log(`Translating: ${eachtxt}`);

        fs.readFile(`unzipped/${eachtxt}`, (err, data) => {//before read file, read MAP.JSON and get the file name one by one
            if (err) throw err;
            var texts = iconv.decode(data, 'gbk');
            console.log(`The text is: `+ texts);
            //translate
            let original_language = json_obj[eachtxt].from;
            let target_language = json_obj[eachtxt].to;
            translate(texts, {from: original_language, to: target_language})
            .then(res => {
                console.log(res.text);
                fs.writeFile(`unzipped_rslt/${eachtxt}`, res.text, (err) => {//write in folder called unzipped_rslt
                    if (err)
                    throw err;
                    else
                    console.log(`${eachtxt} is done.`);
                    resolve();

                })
            })
            .catch(err => console.error(err))
        })
        })
    }
    callback();
}

//compress the folder
let dirzip = function() {
    return new Promise(function(resolve, reject){
        zipper.zip(__dirname+"/unzipped_rslt", (error, zipped) => {
            if(!error) {
                zipped.compress(); // compress before exporting
                zipped.save(__dirname + "/zipped/result.zip", (error) => {
                    if(!error) {
                        console.log("saved successfully !");
                        resolve();
                    }
                    else console.log(error)
                });
            }
            else console.log(error)
    })
})}


app.listen(port, err => {
    console.log(`Backend server listening on port: ${port}`);
  });
