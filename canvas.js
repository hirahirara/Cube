let color =
{
    player: "#ff0000",
    background: "#eeeeee",
    screenFrame: "#ffffff",
    shadow: "#000000",
    normal: "#ffffff",
    normal2: "#000000",
    normal3: "#000000",
    normal4: "#000000",
    frame:  "#000000",
    goalFrame: "#ffffff",
    ground: "#000000",
    backCube: "#cccccc",

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

const img = document.createElement('img');
img.src = 'image.png';

const screenWidth = 2000;
const screenHeight = 2000;
const screenFrame = 10;
const scaleFirst = 2;
let scale = scaleFirst;
const transSize = 1000;

const vcan = document.createElement('canvas');
const vctx = vcan.getContext('2d');

const can = document.createElement('canvas');
const ctx = can.getContext('2d');

vcan.width = screenWidth;
vcan.height = screenHeight;
can.width = 900;
can.height = 600;

mainCan = 
{
    width: 700,
    height: 600,
}

subCan = 
{
    x: mainCan.width,
    y: 0,
    width: can.width-mainCan.width,
    height: can.height,
}

can.setAttribute("style", "display:block;margin:auto;background-color: #ffffff");//eeeeee
document.body.appendChild(can);

ctx.mozimageSmoothingEnabled = false;
ctx.msimageSmoothingEnabled = false;
ctx.webkitimageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

const block_width = 10;
const block_height = 10;