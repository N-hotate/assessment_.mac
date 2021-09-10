/* ◆16. 診断機能の開発
　 あなたのいいところ診断 の診断要件
　1) 診断結果のパターンのデータを取得する
　2) 名前を入力すると診断結果が出力される関数を書く
　　　※ 同じ名前なら同じ診断結果にする
　　　※ 診断結果の文章の内、名前の部分は入力された名前にする 
　3) テストを書く */

/* 作業の流れ
　1) 診断結果のパターンを作る（今回は用意されたもの）
　 　● 診断結果をのパターンを、文字列の配列の中身として実装する
　 　● Tips：VSCode のマルチカーソル機能を使う（Windowsは Alt + Shift + ドラッグ）
　 　● 厳格モードを使って記述ミスを防ぐ
　　 ● Tips： var と const と {let}（変数の宣言とスコープ）
　2) 名前を入力すると診断結果が出力される関数を書く
　　 2)-1. JSDoc 形式のコメントで、インターフェースの定義を明示しておく
　 ※ 同じ名前なら同じ診断結果にする
　　 2)-2. 文字に与えられたコードが整数であるというプログラム上の性質を利用して、入力された名前の文字コードの合計値を取得する
　　 2)-3. 文字コードの合計を診断結果のパターンの数で割った余りを求め、配列の添字とすることで診断結果を取得する
　　　　 →（入力された名前の文字コードの合計値 % 診断結果のパターンの数）= 診断結果の配列の添字
　 ※ 正規表現を使って{userName}を入力された名前に置き換える
　　 2)-4. replace 関数で置換し、/・・・/g（正規表現）で複数選択をする + {} を正しく認識させるためにエスケープシーケンス \ を使う
　3) テストを書く */

/* ★17.診断機能の組込み
1) HTML にdiv タグを書き込んでJavaScript の処理を表示できるようにする
2) HTML のUI部分のプログラムをJavaScript から呼び出すために、id名から要素を取得して変数に代入する
3) 診断ボタンが押されたときの処理を実装する
　 3)-1. 診断ボタンが押されたときに、入力された名前を表示する関数を実装する
　 3)-2. 何も入力されなかった場合の処理を実装する
　 3)-3. 診断結果を表示させる処理を実装する
　 3)-4. 診断ボタンが複数回押された場合、連続して診断結果が出ないようにする
　 3)-5. 指定した子要素の全削除 */

/* ◎18. ツイート機能の開発
0) Twitter 公式からTweet ボタンを作成するためのHTML タグを取得する（コピペ）
1) 診断ボタンが押されたときに、ツイートボタンを表示させる処理を実装する（★17. 3)-3. の処理に近い）
2) URI エンコードを使って、URI のクエリ部分の文字列を半角英数に変換する

// -------------------------------------------------------------------------------------------------------------------
// ◆1) 診断結果のパターンを作る
'use strict'; // strictモード（厳格モード）でJavaScriptを実行させるという宣言
/* ★2) 4つのUI部分（入力 2 + 出力 1 + 入出力 1）
　 　入力 2 　：名前の入力（id="user-name"）、診断ボタン（id="assessment"）
　 　出力 1　 ：診断結果の表示（id="result-area）
　 　入出力 1 ：ツイートボタンを表示 & ボタン（id="tweet-area"）*/
const userNameInput = document.getElementById('user-name'); // HTML 上のinput タグをJavaScript で操作するために変数宣言をする
const assessmentButton = document.getElementById('assessment'); // HTML 上のbutton タグをJavaScript で操作するために変数宣言をする
const resultDivided = document.getElementById('result-area'); // HTML 上のdiv タグ(id="result-area")をJavaScript で操作するために変数宣言をする
const tweetDivided = document.getElementById('tweet-area'); // HTML 上のdiv タグ(id="tweet-area")をJavaScript で操作するために変数宣言をする

// 3)-5. 診断結果の表示エリアを初期化する while 文を関数に入れる（後に作成するツイートエリアと共通化するため）
/**
 * 指定した要素の子どもを全て削除する関数 removeAllChild について
 * @param {HTMLElement} element HTMLの要素 // 「関数 removeAllChild(element) の引数はHTML の要素を表す element という HTMLの要素である」という意味
 */
