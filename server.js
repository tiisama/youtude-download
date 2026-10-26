const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

const app = express();

// すべての接続元からのアクセスを安全に許可（CORS対応）
app.use(cors({
    origin: '*',
    exposedHeaders: ['Content-Disposition']
}));

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;
    if (!videoURL) {
        return res.status(400).send('URLがありません');
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '') || 'video';

        // ダウンロードヘッダーの設定
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
