
'use strict';

const deck = [];
const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
const d1 = document.getElementById("d1");
const d2 = document.getElementById("d2");
const hit = document.getElementById("hit");
const stand = document.getElementById("stand");
const result = document.getElementById("result");
const dealerResult = document.getElementById("dealer-result");




  //マークを受け取り数字を付けて配列(deckに追加)
  const cards = mark => {
    for(let i =1; i <14; i++) {
      let card = (mark + i);
      deck.push(card);
    }
  }

  // マークを作成し関数cardsに渡す
  for(let m = 1; m < 5; m++) {
    if (m === 1) {
      // let mark = '♠️';
      cards("♠️");
    } else if (m === 2) {
      // let mark = '♣️';
      cards("♣️");
    } else if (m === 3) {
      // let mark = '❤︎';
      cards("❤︎")
    } else if (m === 4) {
      // let mark = '♦︎';
      cards("♦︎")
    } 
  }


  // 各手札を配る
  function deal(hand1, hand2) {
    //配列(deck)からランダムでカード切りとる
    const tramp1 = deck.splice(Math.floor(Math.random() * deck.length),1)[0];
    const tramp2 = deck.splice(Math.floor(Math.random() * deck.length),1)[0];


    // カードを表示
    hand1.textContent = tramp1;
    hand2.textContent = tramp2;

    // 数字のみを切り取り、文字列から数値へ変換
    let hand1Num = Number(tramp1.replace(/[^0-9^\.]/g,""));
    let hand2Num = Number(tramp2.replace(/[^0-9^\.]/g,""));


    // hand1の数字をチェック
    if(hand1Num >= 10) {
      hand1Num = 10;
    } else if (hand1Num === 1) {
      hand1Num = 11;
    } 

    // hand2の数字をチェック
    if(hand2Num >= 10) {
      hand2Num = 10;
    } else if (hand2Num === 1 && hand1Num !== 11) {
      hand2Num = 11;
    } 

    // 配列で管理
    return [hand1Num, hand2Num];

  }

  // 関数呼び出し
  deal(p1, p2);
  deal(d1,d2)

  // 配列を定数に代入
  const hands1 = deal(p1, p2)
  const hands2 = deal(d1, d2)

  //配列内の合計(手札合計)
  const sumHand = hands => {
    let sum = 0;
    for(let i = 0, len = hands.length; i < len; i++) {
      sum += hands[i];
    }
    return sum;
  };

  result.textContent = sumHand(hands1);

// カードを引く処理
function drowCard(who, hands) {

  const drow = document.createElement("div");

  // 引くカードをランダムで作成して表示させる
  drow.classList.add("card-front");
  drow.textContent = deck.splice(Math.floor(Math.random() * deck.length),1)[0];
  who.appendChild(drow);

  // 引いたカードを数値化
  let drowNum = (Number(drow.textContent.replace(/[^0-9^\.]/g,"")));

  //10以上か1かを判定
  if (drowNum >= 10) {
    drowNum = 10;
    return drowNum;
  } else if (drowNum === 1 && sumHand(hands) <= 10) {
    drowNum = 11;
    return drowNum;
  }
  return drowNum;
};

// ヒットボタンを押した時
hit.addEventListener("click", () => {

  const player = document.getElementById('player');

  hands1.push(drowCard(player, hands1));
  result.textContent = sumHand(hands1);

  // 21以上かを判定
  isBurst(hands1, result, "プレイヤー");

});

  // 21以上かを判定
  function isBurst(hands, res, who) {
    if (sumHand(hands) > 21) {
      if (hands[0] === 11) {
        hands[0] = 1;
        res.textContent = sumHand(hands);
      } else if (hands[1] === 11) {
        hands[1] = 1;
        res.textContent = sumHand(hands);
      } else {
        res.textContent = `${sumHand(hands)}  : burst! ${who}の負けです`
        d1.className = "card-front"
        dealerResult.textContent = sumHand(hands2);
        NoneBtn()
      }
    }
  }

  function NoneBtn() {
    hit.style.display = "none";
    stand.style.display = "none";
  };

  //スタンドボタンを押した時
  stand.addEventListener("click", () => {
    d1.className = "card-front"
    dealerResult.textContent = sumHand(hands2);


    const dealer = document.getElementById('dealer');

    //手札合計が17以上になるまでカードを引く
    while(sumHand(hands2) <= 16) {
      hands2.push(drowCard(dealer, hands2));
      dealerResult.textContent = sumHand(hands2);
    }

    // 手札が21以上かを判定
    isBurst(hands2, dealerResult, "ディーラー");

    // 勝敗判定
    if (sumHand(hands2) <= 21) {
      if (sumHand(hands1) > sumHand(hands2)) {
        result.textContent = `${sumHand(hands1)} : プレイヤーWIN!!`
        dealerResult.textContent = `${sumHand(hands2)} : ディーラーLOSE...`
        NoneBtn()
      } else if (sumHand(hands2) > sumHand(hands1)) {
        result.textContent = `${sumHand(hands1)} : プレイヤーLOSE...`
        dealerResult.textContent = `${sumHand(hands2)} : ディーラーWIN!!`
        NoneBtn()
      } else {
        result.textContent = `${sumHand(hands1)} : DRAW..`
        dealerResult.textContent = `${sumHand(hands2)} : DRAW..`
        NoneBtn()
      }
    } else {
      result.textContent = `${sumHand(hands1)} : プレイヤーWIN!!`
      NoneBtn()
    };

  });