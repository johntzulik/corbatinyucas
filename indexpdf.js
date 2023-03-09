const { PDFDocument, PageSizes } = require("pdf-lib");
const { writeFileSync, readFileSync } = require("fs");
const fs = require("fs");
const casas = require("./json/casas");

async function createPDF() {
  const document = await PDFDocument.create();

  var contador = 1;
  var i = 0;
  var j = 1;
  var page = document.addPage(PageSizes.Tabloid);
  for (const { id, casa } of casas) {
    const imgBuffer = fs.readFileSync(`./output/${casa}.jpg`);
    const img = await document.embedJpg(imgBuffer);

    const { width, height } = img.scale(0.23);
    const imgdim = img.scale(0.228);
    const xwidth = (page.getWidth() / 3) * j - width - 10;
    const yheight = page.getHeight() - height * i - height - 20;
    page.drawImage(img, {
      x: xwidth,
      y: yheight,
      width: imgdim.width,
      height: imgdim.height,
    });
    console.log("xwidth: " + xwidth + "   yheight: " + yheight);
    console.log("C:" + contador + " i:" + i + "  j: " + j);

    switch (contador) {
      case 1:
        break;
      case 3:
        i += 1;
        j = 0;
        break;
      case 6:
        i += 1;
        j = 0;
        break;
      case 9:
        i = 0;
        j = 0;
        contador = 0;
        var page = document.addPage(PageSizes.Tabloid);
        console.log("-----------------------------------------");
        break;
      default:
        break;
    }

    j += 1;
    contador += 1;
  }
  await writeFileSync(`./PDF/All-the-pages.pdf`, await document.save());
}

createPDF().catch((err) => console.log(err));
