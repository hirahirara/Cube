const collisionObject = 
{
    collisionWay: function (obj1, obj2)
    {
        let result = parseInt("10000", 2);;
        if (obj1.oldX < obj2.x + obj2.width)  result += parseInt("1", 2);
        if (obj2.x < obj1.oldX + obj1.width)  result += parseInt("10", 2);
        if (obj1.oldY < obj2.y + obj2.height) result += parseInt("100", 2);
        if (obj2.y < obj1.oldY + obj1.height) result += parseInt("1000", 2);
        
        return result;
    },

    divisionNormal: function (obj1, obj2)
    {
        let result = this.collisionWay(obj1, obj2);

        if(result.toString(2) == 11111) return 0;
        else if(result.toString(2) == 11110)
        {
            obj1.x = obj2.x + obj2.width;
        }
        else if(result.toString(2) == 11101)
        {
            obj1.x = obj2.x - obj1.width;
        }
        else if(result.toString(2) == 11011)
        {
            obj1.y = obj2.y + obj2.height;
        }
        else if(result.toString(2) == 10111)
        {
            obj1.y = obj2.y - obj1.height;
            obj1.onGround = true;
        }
    },

    divisionDiagonal: function (obj1, obj2)
    {
        let result = this.collisionWay(obj1, obj2);

        if(result.toString(2) == 1111) return 0;
        else if((result.toString(2))[4] == 0)
        {
            obj1.x = obj2.x + obj2.width;
        }
        else if((result.toString(2))[3] == 0)
        {
            obj1.x = obj2.x - obj1.width;
        }
        else if((result.toString(2))[2] == 0)
        {
            obj1.y = obj2.y + obj2.height;
        }
        else if((result.toString(2))[1] == 0)
        {
            obj1.y = obj2.y - obj1.height;
            obj1.onGround = true;
        }
    },

    divisionInside: function (inObj, outObj)
    {
        if(inObj.x < outObj.x) inObj.x = outObj.x;
        if(inObj.x+inObj.width > outObj.x+outObj.width) inObj.x = outObj.x+outObj.width-inObj.width;
        if(inObj.y < outObj.y) inObj.y = outObj.y;
        if(inObj.y+inObj.height > outObj.y+outObj.height) inObj.y = outObj.y+outObj.height-inObj.height;
    },
}

function collision (obj1, obj2)
{
    if (obj1.x < obj2.x + obj2.width &&
        obj2.x < obj1.x + obj1.width &&
        obj1.y < obj2.y + obj2.height &&
        obj2.y < obj1.y + obj1.height )
        return true;

        return false;
}

const gameEvent = 
{
    rotate: false,
}

function rotateMap (mapNumber, rad)
{
    let length = stages[player.nowStage].map[mapNumber].length;
    let mapRotated = new Array(length);
    for(let i=0; i<length; i++)
    {
        mapRotated[i] = new Array(length);
    }

    for(let i=0; i<length; i++)
    {
        for(let j=0; j<length; j++)
        {
            if(rad == '0')      mapRotated[i][j] = stages[player.nowStage].map[mapNumber][i][j];
            else if(rad == '+') mapRotated[length-1-j][i] = stages[player.nowStage].map[mapNumber][i][j]; 
            else if(rad == '-') mapRotated[j][length-1-i] = stages[player.nowStage].map[mapNumber][i][j]; 
            else if(rad == '^') mapRotated[length-1-i][length-1-j] = stages[player.nowStage].map[mapNumber][i][j];
        }
    }

    return mapRotated;
}

function rotateMapSet (mapNumber, rad)
{
    let length = stages[player.nowStage].map[mapNumber].length;
    let mapRotated = rotateMap(mapNumber, rad);

    if(rad != '^') [player.x, player.y] = [player.y, player.x];
    if(rad == '+') player.y = block_width * length - player.y - player.height;
    else if(rad == '-') player.x = block_height * length - player.x - player.width;
    else if(rad == '^')
    {
        player.x = block_width * length - player.x - player.width;
        player.y = block_height * length - player.y - player.height;
    }

    stageBlock.clear();
    stageBlock.set(mapRotated);
}

