const showGoal =
{
    x:-500,
    y:-500,
    faceWidth:0,
    faceHeight: 0,
    imageX: 0,
    imageY: 510,
    imageWidth: 60,
    imageHeight: 60,
    arrowX: 10,
    arrowY: 470,
    arrowWidth: 40,
    arrowHeight: 30,
    dist: 10,
    normal:[],
    abNormal2:[],
    abNormal3:[],
    abNormal4:[],
    barrier:[],
    frame:[],

    dataPush: function(typeArray, typeClass, i, j)
    {
        typeArray.push(new typeClass(this.x + block_width * j, this.y + block_height * i));
    },

    set: function(mapData)
    {
        this.faceWidth = block_width*mapData[0].length;
        this.faceHeight = block_height*mapData.length;
        for(let i = 0; i < mapData.length; i++)
        {
            for(let j = 0; j < mapData[i].length; j++)
            {
                switch (mapData[i][j])
                {
                    case 1:
                        this.dataPush(this.normal, Normal, i, j);
                        break;
    
                    case 2:
                        this.dataPush(this.abNormal2, AbNormal2, i, j);
                        break;
                        
                    case 3:
                        this.dataPush(this.abNormal3, AbNormal3, i, j);
                        break;
    
                    case 4:
                        this.dataPush(this.abNormal4, AbNormal4, i, j);
                        break;

                    case 5:
                        this.dataPush(this.barrier, Barrier, i, j);
                        break;
                
                    default:
                        break;
                }
            }
        }

        this.frame.push(new Frame(this.x, this.y,
            this.faceWidth, this.faceHeight, 0));
    },

    updateImage: function(array)
    {
        array.forEach(element =>
            {            
                element.image();        
            });
    },

    blockUpdate: function()
    {
        this.updateImage(this.normal);
        this.updateImage(this.abNormal2);
        this.updateImage(this.abNormal3);
        this.updateImage(this.abNormal4);
        this.updateImage(this.frame);
    },

    update: function()
    {
        if(player.nowStage == stages.length-1) return 0;

        ctx.save();
        ctx.setTransform(1,0,0,1,
            subCan.x+screenFrame+(subCan.width-screenFrame*2-this.imageWidth)/2,
            subCan.y+screenFrame);
        
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(this.arrowX+this.arrowWidth/2, this.arrowY);
        ctx.lineTo(this.arrowX+this.arrowWidth, this.arrowY+15);
        ctx.lineTo(this.arrowX+this.arrowWidth-10, this.arrowY+15);
        ctx.lineTo(this.arrowX+this.arrowWidth-10, this.arrowY+this.arrowHeight);
        ctx.lineTo(this.arrowX+10, this.arrowY+this.arrowHeight);
        ctx.lineTo(this.arrowX+10, this.arrowY+15);
        ctx.lineTo(this.arrowX, this.arrowY+15);
        ctx.closePath();
        ctx.fill();
        ctx.drawImage(vcan, this.x+transSize-1, this.y+transSize-1, this.faceWidth+2, this.faceHeight+2,
            this.imageX, this.imageY, this.imageWidth, this.imageHeight);
        ctx.restore();
        ctx.shadowBlur = 0;
    },

    clear: function()
    {
        this.normal.splice(0, this.normal.length);
        this.abNormal2.splice(0, this.abNormal2.length);
        this.abNormal3.splice(0, this.abNormal3.length);
        this.abNormal4.splice(0, this.abNormal4.length);
        this.barrier.splice(0, this.barrier.length);
        this.frame.splice(0, this.frame.length);
    },

    setting: function(goalFace, goalWay)
    {
        this.clear();
        let mark;
        if(goalWay == 0) mark = '0';
        else if(goalWay == 3) mark = '+';
        else if(goalWay == 2) mark = '^';
        else if(goalWay == 1) mark = '-';
        this.set(rotateMap(goalFace, mark));
    }
}