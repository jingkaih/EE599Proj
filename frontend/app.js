const express = require("express");
const multer = require("multer");
const path = require("path");
const request = require("request")
const fs = require("fs")
const app = express();

let port = 3000;

app.use(express.static("public"));



//handle user's zip file
const storage = multer.diskStorage({destination: __dirname + '/public', filename: function (req, file, cb) {
  cb(null, file.fieldname + path.extname(file.originalname));
}});
const upload = multer({
  storage: storage
});



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


app.post('/form', upload.single('demo'), (req, res) => {
  console.log("User's zip file is received!")
  res.sendStatus(204)
});

app.get('/rslt', (req, res) => {
  reqAndWrite(() => {
    res.sendFile(__dirname + "/public/resultpage.html");//this page has a download link
  });
})

app.listen(port, err => {
  console.log(`Frontend server listening on port: ${port}`);
});

//send request to the back end and handle the response
function reqAndWrite (callback){//be called after client has received demo.zip
  //send request to back end using request module
  let receive_from_backend = new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      url: "http://127.0.0.1:5000/form",
      port: 5000,
      headers: {
          "Authorization": "Basic",
          "Content-Type": "multipart/form-data"
      },
      formData : {
          "demo" : fs.createReadStream(__dirname + "/public/demo.zip")//demo.zip needs to store in public folder
      }
    };
    let stream = request(options);
    resolve(stream);
  })

  receive_from_backend
  .then((stream) => {
    //write file from stream
    let writefile = new Promise((res, rej) => {
      let writefunc = async function(){
        const writeStream = await fs.createWriteStream(__dirname + "/public/result.zip");
        await stream.pipe(writeStream);//The return value of "request" method is a stream
        writeStream.on('finish', () => {res()})
      }
      writefunc()
    })

    writefile
    .then(() => {
    console.log("New zip file received! Ready for download.");
    callback();
    })
    .catch((err) => console.log(err))
  })
  .catch((err) => console.log(err))

  
};