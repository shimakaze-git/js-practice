// httpとfsモジュールの読み込み
var http = require('http');
var fs = require('fs');

// hostとportの定義
const host = '127.0.0.1';
const port = 8192;

http.createServer(function(req, res) {
    console.log('start');

    //  index.htmlを読み込んで表示
    // fs.readFileは非同期で実行される
    fs.readFile('index.html', function(err, content) {
        if (err) { throw err; }

        console.log("response end");
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        // res.end(content);

        // 上記二行をコメントアウトすると、index.htmlは表示されない。
        // 理由はindex.htmlの読み込みが完了する前にHTTPレスポンスを返してしまうため。
        // res.end()を呼び出すと、レスポンス生成の完了がNode.jsに通知される

        // res.end()だけをコメントアウトしても、index.htmlは当然だが表示されない
        
        // res.end()が無いと、Node.jsはレスポンス生成の完了を検知できない
        // そのため、レスポンス生成の完了が検知できないと処理をブロックし続ける
        // 2分くらいするとタイムアウトしてしまう

        // イベントハンドラでブロックしてしまうと、後続のイベントが実行待ち状態になる
        // イベントループモデルでプログラムを組む場合は、処理をブロックしないように注意する必要があり

        // WEBアプリケーションで重たい処理を実行する場合、一旦レスポンスを返し、バックグラウンドで処理を実行する。
        // 処理が終わったら通知するような仕組みで実装する必要があり
    });
    console.log('end');
 
    // index.htmlの読み込みを待たずにレスポンスを返す
    // res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    // res.end();

}).listen(port, host);
console.log('http://127.0.0.1:8192/');
