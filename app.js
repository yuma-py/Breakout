/*
    document.createElement(要素名)
    指定した要素名を新たに作り出す
*/
const canvas = document.createElement('canvas');//canvas要素を生み出してcanvasという名前のオブジェクトに代入する,canvasオブジェクトで使用できる関数やプロパティが使えるようになる
const ctx = canvas.getContext('2d');//2Dグラフィックを描くための関数やプロパティをもつオブジェクトを取得し、ctxという名のオブジェクトに代入する
canvas.width = 400;//canvas要素の幅のプロパティを変更
canvas.height = 400;//canvas要素の高さのプロパティを変更

/*
    element.setAttribute(属性名,属性値(プロパティ1：値;プロパティ2：値;...))
    elementの属性名を指定し、その属性値を変更する
    (display:block):displayプロパティによって要素の表示のされ方や高さや幅の設定が変わる(blockは縦に積み重なるイメージ)
    (margin:auto):余白を適切に調整してくれる
    (background-color:#ddd):背景を灰色にする
*/
canvas.setAttribute('style','display:block;margin:auto;background-color:#ddd');//canvas要素の属性（ここではstyle）を設定する

/*
    element.appendChild(Elementオブジェクト)
    elemetを親として、その中に指定したElementオブジェクトを子として加える
*/
document.body.appendChild(canvas);//body要素(親)の中にcanvas要素(子)を加える

const ball = {
    x:null,//ballのx座標
    y:null,//ballのy座標
    width:5,//ballの幅
    height:5,//ballの高さ
    speed:4,//ballの進む距離
    dx:null,//ballのx座標に加える進む距離と向き(ベクトル)
    dy:null,//ballのy座標に加える進む距離と向き(ベクトル)

    //ballの座標を更新
    update:function()
    {
        /*
            context.fillRect(x座標,y座標,幅,高さ)
            塗りつぶされた四角形を描く
        */
        ctx.fillRect(this.x,this.y,this.width,this.height);//ballの(x,y)座標(左上)から(x+width,y+height)座標(右下)の塗りつぶされた四角形を描く
        //ctx.fill();

        if(this.x < 0 || this.x > canvas.width)this.dx *=-1;//左右の壁に衝突したらballを反対の方向に変える
        if(this.y < 0 || this.y > canvas.height)this.dy *=-1;//上下の壁に衝突したらballを反対の方向に変える

        this.x += this.dx;//ballのx座標更新
        this.y += this.dy;//ballのy座標更新
    }
}
const paddle = {
    x:null,//paddleのx座標
    y:null,//paddleのy座標
    width:100,//paddleの幅
    height:15,//paddleの高さ
    speed:0,//paddleの進む距離と方向

    update:function()
    {
        ctx.fillRect(this.x,this.y,this.width,this.height);//paddleの(x,y)座標(左上)から(x+width,y+height)座標(右下)の塗りつぶされた四角形を描く
        this.x += this.speed;//paddleのx座標更新
    }
}
const block = {
    width:null,//blockの幅
    height:20,//blockの高さ
    data:[],//blockの情報(x座標,y座標)を持つ配列

    update:function()
    {
        /*
            arr.forEach(コールバック関数)
            arr:配列のこと
            配列の各要素に関数を実行する
        */
        this.data.forEach(brick=>{
            /*
                context.strokeRect(x座標,y座標,幅,高さ)
                塗りつぶされてない四角形を描く
            */
            ctx.strokeRect(brick.x,brick.y,brick.width,brick.height);//blockの(x,y)座標(左上)から(x+width,y+height)座標(右下)の塗りつぶしていない四角形を描く
        })
    }

}
//blockがあるかの情報
const level = [
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],

]

//初期化
const init = function()
{
    paddle.x = canvas.width / 2  - paddle.width / 2; //paddleを中央に配置
    paddle.y = canvas.height - paddle.height;//paddleを中央に配置

    ball.x = canvas.width / 2 ;//ballを中央に配置
    ball.y = canvas.height / 2 +50 ;//ballを中央に配置
    ball.dx = ball.speed;//ballにベクトル(速度と方向)を与える
    ball.dy = ball.speed;//ballにベクトル(速度と方向)を与える

    block.width = canvas.width / level[0].length;//blockの幅をそれぞれのパソコンサイズに合わせる
    //blockの座標や幅や高さを初期化する
    for(let i = 0; i<level.length;i++)
    {
        for(let j = 0;j<level[i].length;j++)
        {
            if(level[i][j]==1)//blockがあるならtrue
            {
                /*
                    arr.push(追加する要素)
                    arr:配列のこと
                */
                block.data.push({//配列にオブジェクトを加える
                    x:block.width * j,//x座標
                    y:block.height * i,//y座標
                    width:block.width,//幅
                    height:block.height//高さ
                })
            }
        }
    }
}

//衝突を検知(paddleとball,blockとball)
const collide = function(obj1,obj2)
{
    return obj1.x < obj2.x + obj2.width && //ballの左側がpaddleの右側より左のほうにある
           obj2.x < obj1.x + obj1.width && //paddleの左側がballの右側より左のほうにある
           obj1.y < obj2.y + obj2.height &&//ballの上側がpaddleの下側より上のほうにある
           obj2.y < obj1.y + obj1.height;//paddleの上側がballの下側より上のほうにある

}

//繰り返す
const loop = function()
{
    /*
        context.clearRect(x座標,y座標,幅,高さ)
        指定した長方形の領域を透明色で塗りつぶす(消す)
    */
    ctx.clearRect(0,0,canvas.width,canvas.height);//canvasの左上(0,0)から右下までの範囲を消す
    paddle.update();//paddleの情報を更新
    ball.update();//ballの情報を更新
    block.update();//blockの情報を更新
    if(collide(ball,paddle)){//衝突しているならtrue
        ball.dy *= -1;//ballを反対の向きに変える
        ball.y = paddle.y - ball.height;//ballのy+height座標をpaddleの上の部分にあたる位置にずらす(見栄え)
    }
    /*
        arr.forEach(コールバック関数(配列の要素を受け取る変数,要素番号))
        配列の各要素に関数を実行する
    */
    block.data.forEach((brick,index)=>{
        if(collide(ball,brick)){//ballとあるblockが衝突したらtrue
            ball.dy *= -1;//ballの向きを変える
            /*
                arr.splice(開始要素番号,消したい数)
                配列から指定した場所から指定した数削除する
            */
            block.data.splice(index,1);//開始(data[index])から1個削除する
        }

    })
    /*
        window.requestAnimationFrame(コールバック関数)
        毎秒60回画面更新を行う前に指定した関数を呼び出す
    */
    window.requestAnimationFrame(loop);//loop関数を呼び出す
}

init();//初期化
loop();//繰り返す
document.addEventListener('keydown',f1)//keyが押されたらf1の関数を実行
document.addEventListener('keyup',f2)//keyが話されたらf2の関数を実行

function f1(e)
{
    if(e.key == 'ArrowLeft')paddle.speed = -6;//左矢印ボタンが押されたらパドルの進む向きを左にかつｘ座標を6移動させる
    if(e.key == 'ArrowRight')paddle.speed = 6;//右矢印ボタンが押されたらパドルの進む向きを右にかつｘ座標を6移動させる

}

function f2(e)
{
    paddle.speed = 0;//keyが離されたらパドルを止める
}