const fs = require("fs");
var jimp = require('jimp');
const QRCode = require('qrcode');
var path = require('path')
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

if(!fs.existsSync(process.env.QR_FOLDER)) {
    fs.mkdirSync(process.env.QR_FOLDER, { recursive: true });
}else{
    fs.rmSync(process.env.QR_FOLDER, { recursive: true });
    fs.mkdirSync(process.env.QR_FOLDER, { recursive: true });
}
if(!fs.existsSync(process.env.OUTPUT_FOLDER)) {
    fs.mkdirSync(process.env.OUTPUT_FOLDER, { recursive: true }); 
}else{
    fs.rmSync(process.env.OUTPUT_FOLDER, { recursive: true });
    fs.mkdirSync(process.env.OUTPUT_FOLDER, { recursive: true }); 
}

const generateQR = async (casa,url) => {
	try {
        var options = {width: 400,height: 400, margin: 1};
        await QRCode.toFile(process.env.QR_FOLDER+'/'+casa+'.png', url, options);
	} catch(err){
		console.log(err);
	}
}

async function setQRtoCorbatin(casa) {
    const image = await jimp.read(process.env.SRC_FOLDER+'/'+process.env.BASE_IMAGE);
    //Agrega el texto de la casa
    const font = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
    image.print(font, 443,740, casa);
    //lee el codigo QR
    const qrcode = await jimp.read(process.env.QR_FOLDER+'/'+casa+'.png');
    //agrega el codigo QR
    image.composite(qrcode, 332,810);
    //Guarda
    await image.writeAsync(process.env.OUTPUT_FOLDER+'/'+casa+'.jpg');
}

const casas = require(process.env.JSON_PATH);
Promise.all(casas.map(
    async (casa) => {
        var numero = casa.casa
        var url = casa.link
        console.log(url)
        generateQR(numero,url);
        setQRtoCorbatin(numero);
    })
);