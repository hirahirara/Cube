let color =
{
    player: "#ff0000",
    background: "#eeeeee",
    screenFrame: "#ff0000",
    shadow: "#222222",
    normal: "#000000",
    normal2: "#000000",
    normal3: "#000000",
    normal4: "#000000",
    frame:  "#000000",
    ground: "#000000",

    setPlayer: function (color)
    {
        this.player = color;
    },

    setBackground: function (color)
    {
        this.background = color;
    },

    setShadow: function (color)
    {
        this.shadow = color;
    },

    setNormal: function (color)
    {
        this.normal = color;
    },

    setNormal2: function (color)
    {
        this.normal2 = color;
    },

    setNormal3: function (color)
    {
        this.normal3 = color;
    },

    setNormal4: function (color)
    {
        this.normal4 = color;
    },

    setFrame: function (color)
    {
        this.frame = color;
    }
}

const screenWidth = 2000;
const screenHeight = 2000;
const screenFrame = 10;
const scaleFirst = 2;
let scale = scaleFirst;
const transSize = 100;

const vcan = document.createElement('canvas');
const vctx = vcan.getContext('2d');

const can = document.createElement('canvas');
const ctx = can.getContext('2d');

vcan.width = screenWidth;
vcan.height = screenHeight;
can.width = 700;
can.height = 600;

can.setAttribute("style", "display:block;margin:auto;background-color: #ffffff");//eeeeee
document.body.appendChild(can);

ctx.mozimageSmoothingEnabled = false;
ctx.msimageSmoothingEnabled = false;
ctx.webkitimageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

const block_width = 10;
const block_height = 10;

////////////////////////////////////////////////

const player = 
{
    x: 8,
    y: 8,
    oldX: 0,
    oldY: 0,
    dx: 0,
    dy: 5,
    width: 8,
    height: 8,

    speed: 1,
    gravity: 5,

    onGround: true,
    jumpCounter: 0,

    nowStage: 0,

    move: function()
    {
        this.oldX = this.x;
        this.oldY = this.y;

        this.x += this.dx;
        this.y += this.dy;
    },

    draw: function ()
    {
        vctx.fillStyle = color.player;
        vctx.fillRect(this.x, this.y, this.width, this.height);
    },

    jump: function ()
    {
        if(this.jumpCounter > 0)
        {
            if(this.onGround == false)
            {
                this.dy = Math.min(0.3 * this.jumpCounter - 5, this.gravity);
                this.jumpCounter++;
            }
            else
            {
                this.jumpCounter = 0;
                this.dy = this.gravity;
            }
        }
    },

    update: function()
    {
        this.draw();
    },

    updateMove: function()
    {
        this.move();
        this.jump();

        this.onGround = false;
    }
}

const playerShadow =
{
    x: 0,
    y: 0,
    width: 7,
    height: 7,
    update: function()
    {
        vctx.fillStyle = "#000000";
        vctx.fillRect(this.x, this.y, this.width, this.height);
        this.x = player.oldX+(player.width-this.width)/2;
        this.y = player.oldY+(player.height-this.height)/2;
    },    
}

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
    start: 700,
    delta: 1,
    check: function ()
    {
        if(!this.outFrag && this.start < player.y)
        {
            scale += this.delta;
            gameSituation.goal = true;
        }
        else if(this.outFrag && scale >= scaleFirst+this.delta)
        {
            scale -= this.delta;
        }
        else
        {
            this.outFrag = false;
            gameSituation.goal = false;
        }
        if(50 <= scale && scale < 50+this.delta)
        {
            this.outFrag = true;
            if(player.nowStage < stages.length-1)
            {
                player.nowStage += 1;
                init();
//              ctx.fillStyle = color.player;
//              ctx.fillRect(can.width-player.width*scale/2, can.height-player.height*scale/2, player.width*scale, player.height*scale);
            }
            else
            {
                player.nowStage = 0;
                init();               
            }
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
    let lineWidth = 1;
    vctx.fillStyle = color.frame;
    if(del != 0)
    {
        vctx.fillRect(x, y, width, lineWidth);
    }
    if(del != 1)
    {
        vctx.fillRect(x, y, lineWidth, height);
    }
    if(del != 2)
    {
        vctx.fillRect(x, y+height-lineWidth, width, lineWidth);
    }
    if(del != 3)
    {
        vctx.fillRect(x+width-lineWidth, y, lineWidth, height);
    }
}

const gameSituation =
{
    event: false,
    openMovie: false,
    goal: false,
}

function init ()
{
    ctx.shadowColor = color.shadow;//222222
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    vctx.setTransform(1, 0, 0, 1, transSize, transSize);
    stages[player.nowStage].setting();
    stageNet.set(stages[player.nowStage].net);
}

function loop ()
{
    vctx.clearRect(-transSize, -transSize, vcan.width+transSize, vcan.height+transSize);
    ctx.fillStyle = color.screenFrame;
    ctx.fillRect(0, 0, can.width, can.height);
    ctx.fillStyle = color.background;
    ctx.fillRect(screenFrame, screenFrame, can.width-screenFrame*2, can.height-screenFrame*2);
    ctx.shadowBlur = 8;

    if(!gameSituation.event && !gameSituation.goal)
    {
        player.updateMove();
    }

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

    player.update();

//    ctx.drawImage(vcan, player.x-vcan.width/2, player.y-vcan.height/2, vcan.width, vcan.height,
//                  0, 0, can.width, can.height);
//    ctx.drawImage(vcan, 0, 0, vcan.width, vcan.height, 100, 0, can.width, can.height);
    camera.update();
    ctx.drawImage(vcan, camera.x, camera.y, camera.width, camera.height,
        screenFrame, screenFrame, can.width-screenFrame*2, can.height-screenFrame*2);
    stageNet.update();
    goal.check();
    window.requestAnimationFrame(loop);
}

init();
loop();