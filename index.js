const express = require('express');
const http = require('http');
// Socket.ioのインポート
const socketIo = require('socket.io');

const app = express();
const server = http.Server(app);
// 初期化
const io = socketIo(server);

const PORT = 3000;

// ルーティング設定 ('/'にリクエストがあった場合にsrc/index.htmlを返す)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 3000番ポートでhttpサーバー起動
server.listen(PORT, () => {
    console.log(`listening on port) ${PORT}`);
});

// クライアントと接続できたら通知を表示する
io.on('connection', (socket) => {
    console.log('a user connected')

    // ユーザー名の入力を受信
    socket.on('setUserName', function (userName) {
        if(!userName) userName = '匿名';
    
        socket.userName = userName;
    });

    // 'sendMessage'というイベント名で受信
    socket.on('sendMessage', (message) => {
        console.log('Message has been sent: ', message);

        //'receiveMessage'イベントを発火、受信したメッセージを全クライアントに送信
        io.emit('receiveMessage', socket.userName + "： " + message);
    });
});

