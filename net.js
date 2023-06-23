const stageNet =
{
    x: -500,
    y: 0,
    x0: 0,
    y0: 0,
    width: 10,
    height: 10,
    dist: 60,
    flamePosi: 0,
    flameSide: 60,
    length: 0,
    red: [],
    black: [],

    set: function (netData)
    {
        this.red.splice(0, this.red.length);
        this.black.splice(0, this.black.length);
        this.flamePosi = 0;
        this.length = netData.length;

        for(let i = 0; i < this.length; i++)
        {
            let divX = this.x + this.flameSide/2 - netData[i][0].length*this.width/2;
            let divY = this.y + this.flameSide/2 - netData[i].length*this.height/2
            for(let j = 0; j < netData[i].length; j++)
            {
                for(let k = 0; k < netData[i][j].length; k++)
                {
                    switch (netData[i][j][k])
                    {
                        case 1:
                            this.black.push({x: divX + k*this.width,
                                             y: divY + j*this.height + i*this.dist});
                            break;
        
                        case 2:
                            this.red.push({x: divX + k*this.width,
                                           y: divY + j*this.height + i*this.dist});
                            break;
                    
                        default:
                            break;
                    }
                }
            }
        }        
    },

    update: function()
    {
        ctx.save();
        ctx.setTransform(1,0,0,1, screenFrame+subCan.x+(subCan.width-screenFrame*2-this.flameSide)/2,
            screenFrame+subCan.y+112);

        vctx.fillStyle = color.normal;
        this.black.forEach(element =>
        {
            vctx.fillRect(element.x, element.y, this.width, this.height);    
        });
        vctx.fillStyle = color.player;
        this.red.forEach(element =>
        {
            vctx.fillRect(element.x, element.y, this.width, this.height);    
        });
        ctx.shadowBlur = 8;
        ctx.drawImage(vcan, this.x+transSize, this.y+transSize, this.flameSide, stages[player.nowStage].net.length*this.flameSide,
            0, 0, this.flameSide, stages[player.nowStage].net.length*this.flameSide);
        ctx.strokeStyle = "#666666";
        ctx.strokeRect(this.x0, this.flamePosi*this.flameSide+this.y0, this.flameSide, this.flameSide);
        ctx.restore();
    }
}