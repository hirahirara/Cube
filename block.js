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
        //vctx.fillStyle = "#00ffff";
        //vctx.fillRect(this.x, this.y, this.width, this.height);
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
        imageFrame(this.x, this.y, this.width, this.height, this.del);
    }
}