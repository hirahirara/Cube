const backGround =
{
    cubes: [],
    cubeNum: 20,
    xLim: [-100, 1000], //[a, b]の範囲の乱数
    yLim: [0, 600],
    wLim: [40, 60],
    hLim: [40, 60],
    speedLim: [1, 3],

    rand: function(lim)
    {
        return Math.floor((Math.random()*100000)%(lim[1]-lim[0]+1))+lim[0];
    },

    init: function()
    {
        this.cubes.splice(0, this.cubes.length);
        for(let i=0; i<this.cubeNum; i++)
        {
            this.cubes.push({x:this.rand(this.xLim), y:this.rand(this.yLim),
                width:this.rand(this.wLim), height:this.rand(this.hLim), speed:this.rand(this.speedLim)});
        }
    },

    update: function()
    {
        this.cubes.forEach(cube =>
        {
            if(gameSituation.goal || gameSituation.fall) cube.y -= camera.speed*((mainCan.height-screenFrame*2)/camera.height);
            if(gameSituation.fallStart) cube.y += camera.height;
            ctx.shadowBlur = 8;
            ctx.strokeStyle = color.backCube;
            ctx.strokeRect(cube.x, cube.y, cube.width, cube.height);
            cube.x += cube.speed/2;
            if(cube.x > this.xLim[1]) cube.x = cube.x % this.xLim[1] + this.xLim[0];
        });
    },
}