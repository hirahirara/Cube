const stageNet =
{
    x0: 10,
    y0: 10,
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
            let divX = this.x0 + this.flameSide/2 - netData[i][0].length*this.width/2;
            let divY = this.y0 + this.flameSide/2 - netData[i].length*this.height/2
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
        ctx.shadowBlur = 0;
        ctx.fillStyle = color.screenFrame;
        ctx.fillRect(0, 0, (this.x0+screenFrame)*2+this.flameSide, (this.y0+screenFrame)*2+this.length*this.flameSide);

        ctx.save();
        ctx.setTransform(1,0,0,1, screenFrame, screenFrame);

        ctx.shadowBlur = 0;
        ctx.fillStyle = color.background;
        ctx.fillRect(0, 0, this.x0*2+this.flameSide, this.y0*2+this.length*this.flameSide);

        ctx.shadowBlur = 8;
        ctx.fillStyle = color.normal;
        this.black.forEach(element =>
        {
            ctx.fillRect(element.x, element.y, this.width, this.height);    
        });
        ctx.fillStyle = "#ff0000";
        this.red.forEach(element =>
        {
            ctx.fillRect(element.x, element.y, this.width, this.height);    
        });

        ctx.strokeStyle = color.normal;
        ctx.strokeRect(this.x0, this.flamePosi*this.flameSide+this.y0, this.flameSide, this.flameSide);
        ctx.restore();
    }
}