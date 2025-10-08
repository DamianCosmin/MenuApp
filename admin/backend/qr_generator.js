import QRCode from "qrcode";

const baseUrl = "http://192.168.68.102:5050/api/tables/";

for (let i = 1; i <= 23; i++) {
  const url = `${baseUrl}${i}`;
  const filename = `../../assets/qrcodes/qr_${i}.png`;

  QRCode.toFile(filename, url, (err) => {
    if (err) throw err;
    console.log(`Saved: ${filename}`);
  });
}
