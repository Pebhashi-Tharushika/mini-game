import {Background} from "./background.js";
import {Enemy} from "./enemy.js";

window.addEventListener('load', scrollBackground);

const PlayerDivElm = document.createElement('div');
PlayerDivElm.classList.add('player');
document.body.append(PlayerDivElm);

let audio = document.getElementById('audio');


let jump = false;
let run = false;
let attack = false;
let forward = false;
let backward = false;
let dx = 0;
let enemies = [];
let isPlayerAlive = true;
let tmrInterval = null;
let isGameOver = false;
let enemiesMoveInterval = null;
let enemiesDrawInterval = null;
let playerMoveInterval = null;
let playerDrawInterval = null;
let score = 0;


startGame();

function startGame(){
    const imgPlay = document.createElement('div');
    imgPlay.classList.add('start-image');
    document.body.append(imgPlay);
    let btnStart = document.createElement('div');
    btnStart.classList.add('btn-start');
    document.body.append(btnStart);
    btnStart.innerText= 'PLAY';
    btnStart.addEventListener('mouseenter',()=>btnStart.style.opacity='0.8')
    btnStart.addEventListener('mouseleave',()=>btnStart.style.opacity='1')
    btnStart.addEventListener('click',()=>{
        document.body.removeChild(imgPlay);
        document.body.removeChild(btnStart);
        activatePlayer();
        activateEnemies();
        audio.play();
        displayScore();
    });
}


function stopGame(){
    audio.pause();
    const imgRePlay = document.createElement('div');
    imgRePlay.classList.add('restart');
    document.body.append(imgRePlay);
    const btnRePlay = document.createElement('div');
    btnRePlay.classList.add('btn-start');
    document.body.append(btnRePlay);
    btnRePlay.innerText= 'TRY IT AGAIN';

    /*const scoreView = document.createElement('div');
    scoreView.classList.add('score-view');
    document.body.append(scoreView);
    scoreView.innerText= `Score : ${score}`;*/
    
    btnRePlay.addEventListener('mouseenter',()=>btnRePlay.style.opacity='0.8')
    btnRePlay.addEventListener('mouseleave',()=>btnRePlay.style.opacity='1')
    btnRePlay.addEventListener('click',()=>{
        location.reload();
    });
}


let angle = 0;
function doJump(){
    let y = Math.cos(angle * (Math.PI / 180));
    y *= 3;
    PlayerDivElm.style.top = (PlayerDivElm.offsetTop - y) + "px";
    angle++;
    if(angle > 180){
        jump = false;
        angle = 0;
    }

}

function doRun(){
    let x = PlayerDivElm.offsetLeft + dx;
    if((x + PlayerDivElm.offsetWidth) > innerWidth){
        x = innerWidth - PlayerDivElm.offsetWidth;
        PlayerDivElm.style.transform = `rotateY(180deg)`;
    }else if(x <= 0) {
        x = 0;
        PlayerDivElm.style.transform = `rotateY(0deg)`;
    }
    PlayerDivElm.style.left = `${x}px`;
}

let i = 0;
function drawIdle(){
    PlayerDivElm.style.backgroundImage = `url('img/player/Idle_${i++}.png')`;
    if( i === 10) i = 0;
}

let j = 0;
function drawRun(){
    PlayerDivElm.style.backgroundImage = `url('img/player/Run_${j++}.png')`;
    if(j === 10) j = 0;
}

let k = 0;
function drawJump(){
    PlayerDivElm.style.backgroundImage = `url('img/player/Jump_${k++}.png')`; 
    if(k === 10) k = 0;
}

let x = 0;
function drawAttack(){
    PlayerDivElm.style.backgroundImage = `url('img/player/Attack_${x++}.png')`;
    if(x === 10) x = 0;
}

let y = 0;
function drawJumpAttack(){
    PlayerDivElm.style.backgroundImage = `url('img/player/Jump_Attack_${y++}.png')`; 
    if(y === 10) y = 0;
}


