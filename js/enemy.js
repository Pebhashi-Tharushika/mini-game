class Enemy{
    elm;
    constructor(){
        const enemyDivElm = document.createElement('div');
        enemyDivElm.classList.add('enemy');
        document.body.append(enemyDivElm);
        this.elm = enemyDivElm;
        this.enemySpeed = 5;
        this.enemyX = innerWidth;
        this.readyToRemove = false;
        this.isEnemyAlive = true;
    }

    enemyMove(){
        this.elm.style.left = `${this.enemyX}px`;
        this.enemyX -= this.enemySpeed;
        if(this.enemyX < -this.elm.offsetWidth) this.readyToRemove = true;
    }

    getEnemyX(){
        return this.elm.offsetLeft;
    }

    getEnemyY(){
        return this.elm.offsetTop;
    }

    
}

export {Enemy}