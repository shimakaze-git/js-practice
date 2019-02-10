"use strict";
require('heapdump');

// メモリリークDataとノンメモリリークDataの配列
var leakyData = [];
var nonLeakyData = [];

class SimpleClass {
    constructor(text){
        this.text = text;
    }
}

// dataStore(配列), randomObject(SimpleClassのインスタンス)
function cleanUpData(dataStore, randomObject){
    // randomObjectが配列のインデック(位置)を取得
    var objectIndex = dataStore.indexOf(randomObject);

    // console.log(randomObject, objectIndex);

    // インデックスobjectIndex番目から、1つの要素を削除
    dataStore.splice(objectIndex, 1);
}

function getAndStoreRandomData(){
    // 文字列型の乱数を生成
    // SimpleClassのコンストラクタの引数に格納
    var randomData = Math.random().toString();
    var randomObject = new SimpleClass(randomData);

    // 配列にrandomObjectインスタンスを格納していく
    leakyData.push(randomObject);
    nonLeakyData.push(randomObject);

    // console.log(randomData);
    // console.log(typeof(randomData));

    cleanUpData(leakyData, randomObject);
    cleanUpData(nonLeakyData, randomObject);
}

function generateHeapDumpAndStats(){
    // 1.この関数が呼び出されるたびにガベージコレクションを強制
    try{
        global.gc();
    }catch(e){
        console.log(
            "'node --expose-gc'でプログラムを実行すべきです。"
        );
        process.exit();
    }

    // 2.Heap statsを表示
    var heapUsed = process.memoryUsage().heapUsed;
    console.log("Program is using " + heapUsed + " bytes of Heap.")

    // 3.HeapDumpを取得
    process.kill(process.pid, 'SIGUSR2');
}


// setInterval…一定時間ごとに特定の処理を繰り返す
// (関数function, 一定時間の指定)

// 5ミリ秒ごとにgetAndStoreRandomDataを実行
// ランダムなデーターを追加していく
setInterval(getAndStoreRandomData, 5);

// 2秒毎にガベージコレクショを実行し、ヒープダンプする
setInterval(generateHeapDumpAndStats, 2000);
// setInterval(generateHeapDumpAndStats, 10);


// Usage.
// 1. 5ミリ秒ごとに、ランダムにオブジェクトを生成し、leakyDataとnonLeakyDataという名前の2つの配列に格納します。
// nonLeakyData配列は5ミリ秒ごとにクリーンアップしますが、leakyData配列のクリーンアップを”忘れます“。

// 2. 2秒ごとに、プログラムがメモリの使用量を出力します。
//（それに続くヒープダンプの生成については、次のセクションで詳述します）