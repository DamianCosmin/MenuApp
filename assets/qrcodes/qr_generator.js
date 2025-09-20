import QRCode from "qrcode";

const baseUrl = "http://192.168.1.140:5050/tables/";

for (let i = 1; i <= 23; i++) {
  const url = `${baseUrl}${i}`;
  const filename = `qr_${i}.png`;

  QRCode.toFile(filename, url, (err) => {
    if (err) throw err;
    console.log(`Saved: ${filename}`);
  });
}