function removeAllChild(element) {
    while (element.firstChild) { // resultDivided から element に変えているのは、ツイートエリアと共通化するため（引数を element にしておけば、他の変数名でも呼び出せるからかな？）
        element.removeChild(element.firstChild);
    }
}
// ★3) 診断ボタンが押されたときの処理を実装する
// 　3)-1. 診断ボタンが押されたときに、入力された名前を表示する関数を実装する
// 　（無名関数は、他にこの関数を使用する必要がないときに使用するらしい？）
assessmentButton.onclick = () => { // assessmentButton というオブジェクトの onclick プロパティにアロー関数で無名関数を代入する
    const userName = userNameInput.value; // 変数userName に入力された値（value）を代入して、入力された名前（値）を変数名（userName）で取得できるようにする
    // 3)-2. 名前が空欄のときは処理を終了する
    if (userName.length === 0) {
        return; // return; はガード句で、戻り値なしで処理を終了する
    }
    console.log(userName);
    console.log(assessment(userName));

    // 診断結果表示エリアの作成
    // 診断結果表示エリアの初期化（ 3)-5. で設定した while 文を含んだ関数を、変数名 resultDivided で呼び出して実行している）
    removeAllChild(resultDivided);
    // 3)-4. 連続して診断結果が出ないように、診断結果を表示する前に診断結果の表示を初期化する
    /* while 文は、条件式がtrue のときに {} 内の処理を実行し続けるループ処理
    　 while (条件式) {
       　 実行したい処理
    　 } */
    // (div タグに最初の子要素があったとき)、{最初の子要素を削除し続ける} 処理
    while (resultDivided.firstChild) {
        resultDivided.removeChild(resultDivided.firstChild);
    }

    // 3)-3. 診断結果を表示させる処理
    /* 名前が入力されて診断ボタンが押されたときに、HTML 上で以下の表示をさせたい
    　 <div id="result-area">
    　 　<h3>診断結果</h3>
    　 　<p>{userName}のいいところは〇〇です。・・・</p>
    　 </div> */
    /* document.write('<h3>診断結果</h3>'); だとタグの中身に変更があった場合に手間らしいので、
    　 document.createElement(); でタグの要素を作成し、innerText プロパティでタグの中身を設定する */
    // ↓「resultDivded.appendChild(document.write('<h3>診断結果</h3>'));」を分割して書いている
    const header = document.createElement('h3');
    header.innerText = '診断結果';
    resultDivided.appendChild(header); // 変数headeer をdiv タグの子要素として追加する

    // ↓「resultDivided.appendChild(document.write('<p>assessment(userName)<\p>'));」を分割して書いている
    const paragragh = document.createElement('p');
    const result = assessment(userName); // paragragh.innerText = assessment(userName); を分けて書いてある
    paragragh.innerText = result;
    resultDivided.appendChild(paragragh);

    // TODO ツイートエリアの作成
    // ★17. 練習問題
    removeAllChild(tweetDivided); // ツイートエリアの初期化処理
    // ◎1) ツイートボタンを表示させる処理
    /* 名前が入力されて診断ボタンが押されたときに、HTML 上で以下の表示をさせたい
    　 <a 
        href="https://twitter.com/intent/tweet?button_hashtag=あなたのいいところ&ref_src=twsrc%5Etfw" 
        class="twitter-hashtag-button" 
        data-text="診断結果の文章" 
        data-show-count="false">Tweet #あなたのいいところ
    　 </a>
    　 <script 
        async 
        src="https://platform.twitter.com/widgets.js" 
        charset="utf-8">
    　 </script> */
    // ↓「tweetDivided.appendChild(document.write('<a href="https://・・・"></a>'));」を分割して書いている
    // a タグ全体
    const anchor = document.createElement('a');
    /* ★17. 3)-3. でやった h3 タグや p タグと異なり、a タグの中に属性を設定したいため、setAttribute プロパティを使用する
    　 （Attribute は「属性」を意味する単語）
    　 要素名.setAttrbute('属性名', 属性値); で使用できる */
    // href 属性
    // ◎2) URI エンコードでクエリ部分の文字列を半角英数に変換する
    // （変換前）const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag=あなたのいいところ&ref_src=twsrc%5Etfw';
    const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag=' +
                    　 encodeURIComponent('あなたのいいところ') +
                    　 '&ref_src=twsrc%5Etfw';
    anchor.setAttribute('href', hrefValue); // a タグにhrefValue というhref 属性を設定している（URL が長いので二行に分割している）
    // class 属性
    anchor.className = 'twitter-hashtag-button'; // class 属性（とid 属性）は専用のプロパティが用意されているため
    /* class 属性の専用プロパティを使わずにdata-text 属性のように書くことも可
    anchor.setAttribute('class', twitter-hashtag-button'); */
    // data-text 属性
    anchor.setAttribute('data-text', result);
    // a タグの中身（今回は文字列）
    anchor.innerText ='Tweet #あなたのいいところ';

    // div タグにa タグを入れ子にする
    tweetDivided.appendChild(anchor);

    // ↓「tweetDivided.appendChild(document.write('<script async src="https://・・・"></script>'));」を分割して書いている
    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    tweetDivided.appendChild(script);

};

userNameInput.onkeydown = event => {
    if (event.key === 'Enter') {
        assessmentButton.onclick();
    }
};

