const fs = require('fs');
const express = require('express');


const app = express();

let PORT = process.env.PORT || 2000;

app.use(express.static('./static'));

app.get('/video', (req, res) => {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send('Range header required');
    }
    const videoPath = 'vid-1.mp4'
    const videoSize = fs.statSync('vid-1.mp4').size;

    const chunk_size = 10 ** 6;
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + chunk_size, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Range": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end })

    videoStream.pipe(res);
})

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));