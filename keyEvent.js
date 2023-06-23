/////////////////////////////////////////////////プレイヤーの操作
document.addEventListener('keydown', e => {
    if(e.key === 'a'){
        if(!gameSituation.goal)
        {
           player.dx = -player.speed; 
        }        
    }
})

document.addEventListener('keydown', e => {
    if(e.key === 'd'){
        if(!gameSituation.goal)
        {
            player.dx = player.speed;
        }
    }
})

document.addEventListener('keydown', e => {
    if(e.key === 'w')
    {
        if(player.onGround && !gameSituation.goal)
        {
            player.dy = 0;
            player.onGround = false;
            player.jumpCounter = 1;
        }
    
        //player.dy = -player.speed;
    }
})

document.addEventListener('keyup', e => {
    if(e.key === 'd'){
        player.dx = 0;
    }
})

document.addEventListener('keyup', e => {
    if(e.key === 'a'){
        player.dx = 0;
    }
})

document.addEventListener('keydown', e => 
{
    /*
    if(e.key === 'r')
    {
        if(!gameEvent.rotate)
        {
            gameEvent.rotate = true;
        }
        rotateMapSet(5, '^');
    }
    */
    if(e.key === 't')
    {
        if(!gameSituation.event && !gameSituation.goal)
        {
            if(stages[player.nowStage].openUpFrag)
            {
                stages[player.nowStage].openUpFrag = false;
            }
            else
            {
                stages[player.nowStage].openUpFrag = true;
            }
        }
    }
    else if(e.key === 'q')
    {
        if(!gameSituation.event && !gameSituation.goal)
        {
            stages[player.nowStage].nowNet++;
            stages[player.nowStage].nowNet %= stages[player.nowStage].net.length;

            stageNet.flamePosi = stages[player.nowStage].nowNet;
        }
    }
    else if(e.key === 'n')
    {
        if(player.nowStage < stages.length-1)
        {
           player.nowStage ++; 
        }
        
        init();
    }
    else if(e.key === 'p' && scale < 9)
    {
        scale += 0.5;
    }
    else if(e.key === 'o' && scale > 0.05)
    {
        scale /= 2;
    }
})

/*
document.addEventListener('keydown', e => {
    if(e.key === 's'){
        player.dy = player.speed;
    }
})

document.addEventListener('keyup', e => {
    if(e.key === 's'){
        player.dy = 0;
    }
})

document.addEventListener('keyup', e => {
    if(e.key === 'w'){
        player.dy = 0;       
    }
})
*/