const goal =
{
    outFrag: false,
    start: 500,
    end: 900,
    delta: 1,
    check: function ()
    {
        if(this.start < player.y && !gameSituation.goal)
        {
            gameSituation.goal = true;
            camera.pluseNewY(2000);
            camera.pluseSpeed(3);
        }
        if(this.end < player.y)
        {
            if(player.nowStage < stages.length-1)
            {
                player.nowStage += 1;
                init();
            }
            else
            {
                player.nowStage = 0;
                init();               
            }
            camera.pluseY(-camera.height);
            camera.pluseSpeed(-3);
            gameSituation.goal = false;
            gameSituation.fallStart = true;
            gameSituation.fall = true;
        }
        else if(gameSituation.fallStart) gameSituation.fallStart = false;
        if(gameSituation.fall && camera.y == camera.newY)
        {
            gameSituation.fall = false;
        }
    },

    reverse: function ()
    {
        if(player.nowStage % 2 == 1)
        {
            color.setBackground("#000000");
            color.setShadow("#ffffff");
            color.setNormal("#ffffff");
            color.setNormal2("#ffffff");
            color.setNormal3("#ffffff");
            color.setNormal4("#ffffff");
            color.setFrame("#ffffff");
        }
        else
        {
            color.setBackground("#ffffff");
            color.setShadow("#000000");
            color.setNormal("#000000");
            color.setNormal2("#000000");
            color.setNormal3("#000000");
            color.setNormal4("#000000");
            color.setFrame("#000000");                
        }
    }
}

function imageFrame (x, y, width, height, del)
{
    if(del != -1)
    {
        vctx.lineWidth = 4;
        vctx.strokeStyle = color.goalFrame;
        vctx.beginPath();
        if(del == 0)
        {
            vctx.moveTo(x+2, y+block_height/2);
            vctx.lineTo(x-2+width, y+block_height/2);
        }
        else if(del == 1)
        {
            vctx.moveTo(x+block_width/2, y+2);
            vctx.lineTo(x+block_width/2, y-2+height);
        }
        else if(del == 2)
        {
            vctx.moveTo(x+2, y-block_height/2+height);
            vctx.lineTo(x-2+width, y-block_height/2+height);
        }
        else if(del == 3)
        {
            vctx.moveTo(x-block_width/2+width, y+2);
            vctx.lineTo(x-block_width/2+width, y-2+height);
        }
        vctx.closePath();
        if(gameSituation.imageGoalFrame) vctx.stroke();
    }

    vctx.lineWidth = 1;
    vctx.strokeStyle = color.frame;   
    if(del != 0)
    { 
        vctx.beginPath();
        vctx.moveTo(x, y);
        vctx.lineTo(x+width, y);
        vctx.closePath();
        vctx.stroke();
    }
    if(del != 1)
    {
        vctx.beginPath();
        vctx.moveTo(x, y);
        vctx.lineTo(x, y+height);
        vctx.closePath();
        vctx.stroke();
    }
    if(del != 2)
    {
        vctx.beginPath();
        vctx.moveTo(x, y+height);
        vctx.lineTo(x+width, y+height);
        vctx.closePath();
        vctx.stroke();
    }
    if(del != 3)
    {
        vctx.beginPath();
        vctx.moveTo(x+width, y);
        vctx.lineTo(x+width, y+height);
        vctx.closePath();
        vctx.stroke();
    }
}

