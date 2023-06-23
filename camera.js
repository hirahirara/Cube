const camera =
{
    x: -100,
    y: -100,
    newX: -100,
    newY: -100,
    width: 700,
    height: 600,
    speed: 2,
    upper: 0,
    lower: 500,
    leftLimit: 0,
    rightLimit: 500,

    init: function ()
    {
        this.x = 0;
        this.y = 0;
    },

    pluseX: function (value)
    {
        this.x += value;
    },

    pluseY: function (value)
    {
        this.y += value;
    },

    pluseNewX: function (value)
    {
        this.newX += value;
    },

    pluseNewY: function (value)
    {
        this.newY += value;
    },

    changeLower: function (value)
    {
        this.lower = value;
    },

    changeRightLimit: function (value)
    {
        this.rightLimit = value;
    },

    centerPlace: function ()
    {
        this.x = -(this.width-this.rightLimit+this.leftLimit)/2+transSize;
        this.y = -(this.height-this.lower+this.upper)/2+transSize;
    },

    centerNewPlace: function ()
    {
        this.newX = -(this.width-this.rightLimit+this.leftLimit)/2+transSize;
        this.newY = -(this.height-this.lower+this.upper)/2+transSize;        
    },

    allCamera: function ()
    {
        this.width = this.rightLimit-this.leftLimit+20;
        this.height = this.lower-this.upper+20;
        if(this.width*can.height < this.height*can.width)
        {
            this.width = this.height*can.width/can.height;
        }
        else if(this.width*can.height > this.height*can.width)
        {
            this.height = this.width*can.height/can.width;
        }
    },

    plCamera: function ()
    {
        this.width = (can.width-screenFrame*2)/scale;
        this.height = (can.height-screenFrame*2)/scale;
        this.x = player.x+player.width/2;
        this.x = Math.max(this.leftLimit + this.width/2, this.x);
        this.x = Math.min(this.rightLimit - this.width/2, this.x);
        this.x += -this.width/2+transSize;
        this.y = player.y+player.height/2;
        this.y = Math.max(this.upper + this.height/2, this.y);
        this.y = Math.min(this.lower - this.height/2, this.y);
        this.y += -this.height/2+transSize;        
    },

    open: function (lineLength, frac, way)
    {
        if(way==0) this.pluseY(-lineLength/frac);
        else if(way==1) this.pluseX(-lineLength/frac);
        else if(way==2) this.pluseY(lineLength/frac);
        else if(way==3) this.pluseX(lineLength/frac);
    },

    moveToNewPlace: function ()
    {
        if(Math.abs(this.x-this.newX) < this.speed) this.x = this.newX;
        else this.x += (this.x < this.newX ? 1 : -1) * this.speed;
        if(Math.abs(this.y-this.newY) < this.speed) this.y = this.newY;
        else this.y += (this.y < this.newY ? 1 : -1) * this.speed;
    },

    update: function ()
    {
        this.moveToNewPlace();
    }
}