const answers = [
    '{userName}のいいところは声です。{userName}の特徴的な声は皆を惹きつけ、心に残ります。',
    '{userName}のいいところはまなざしです。{userName}に見つめられた人は、気になって仕方がないでしょう。',
    '{userName}のいいところは情熱です。{userName}の情熱に周りの人は感化されます。',
    '{userName}のいいところは厳しさです。{userName}の厳しさがものごとをいつも成功に導きます。',
    '{userName}のいいところは知識です。博識な{userName}を多くの人が頼りにしています。',
    '{userName}のいいところはユニークさです。{userName}だけのその特徴が皆を楽しくさせます。',
    '{userName}のいいところは用心深さです。{userName}の洞察に、多くの人が助けられます。',
    '{userName}のいいところは見た目です。内側から溢れ出る{userName}の良さに皆が気を惹かれます。',
    '{userName}のいいところは決断力です。{userName}がする決断にいつも助けられる人がいます。',
    '{userName}のいいところは思いやりです。{userName}に気をかけてもらった多くの人が感謝しています。',
    '{userName}のいいところは感受性です。{userName}が感じたことに皆が共感し、わかりあうことができます。',
    '{userName}のいいところは節度です。強引すぎない{userName}の考えに皆が感謝しています。',
    '{userName}のいいところは好奇心です。新しいことに向かっていく{userName}の心構えが多くの人に魅力的に映ります。',
    '{userName}のいいところは気配りです。{userName}の配慮が多くの人を救っています。',
    '{userName}のいいところはその全てです。ありのままの{userName}自身がいいところなのです。',
    '{userName}のいいところは自制心です。やばいと思ったときにしっかりと衝動を抑えられる{userName}が皆から評価されています。',
    '{userName}のいいところは優しさです。{userName}の優しい雰囲気や立ち振る舞いに多くの人が癒されています。'
];
/* Tips： var と const と {let} の違い
　　 var 　→ 変数を上書きして宣言できる
　　 const → 一度しか宣言出来ない（上書き不可）
　　 let   → {}の範囲内（ブロックスコープ）でのみ有効
　 ※ 変数の有効範囲のことを『スコープ(scope)』という */


// -------------------------------------------------------------------------------------------------------------------
// ◆2) 名前を入力すると診断結果が出力される関数を書く
/*　 2)-1. JSDoc 形式のコメントで、インターフェースの定義を明示しておく
　　 （assessment(userName) という関数を説明し、関数を使用するときにヒントを与えてくれるようになる) */
/**
 * 名前の文字列を渡すと診断結果を返す関数 assessment について
 * @param {string} userName ユーザーの名前   //「関数 assessment(userName) の引数はユーザーの名前を表す userName という文字列である」という意味
 * @return {string} 診断結果 　　            //「関数 assessment(usetName) の戻り値は診断結果を表す文字列である」という意味
 */

function assessment(userName) {
    // TODO 診断処理を実装する・・・2)-2. と 2)-3.
    return '';
}

// ◆※ 同じ名前なら同じ診断結果にする
function assessment(userName) {
    // 2)-2. for文を使って入力された名前の文字コードの整数を合計する
    let sumOfCharCode = 0;
    for (let i = 0; i < userName.length; i++) {
        sumOfCharCode = sumOfCharCode + userName.charCodeAt(i);
        // 文字コードの合計 = 文字コードの整数(最初は0) + 入力された名前の文字コード(i番目の添字)
    }
    // 2)-3. 文字コードの合計を診断結果のパターンの数で割った余りを求め、配列の添字とすることで診断結果を取得する
    // index：「配列の添字」の意（ここでは診断結果である配列 answers の添字を意味する）
    const index = sumOfCharCode % answers.length; // 診断結果の添字 = 文字コードの合計 % 診断結果のパターンの数
    let result = answers[index]; // 取得した診断結果の添字から、診断結果の文字列を取得する

    // 2)-4. {userName} を入力された名前に置き換える処理を実装する
    // replace 関数：「文字列.replace(置換前の部分文字列, 置換後の部分文字列)」という形で文字列の一部を置き換えることができる
    // 正規表現「/・・・/g 」：複数選択したいときに使う機能
    // {} はそのままだと別の意味として取得されてしまうため、{ と } の前にエスケープシーケンスとしての \ を置いている
    result = result.replace(/\{userName\}/g,userName);
    return result;
}

console.log(assessment('太郎'));
console.log(assessment('次郎'));
console.log(assessment('太郎'));

// -------------------------------------------------------------------------------------------------------------------
// ◆3) テストを書く
// console.assert 関数：テストを行う機能
// console.assert(処理が正しいときに true となる式, テストの結果が正しくなかったときに出したいメッセージ);
console.assert(
    assessment('太郎') === '太郎のいいところは決断力です。次郎がする決断にいつも助けられる人がいます。',
    '診断結果の文言の特定の部分を名前に置き換える処理が正しくありません'
);
// 練習
console.assert(
    assessment('太郎') === assessment('次郎'),
    '入力が同じ名前なら、同じ診断結果を出力する処理が正しくありません'
);