function activatePlayer(){
    addEventListener('keydown', (eventData) => {
        if(eventData.code === 'Space'){
            jump = true;
        }else if(eventData.code === 'ArrowRight'){
            run = true;
            forward = true;
            dx = 2;
            PlayerDivElm.style.transform = `rotateY(0deg)`;
        }else if(eventData.code === 'ArrowLeft'){
            run = true;
            backward = true;
            dx = -2;
            PlayerDivElm.style.transform = `rotateY(180deg)`;
        }
    });
    
    addEventListener('keyup', (eventData) => {
        if(eventData.code === 'ArrowRight'){
            run = false;
            forward = false;
            dx = 0;
        }else if(eventData.code === 'ArrowLeft'){
            run = false;
            backward = false;
            dx = 0;
        }
    });
    
    addEventListener('mousedown',(evt) => {
        if(evt.button === 0) attack = true;
    });
    
    addEventListener('mouseup', (evt) => {
        if(evt.button === 0) attack = false;
    });

    playerMoveInterval = setInterval(() => {
        if(isGameOver){
            clearInterval(playerMoveInterval);
            playerMoveInterval = null;
        }
        if(jump){
            doJump();
        }
        if(run){
            doRun(); 
        }
    },5);

    
    playerDrawInterval = setInterval(()=> {
        if(isGameOver){
            clearInterval(playerDrawInterval);
            playerDrawInterval = null;
        }

        if(run) drawRun();
        else if(jump && !attack) drawJump();
        else if(jump && attack) drawJumpAttack();
        else if(attack) drawAttack();
        else drawIdle();
        
        detectCollision(PlayerDivElm.offsetLeft,PlayerDivElm.offsetTop);
    }, 50);

    
}

/* scroll bbackground */
function scrollBackground(){
    const canvas = this.document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    const background = new Background(innerWidth,innerHeight);

    setInterval(() =>{
        background.draw(ctx)
        if(run) {
            if(forward) background.forward();
            if(backward) background.backward();
        }
    }, 50);
}

/* detect collision */
function detectCollision(playerX, playerY){
    enemies.forEach(enemy => {
        const dx = (playerX+55) - (enemy.getEnemyX()+75);
        const dy = (playerY+55) - (enemy.getEnemyY()+75);
        const distance = Math.hypot(dx, dy);
        if(distance < 55 + 75 + 10 && enemy.isEnemyAlive && isPlayerAlive){
            if(attack) {
                enemy.isEnemyAlive = false;
                dieEnemy(enemy);
                enemies.splice(enemies.indexOf(enemy), 1);
                score += 5;
                console.log(score);
                const scoreElm = document.getElementsByClassName('score-display')[0];
                console.log(scoreElm);
                scoreElm.innerText= `Score : ${score}`;
            }else{
                isPlayerAlive = false;
                console.log("player died");
                isGameOver = true;
                stopGame();
            }
        }
    });
    
}


/* create enemies */
let maxTime = 0;
let timePerEnemy = 0;

function createEnemies(){
    if(timePerEnemy >= maxTime){
        enemies.push(new Enemy());
        timePerEnemy = 0;
        maxTime = Math.random()*1500 + 1000;
    }else{
        timePerEnemy += 20;
    }
    enemies.forEach( enemy => {
        if(enemy.readyToRemove){
            document.body.removeChild(enemy.elm);
        }
        enemy.enemyMove();
    });
    enemies = enemies.filter(enemy => !enemy.readyToRemove);
    
}

let m=1
function drawEnemyWalk(elm){
    elm.style.backgroundImage = `url('img/dino/Run (${m++}).png')`;
    if(m === 9) m = 1;
}

let n=1
function drawEnemyDie(enemy){
    enemy.elm.style.width = '220px';
    enemy.elm.style.backgroundImage = `url('img/dino/Dead (${n++}).png')`;
    if(n === 9){
        if(!enemy.isEnemyAlive){
            clearInterval(tmrInterval);
            tmrInterval = null;
            enemy.elm.style.transform = "scale(0)";
        }
        n = 1;
    }
}



function dieEnemy(enemy){
    tmrInterval = setInterval(() => {
        drawEnemyDie(enemy)
    }, 100);
}



function activateEnemies(){
    enemiesMoveInterval = setInterval(() => {
        if(isGameOver){
            clearInterval(enemiesMoveInterval);
            enemiesMoveInterval = null;
        }
        createEnemies();
    },100);


    enemiesDrawInterval = setInterval(() => {
        if(isGameOver){
            clearInterval(enemiesDrawInterval);
            enemiesDrawInterval = null;
        }
        enemies.forEach(enemy => {
            if(enemy.isEnemyAlive) drawEnemyWalk(enemy.elm);
        });
    }, 150);
}

/* Display Score */
function displayScore(){
    const scoreDivElm = document.createElement('div');
    scoreDivElm.classList.add('score-display');
    document.body.append(scoreDivElm);
    scoreDivElm.innerText= `Score : ${score}`;  
}