const imageTutorial =
{
    y: 0,
    frame: 0,
    maxFrame: 10000,
    closeFrag: false,

    frameReset: function ()
    {
        this.frame = 0;
    },

    showOrClose: function ()
    {
        if(this.closeFrag) this.closeFrag = false;
        else this.closeFrag = true;
    },

    frameCount: function ()
    {
        if(this.frame < this.maxFrame) this.frame+=1;
    },

    init: function ()
    {
        this.closeFrag = false;
        this.frameReset();
    },

    update: function ()
    {
        if(player.nowStage > 1 || this.closeFrag || gameSituation.fall) return;
        if(gameSituation.goal) this.y -= camera.speed*((mainCan.height-screenFrame*2)/camera.height);
        else this.y = 0;
        if(player.nowStage == 0)
        {
            ctx.drawImage(img, 0, 10, Math.min(333, 5*this.frame), 63, 0, this.y+20, Math.min(333, 5*this.frame), 63);
            ctx.drawImage(img, 0, 98, Math.min(333, 5*this.frame), 63, 0, this.y+108, Math.min(333, 5*this.frame), 63);
            ctx.drawImage(img, 0, 191, Math.min(332, 5*this.frame), 54, 0, this.y+201, Math.min(332, 5*this.frame), 54);
            ctx.drawImage(img, 0, 271, Math.min(223, 5*this.frame), 58, 0, this.y+281, Math.min(223, 5*this.frame), 58);
            ctx.drawImage(img, 380, 264, Math.min(96, this.frame), 33, mainCan.width-116, this.y+20, Math.min(96, this.frame), 33);
            ctx.drawImage(img, 363, 17, Math.min(401, 5*this.frame), 183,
                mainCan.width/2-207, this.y+mainCan.height-203, Math.min(401, 5*this.frame), 183);
            this.frameCount();
        }
        else if(player.nowStage == 1)
        {
            ctx.drawImage(img, 0, 340, Math.min(551, 5*this.frame), 62, 0, this.y+20, Math.min(551, 5*this.frame), 62);
            ctx.drawImage(img, 0, 421, Math.min(331, 5*this.frame), 54, 0, this.y+101, Math.min(331, 5*this.frame), 54);
            ctx.drawImage(img, 0, 491, Math.min(615, 5*this.frame), 63, 0, this.y+171, Math.min(615, 5*this.frame), 63);
            ctx.drawImage(img, 0, 581, Math.min(611, 5*this.frame), 62, 0, this.y+261, Math.min(611, 5*this.frame), 62);
            ctx.drawImage(img, 380, 264, Math.min(96, this.frame), 33, mainCan.width-116, this.y+20, Math.min(96, this.frame), 33);
            this.frameCount();
        }
    },
}

const imageStageNum =
{
    charX: subCan.x+screenFrame
    +(subCan.width-screenFrame*2-142/2-23/2)/2,
    charY: 20,
    width: 90,
    height: 60,

    update: function()
    {
        if(player.nowStage == stages.length-1) return 0;
        ctx.shadowBlur = 8;
        ctx.drawImage(img, 380, 205, 142, 50, this.charX, this.charY, 142/2, 50/2);
        ctx.drawImage(img, 526+27*player.nowStage, 205, 23, 50, this.charX+142/2+5, this.charY, 23/2, 50/2);
    }
}

const gameSituation =
{
    event: false,
    openMovie: false,
    goal: false,
    fallStart: false,
    fall: false,
    imageGoalFrame: true,
}

function init ()
{
    ctx.shadowColor = color.shadow;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    vctx.shadowColor = color.normal;
    vctx.shadowOffsetX = 0;
    vctx.shadowOffsetY = 0;
    vctx.shadowBlur = 1;
    vctx.setTransform(1, 0, 0, 1, transSize, transSize);
    backGround.init();
    stages[player.nowStage].setting();
    stageNet.set(stages[player.nowStage].net);
    imageTutorial.init();
}

function loop ()
{
    vctx.clearRect(-transSize, -transSize, vcan.width+transSize, vcan.height+transSize);
    ctx.fillStyle = color.background;
    ctx.fillRect(screenFrame, screenFrame, can.width-screenFrame*2, can.height-screenFrame*2);
    ctx.shadowBlur = 8;

    if(!gameSituation.event)
    {
        player.updateMove();
    }

    showGoal.blockUpdate();
    stages[player.nowStage].blockUpdate();
    stages[player.nowStage].update();
    //stages[player.nowStage].blockUpdate();//こっちだとserchできない
    
    if(gameSituation.openMovie)
    {
        if(stages[player.nowStage].openUpFrag)
        {
            stages[player.nowStage].openUpAnimation();
        }
        else
        {
            stages[player.nowStage].closeAnimation();
        }
    }

    if(!gameSituation.goal)
    {
        player.update(); 
    }

    camera.update();
    backGround.update();
    imageTutorial.update();
    ctx.drawImage(vcan, camera.x, camera.y, camera.width, camera.height,
        screenFrame, screenFrame, mainCan.width-screenFrame*2, mainCan.height-screenFrame*2);
    ctx.drawImage(img, 800, 0, can.width, can.height, 0, 0, can.width, can.height);
    if(player.nowStage == stages.length-1)
    {
        ctx.shadowBlur = 0;
        ctx.fillStyle = color.screenFrame;
        ctx.fillRect(710, 10, 180, 45);
        ctx.fillRect(710, 436, 180, 154);
        ctx.shadowBlur = 8;
    }
    stageNet.update();
    showGoal.update();
    imageStageNum.update();
    goal.check();
    window.requestAnimationFrame(loop);
}

img.onload = function ()
{
    init();
    loop();
}

