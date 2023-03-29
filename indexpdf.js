const { PDFDocument, PageSizes } = require("pdf-lib");
const { writeFileSync, readFileSync } = require("fs");
const fs = require("fs");
const dotenv = require("dotenv");
var path = require('path')
dotenv.config({ path: path.join(__dirname, ".env") });
const casas = require(process.env.JSON_PATH);

if(!fs.existsSync(process.env.PDF_FOLDER)) {
  fs.mkdirSync(process.env.PDF_FOLDER, { recursive: true });
}else{
  fs.rmSync(process.env.PDF_FOLDER, { recursive: true });
  fs.mkdirSync(process.env.PDF_FOLDER, { recursive: true });
}

async function createPDF() {
  const document = await PDFDocument.create();

  var contador = 1;
  var i = 0;
  var j = 1;
  var borderleft = 0;
  var borderbottom = 19;
  var page = document.addPage(PageSizes.Tabloid);
  for (const { id, casa } of casas) {
    const imgBuffer = fs.readFileSync(`./${process.env.OUTPUT_FOLDER}/${casa}.jpg`);
    const img = await document.embedJpg(imgBuffer);

    const { width, height } = img.scale(0.23);
    const imgdim = img.scale(0.23);
    const xwidth = (page.getWidth() / 3) * j - width - borderleft;
    const yheight = page.getHeight() - height * i - height - borderbottom;
    page.drawImage(img, {
      x: xwidth,
      y: yheight,
      width: imgdim.width,
      height: imgdim.height,
    });
    console.log("C:" + contador + " i:" + i + "  j: " + j);
    //console.log("xwidth: " + xwidth + "   yheight: " + yheight);
    console.log("borderbottom: " + borderbottom);

    switch (contador) {
      case 2:
      case 5:
      case 8:
      borderleft = 38;
      borderbottom=19+i;
      break;
      case 3:
      case 6:
        borderleft = 0;
        i += 1;
        j = 0;
        borderbottom=19+i;
        break;
      case 9:
        borderleft = 0;
        i = 0;
        j = 0;
        borderbottom=19+i;
        contador = 0;
        var page = document.addPage(PageSizes.Tabloid);
        console.log("-----------------------------------------");
        break;
      default:
      borderleft = 19;
      borderbottom=19+i;
        break;
    }

    j += 1;
    contador += 1;
  }
  await writeFileSync(`./${process.env.PDF_FOLDER}/${process.env.NAME_PDF_FILE}`, await document.save());
}

createPDF().catch((err) => console.log(err));
