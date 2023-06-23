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