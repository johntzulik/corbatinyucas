var jimp = require('jimp');
const QRCode = require('qrcode');

const generateQR = async (casa,url) => {
	try {
        var options = {width: 400,height: 400, margin: 1};
        await QRCode.toFile('qrimages/'+casa+'.png', url, options);
	} catch(err){
		console.log(err);
	}
}

async function setQRtoCorbatin(casa) {
    const image = await jimp.read('images/las-Yucas-corbatin-9x13.jpg');
    //Agrega el texto de la casa
    const font = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
    image.print(font, 443,740, casa);
    //lee el codigo QR
    const qrcode = await jimp.read('qrimages/'+casa+'.png');
    //agrega el codigo QR
    image.composite(qrcode, 332,810);
    //Guarda
    await image.writeAsync('output/'+casa+'.jpg');
}

const casas = require("./json/casas");
Promise.all(casas.map(
    async (casa) => {
        var numero = casa.casa
        var url = casa.link
        console.log(url)
        generateQR(numero,url);
        setQRtoCorbatin(numero);
    })
);