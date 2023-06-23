class Block 
{
    x;
    y;
    width = block_width;
    height = block_height;

    constructor (x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class Normal extends Block
{
    constructor (x, y)
    {
        super(x, y);
    }

    image () 
    {
        vctx.fillStyle = color.normal;
        vctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class AbNormal2 extends Block
{
    constructor (x, y)
    {
        super(x, y);
    }

    image () 
    {
        vctx.fillStyle = color.normal2;
        vctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class AbNormal3 extends Block
{
    constructor (x, y)
    {
        super(x, y);
    }

    image () 
    {
        vctx.fillStyle = color.normal3;
        vctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class AbNormal4 extends Block
{
    constructor (x, y)
    {
        super(x, y);
    }

    image () 
    {
        vctx.fillStyle = color.normal4;
        vctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Barrier extends Block
{
    constructor (x, y, w, h)
    {
        super(x, y);
        this.width = w;
        this.height = h;
    }

    image () 
    {

    }
}

class Frame extends Block
{
    del;

    constructor (x, y, w, h, del)
    {
        super(x, y);
        this.width = w;
        this.height = h;
        this.del = del;
    }
    
    image () 
    {
        if(collision(player, {x:this.x, y:this.y, width:this.width, height: this.height}))
        {
            if(this.del != -1 &&
                ((this.del == 0 && player.y < this.y + block_height*2) ||
                (this.del == 1 && player.x < this.x + block_width*2) ||
                (this.del == 2 && player.y + player.height > this.y + this.height - block_height*2) ||
                (this.del == 3 && player.x + player.width  > this.x + this.width  - block_width*2))) gameSituation.imageGoalFrame = false;
            else gameSituation.imageGoalFrame = true;
        }

        imageFrame(this.x, this.y, this.width, this.height, this.del);
    }
}