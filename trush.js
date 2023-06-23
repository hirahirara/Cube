const cube = 
{
    openUpFrag: false,
    nowNum: 0,
    nowTheta: 0,

    facePosi: [[],[],[],[],[],[]],
    faceRad: [0, 0, 0, 0, 0, 0],

    position:
    [   //u, l, d, r
        [1, 2, 4, 3],//0
        [0, 3, 5, 2],//1
        [0, 1, 5, 4],//2
        [0, 4, 5, 1],//3
        [0, 2, 5, 3],//4
        [1, 3, 4, 2],//5
    ],

    net: [[[]]],

    netset: function (net)
    {
        this.net = net;
    },

    openUp: function (netType)
    {
        if(this.nowNum < 0 || 5 < this.nowNum)
        {
            this.openUpFrag = false;
            return;
        }

        let netWidth = this.net[netType][0].length; //展開図の横に並ぶ面の数
        let netHeight = this.net[netType].length;   //展開図の縦に並ぶ面の数
        let length = stages[player.nowStage].map[0].length;                 //一面の縦横のブロック数(面が正方形という前提)
        let mapOpenedUp = new Array(netHeight * length);
        for(let i=0; i<netHeight * length; i++)
        {
            mapOpenedUp[i] = new Array(netWidth * length);
        }

        let queue = [];
        let serched = new Array(6);
        serched.fill(false);

        class Idx 
        {
            row;
            col;
            num;
            theta;

            constructor (row, col, num, theta)
            {
                this.row = row;
                this.col = col;
                this.num = num;
                this.theta = theta;
            }
        }
        let now = new Idx(-1, -1, this.nowNum, this.nowTheta);


        //2を探す
        for(let i=0; i<netHeight; i++)
        {
            [now.row, now.col] = [i, this.net[netType][i].indexOf(2)];
            if(now.col != -1) break;
        }

        //
        player.x += now.col * length * block_width;
        player.y += now.row * length * block_height;

        //bfs
        queue.push(now);
        serched[this.nowNum] = true;
        while(queue.length != 0)
        {
            let idx = queue.shift();
            let way = [];
            let pls = [];
            let mark;
            if(idx.theta == 0) mark = '0';
            else if(idx.theta == 1) mark = '+';
            else if(idx.theta == 2) mark = '^';
            else if(idx.theta == 3) mark = '-';

            let mapRotated = rotateMap(idx.num, mark);
            for(let k=0; k<length; k++)
            {
                for(let l=0; l<length; l++)
                {
                    mapOpenedUp[idx.row*length+k][idx.col*length+l] = mapRotated[k][l];
                }
            }

            this.facePosi[idx.num] = {x:idx.col*length*block_width, y:idx.row*length*block_height,
                                      width:length*block_height, height:length*block_height};
            this.faceRad[idx.num] = idx.theta;

            if(idx.row-1 >= 0 && this.net[netType][idx.row-1][idx.col] == 1)
            {
                way.push(0);
                pls.push({r: -1, c: 0});
            }
            if(idx.col-1 >= 0 && this.net[netType][idx.row][idx.col-1] == 1)
            {
                way.push(1);
                pls.push({r: 0, c: -1});
            }
            if(idx.row+1 < netHeight && this.net[netType][idx.row+1][idx.col] == 1)
            {
                way.push(2);
                pls.push({r: 1, c: 0});
            }
            if(idx.col+1 < netWidth && this.net[netType][idx.row][idx.col+1] == 1)
            {
                way.push(3);
                pls.push({r: 0, c: 1});
            }

            for(let i=0; i<pls.length; i++)
            {
                let dir = (way[i] - idx.theta + 4) % 4;
                let face = this.position[idx.num][dir];
                let rad = (2 + way[i] - this.position[face].indexOf(idx.num) + 4) % 4;

                if(!serched[face])
                {
                    queue.push(new Idx(idx.row+pls[i].r, idx.col+pls[i].c, face, rad));
                    serched[face] = true;
                }
            }
        }

        stageBlock.clear();
        blockSet(mapOpenedUp);        
    },

    close: function ()
    {
        if(this.nowNum < 0 || 5 < this.nowNum)
        {
            this.openUpFrag = true;
            return;
        }

        let mark;
        if(this.faceRad[this.nowNum] == 0) mark = '0';
        else if(this.faceRad[this.nowNum] == 1) mark = '+';
        else if(this.faceRad[this.nowNum] == 2) mark = '^';
        else if(this.faceRad[this.nowNum] == 3) mark = '-';

        this.nowTheta = this.faceRad[this.nowNum];

        player.x -= this.facePosi[this.nowNum].x;
        player.y -= this.facePosi[this.nowNum].y;

        stageBlock.clear();
        blockSet(rotateMap(this.nowNum, mark));
    },

    serch: function ()
    {
        let result = -1;
        for(let i=0; i<6; i++)
        {
            if(collision(player, this.facePosi[i]))
            {
                if(result == -1) result = i;
                else result -2;
            }
        }

        this.nowNum = result;
    },

    update: function ()
    {
        if(this.openUpFrag) this.serch();
    }
}