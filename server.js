const express = require('express');
const ytdl = require('@distube/ytdl-core');

const app = express();

// ローカルファイル（origin 'null'）からのアクセスや、すべてのCORSブロックを完全に防ぐ手動ミドルウェア
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');
    res.header('Access-Control-Expose-Headers', 'Content-Disposition');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;
    if (!videoURL) {
        return res.status(400).send('URLがありません');
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '') || 'video';

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.header('Content-Type', 'video/mp4');

        ytdl(videoURL, {
            format: 'mp4',
            quality: 'highest'
        }).pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).send('ダウンロード処理に失敗しました');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
