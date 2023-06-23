class stageBlock
{
    normal = [];
    abNormal2 = [];
    abNormal3 = [];
    abNormal4 = [];
    barrier = [];
    frame = [];

    dataPush (typeArray, typeClass, i, j)
    {
        typeArray.push(new typeClass(block_width * j, block_height * i));
    }

    set (mapData)
    {
        vctx.clearRect(-10, -10, vcan.width, vcan.height);

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

        camera.pluseX(player.x-player.oldX);
        camera.pluseY(player.y-player.oldY);
        camera.centerNewPlace();
        camera.pluseNewX(-(camera.rightLimit-camera.leftLimit-mapData[0].length*block_width)/2);
        camera.pluseNewY(-(camera.rightLimit-camera.leftLimit-mapData.length*block_height)/2);
    }

    updateImage (array)
    {
        array.forEach(element =>
            {            
                if(!gameSituation.openMovie) element.image();        
            });
    }

    updateSub1 (array)
    {
        array.forEach(element =>
        {            
            if(collision(player, element))
            collisionObject.divisionNormal(player, element);       
        });
    }

    updateSub2 (array)
    {
        array.forEach(element =>
        {
            if(collision(player, element))
            collisionObject.divisionDiagonal(player, element);       
        });
    }

    blockUpdate ()
    {
        this.updateImage(this.frame);
        this.updateImage(this.normal);
        this.updateImage(this.abNormal2);
        this.updateImage(this.abNormal3);
        this.updateImage(this.abNormal4);

        this.updateSub1(this.normal);
        this.updateSub1(this.abNormal2);
        this.updateSub1(this.abNormal3);
        this.updateSub1(this.abNormal4);
        this.updateSub1(this.barrier);

        this.updateSub2(this.normal);
        this.updateSub2(this.abNormal2);
        this.updateSub2(this.abNormal3);
        this.updateSub2(this.abNormal4);
        this.updateSub2(this.barrier);
    }

    clear ()
    {
        this.normal.splice(0, this.normal.length);
        this.abNormal2.splice(0, this.abNormal2.length);
        this.abNormal3.splice(0, this.abNormal3.length);
        this.abNormal4.splice(0, this.abNormal4.length);
        this.barrier.splice(0, this.barrier.length);
        this.frame.splice(0, this.frame.length);
    }
}

class stage extends stageBlock
{
    map = [[[]]];
    net = [[[]]];

    openUpFrag = false;
    openUpFragOld = false;
    nowNum = 0;
    nowTheta = 0;
    nowNet = 0;

    goalWay = 1;
    goalFace = 1;

    plX = 1;
    plY = 1;

    animationFrame = 0;
    openFrame = 20;
    viewpoint = 100;

    facePosi =  [[],[],[],[],[],[]];
    faceRad =   [0, 0, 0, 0, 0, 0];
    faceDis =   [0, 0, 0, 0, 0, 0];
    faceWay =   [0, 0, 0, 0, 0, 0];
    faceGraph = [[],[],[],[],[],[]];

    position =
    [   //u, l, d, r
        [1, 2, 4, 3],//0
        [0, 3, 5, 2],//1
        [0, 1, 5, 4],//2
        [0, 4, 5, 1],//3
        [0, 2, 5, 3],//4
        [1, 3, 4, 2],//5
    ];

    setting ()
    {
        player.x = this.plX * block_width;
        player.y = (this.plY+1) * block_height-player.height;
        player.oldX = player.x;
        player.oldY = player.y;
        this.set(this.map[0]);
        camera.changeRightLimit(this.map[0].length*block_width*5+20);
        camera.changeLower(this.map[0].length*block_height*5+20);
        camera.allCamera();
        camera.centerPlace();
        camera.pluseX(-this.map[0].length*block_width*2);
        camera.pluseY(-this.map[0].length*block_height*2);
        camera.centerNewPlace();
        camera.pluseNewX(-this.map[0].length*block_width*2);
        camera.pluseNewY(-this.map[0].length*block_height*2);

        this.facePosi[this.nowNum] = {x:0, y:0,
            width:block_width*this.map[this.nowNum].length,
            height:block_height*this.map[this.nowNum].length};
        this.barrier.push(new Barrier(0,
            block_height*(-1),
            block_width*this.map[0].length,
            block_height));
        this.barrier.push(new Barrier(block_width*(-1),
            0,
            block_width,
            block_height*this.map[0].length));
        this.barrier.push(new Barrier(0,
            block_height*(this.map[0].length),
            block_width*this.map[0].length,
            block_height));
        this.barrier.push(new Barrier(block_height*(this.map[0].length),
            0,
            block_width,
            block_height*this.map[0].length));
        
        this.frame.push(new Frame(0, 0, block_width*this.map[0].length,
            block_height*this.map[0].length, this.goalFace==0 ? this.goalWay : -1));
    }

    openUp ()
    {
        if(this.nowNum < 0 || 5 < this.nowNum)
        {
            this.openUpFrag = false;
            return;
        }

        let netWidth = this.net[this.nowNet][0].length; //展開図の横に並ぶ面の数
        let netHeight = this.net[this.nowNet].length;   //展開図の縦に並ぶ面の数
        let length = this.map[0].length;                 //一面の縦横のブロック数(面が正方形という前提)
        let mapOpenedUp = new Array(netHeight * length);
        for(let i=0; i<mapOpenedUp.length; i++)
        {
            mapOpenedUp[i] = new Array(netWidth * length);
            mapOpenedUp[i].fill(0);
        }

        let queue = [];
        let serched = new Array(6);
        serched.fill(false);

        let now = {row:-1, col:-1, num:this.nowNum, theta:this.nowTheta};

        for(let i=0; i<6; i++) this.faceDis[i] = 0;

        //2を探す
        for(let i=0; i<netHeight; i++)
        {
            now.row = i;
            now.col = this.net[this.nowNet][i].indexOf(2);
            if(now.col != -1) break;
        }

        //
        player.x += (now.col * length) * block_width;
        player.y += (now.row * length) * block_height;

        //
        this.clear();

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
            for(let i=0; i<length; i++)
            {
                for(let j=0; j<length; j++)
                {
                    mapOpenedUp[idx.row*length+i][idx.col*length+j] = mapRotated[i][j];
                }
            }

            this.facePosi[idx.num] = {x:idx.col*length*block_width, y:idx.row*length*block_height,
                                      width:length*block_width, height:length*block_height};
            this.faceRad[idx.num] = idx.theta;

            if(idx.row-1 >= 0 && this.net[this.nowNet][idx.row-1][idx.col] != 0)
            {
                way.push(0);//up
                pls.push({r: -1, c: 0});
            }
            else if(idx.num != this.goalFace || (this.goalWay+idx.theta)%4 != 0)
            {
                //for(let i=0; i<length; i++) mapOpenedUp[idx.row*length][idx.col*length+i+1] = 5;
                this.barrier.push(new Barrier(block_width*idx.col*length,
                                              block_height*(idx.row*length),
                                              block_width*length,
                                              0));
            }
            if(idx.col-1 >= 0 && this.net[this.nowNet][idx.row][idx.col-1] != 0)
            {
                way.push(1);//left
                pls.push({r: 0, c: -1});
            }
            else if(idx.num != this.goalFace || (this.goalWay+idx.theta)%4 != 1)
            {
                //for(let i=0; i<length; i++) mapOpenedUp[idx.row*length+i+1][idx.col*length] = 5;
                this.barrier.push(new Barrier(block_width*(idx.col*length),
                                              block_height*idx.row*length,
                                              0,
                                              block_height*length));
            }
            if(idx.row+1 < netHeight && this.net[this.nowNet][idx.row+1][idx.col] != 0)
            {
                way.push(2);//down
                pls.push({r: 1, c: 0});
            }
            else if(idx.num != this.goalFace || (this.goalWay+idx.theta)%4 != 2)
            {
                //for(let i=0; i<length; i++) mapOpenedUp[(idx.row+1)*length+1][idx.col*length+i+1] = 5;
                this.barrier.push(new Barrier(block_width*idx.col*length,
                                              block_height*((idx.row+1)*length),
                                              block_width*length,
                                              0));
            }
            if(idx.col+1 < netWidth && this.net[this.nowNet][idx.row][idx.col+1] != 0)
            {
                way.push(3);//right
                pls.push({r: 0, c: 1});
            }
            else if(idx.num != this.goalFace || (this.goalWay+idx.theta)%4 != 3)
            {
                //for(let i=0; i<length; i++) mapOpenedUp[idx.row*length+i+1][(idx.col+1)*length+1] = 5;
                this.barrier.push(new Barrier(block_height*((idx.col+1)*length),
                                              block_height*idx.row*length,
                                              0,
                                              block_height*length));
            }

            for(let i=0; i<pls.length; i++)
            {
                let dir = (way[i] - idx.theta + 4) % 4;
                let face = this.position[idx.num][dir];
                let rad = (2 + way[i] - this.position[face].indexOf(idx.num) + 4) % 4;
                this.faceGraph[idx.num].push(face); 

                if(!serched[face])
                {
                    queue.push({row:idx.row+pls[i].r, col:idx.col+pls[i].c, num:face, theta:rad});
                    serched[face] = true;
                    this.faceDis[face] = this.faceDis[idx.num]+1;

                    this.faceWay[face] = way[i];
                }
            }
        }

        this.set(mapOpenedUp);
        
        this.facePosi.forEach((element, idx) =>
            {
                let del = -1;
                if(idx == this.goalFace) del = (this.goalWay + this.faceRad[idx])%4;
                this.frame.push(new Frame(element.x, element.y, element.width, element.height, del));            
            })
    }

    close ()
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
        this.faceGraph = [[],[],[],[],[],[]];

        player.x -= this.facePosi[this.nowNum].x;
        player.y -= this.facePosi[this.nowNum].y;

        this.clear();

        let length = this.map[this.nowNum].length;
        if(this.nowNum != this.goalFace || (this.goalWay+this.faceRad[this.nowNum])%4 != 0)
        {
            this.barrier.push(new Barrier(0,
                                          0,
                                          block_width*length,
                                          0));
        }
        if(this.nowNum != this.goalFace || (this.goalWay+this.faceRad[this.nowNum])%4 != 1)
        {
            this.barrier.push(new Barrier(0,
                                          0,
                                          0,
                                          block_height*length));
        }
        if(this.nowNum != this.goalFace || (this.goalWay+this.faceRad[this.nowNum])%4 != 2)
        {
            this.barrier.push(new Barrier(0,
                                          block_height*length,
                                          block_width*length,
                                          0));
        }
        if(this.nowNum != this.goalFace || (this.goalWay+this.faceRad[this.nowNum])%4 != 3)
        {
            this.barrier.push(new Barrier(block_height*length,
                                          0,
                                          0,
                                          block_height*length));
        }

        this.set(rotateMap(this.nowNum, mark));
        player.oldX = player.x;
        player.oldY = player.y;

        this.facePosi = [[],[],[],[],[],[]];
        this.facePosi[this.nowNum] = {x:0, y:0,
            width:block_width*this.map[this.nowNum].length,
            height:block_height*this.map[this.nowNum].length};
        
        this.facePosi.forEach((element, idx) =>
            {
                let del = -1;
                if(idx == this.goalFace) del = (this.goalWay + this.faceRad[idx])%4;
                this.frame.push(new Frame(element.x, element.y, element.width, element.height, del));            
            })        
    }

    serch ()
    {
        let result = -1;
        for(let i=0; i<6; i++)
        {
            if(collision(player, this.facePosi[i]))
            {
                if(result == -1) result = i;
                else result = -2;
            }
        }
        this.nowNum = result;
    }

    convertUpDown (i, j, length, rad)
    {
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let line_mx = length * block_width;
        let line_h = i * block_height;
        let line_w = this.viewpoint * line_mx / (this.viewpoint + line_h * cos);
        return {x:line_w*(j/length-1/2)+line_mx/2,
                y:Math.max(0, line_w*(line_h*sin/line_mx+1/2)-line_mx/2)};
    }

    convertSide (i, j, length, rad)
    {
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let line_mx = length * block_height;
        let line_w = j * block_width;
        let line_h = this.viewpoint * line_mx / (this.viewpoint + line_w * cos);
        return {y:line_h*(i/length-1/2)+line_mx/2,
                x:Math.max(0, line_h*(line_w*sin/line_mx+1/2)-line_mx/2)};
    }

    setStyle (type)
    {
        switch (type)
        {
            case 1:
                vctx.fillStyle = color.normal;
            break;
            case 2:
                vctx.fillStyle = color.normal2;
            break;
            case 3:
                vctx.fillStyle = color.normal3;
            break;
            case 4:
                vctx.fillStyle = color.normal4;
            break;        
            default:
                return 0;
        }
    }

    drawOpen (i, j, length, rad, way, scaleY, scaleX)
    {
        let points = [0, 0, 0, 0];
        if(way == 0 || way == 2)
        {
            if(way == 0)
            {
                i = length - i;
                scaleY *= -1;
            }

            points[0] = this.convertUpDown(i, j, length, rad);
            points[1] = this.convertUpDown(i+scaleY, j, length, rad);
            points[2] = this.convertUpDown(i+scaleY, j+scaleX, length, rad);
            points[3] = this.convertUpDown(i, j+scaleX, length, rad);
            
            if(way == 0)
            {
                points.forEach(point=>{point.y = length*block_height - point.y;});
                [points[0], points[1]] = [points[1], points[0]];
                [points[2], points[3]] = [points[3], points[2]];
            }
        }
        else if(way == 1 || way == 3)
        {
            if(way == 1)
            {
                j = length - j;
                scaleX *= -1
            }

            points[0] = this.convertSide(i, j, length, rad);
            points[1] = this.convertSide(i+scaleY, j, length, rad);
            points[2] = this.convertSide(i+scaleY, j+scaleX, length, rad);
            points[3] = this.convertSide(i, j+scaleX, length, rad);
            
            if(way == 1)
            {
                points.forEach(point=>{point.x = length*block_width - point.x;});
                [points[0], points[3]] = [points[3], points[0]];
                [points[2], points[1]] = [points[1], points[2]];
            }
        }

        return points;
    }

    drawOpenFace(x0, y0, points)
    {
        vctx.beginPath();
        vctx.moveTo(x0+points[0].x, y0+points[0].y);
        for(let k=1; k<4; k++) vctx.lineTo(x0+points[k].x, y0+points[k].y);
        vctx.closePath();
        vctx.fill();       
    }

    drawOpenFrame(x0, y0, length, rad, idx)
    {
        const lineWidth = 1;
        let del = (this.goalWay + this.faceRad[idx])%4;
        vctx.fillStyle = color.frame;
        if(idx!=this.goalFace || del!=0)
        {
            let points = this.drawOpen(0, 0, length, rad, this.faceWay[idx], lineWidth/block_height, length);
            vctx.beginPath();
            vctx.moveTo(x0+points[0].x, y0+points[0].y);
            for(let k=1; k<4; k++) vctx.lineTo(x0+points[k].x, y0+points[k].y);
            vctx.closePath();
            vctx.fill();
        }
        if(idx!=this.goalFace || del!=1)
        {
            let points = this.drawOpen(0, 0, length, rad, this.faceWay[idx], length, lineWidth/block_width);
            vctx.beginPath();
            vctx.moveTo(x0+points[0].x, y0+points[0].y);
            for(let k=1; k<4; k++) vctx.lineTo(x0+points[k].x, y0+points[k].y);
            vctx.closePath();
            vctx.fill();
        }
        if(idx!=this.goalFace || del!=2)
        {
            let points = this.drawOpen(length-lineWidth/block_height, 0, length, rad, this.faceWay[idx], lineWidth/block_height, length);
            vctx.beginPath();
            vctx.moveTo(x0+points[0].x, y0+points[0].y);
            for(let k=1; k<4; k++) vctx.lineTo(x0+points[k].x, y0+points[k].y);
            vctx.closePath();
            vctx.fill();
        }
        if(idx!=this.goalFace || del!=3)
        {
            let points = this.drawOpen(0, length-lineWidth/block_height, length, rad, this.faceWay[idx], length, lineWidth/block_width);
            vctx.beginPath();
            vctx.moveTo(x0+points[0].x, y0+points[0].y);
            for(let k=1; k<4; k++) vctx.lineTo(x0+points[k].x, y0+points[k].y);
            vctx.closePath();
            vctx.fill();
        }
    }

    animationSub (sign, imgDis, rad)
    {
        let mxDis = 0;
        this.faceDis.forEach(element =>{mxDis = Math.max(element, mxDis)})

        for(let i=0; i<6; i++)
        {
            if(sign * this.faceDis[i] > imgDis) continue;

            let mark;
            if(this.faceRad[i] == 0) mark = '0';
            else if(this.faceRad[i] == 1) mark = '+';
            else if(this.faceRad[i] == 2) mark = '^';
            else if(this.faceRad[i] == 3) mark = '-';

            let mapRotated = rotateMap(i, mark);

            if(sign * this.faceDis[i] == imgDis)
            { 
                this.drawOpenFrame(this.facePosi[i].x, this.facePosi[i].y,
                    mapRotated.length, rad, i);                                 
            }
            else if(sign * this.faceDis[i] < imgDis)
            {
                this.drawOpenFrame(this.facePosi[i].x, this.facePosi[i].y,
                    mapRotated.length, Math.PI/2, i);                      
            }

            for(let j = 0; j < mapRotated.length; j++)
            {
                for(let k = 0; k < mapRotated[j].length; k++)
                {
                    this.setStyle(mapRotated[j][k]);
                    if(sign * this.faceDis[i] == imgDis && mapRotated[j][k] != 0)
                    {
                        this.drawOpenFace(this.facePosi[i].x, this.facePosi[i].y,
                            this.drawOpen(j, k, mapRotated[j].length,
                            rad, this.faceWay[i], 1, 1))
                    }
                    else if(sign * this.faceDis[i] < imgDis && mapRotated[j][k] != 0)
                    {
                        vctx.fillRect(this.facePosi[i].x+k*block_width,
                        this.facePosi[i].y+j*block_height,
                        block_width, block_height);                        
                    }
                }
            }
        }
        this.animationFrame++;
        
        if(this.animationFrame == mxDis * this.openFrame)
        {
            if(this.openUpFrag) gameSituation.event = false;
            gameSituation.openMovie = false;
            this.animationFrame = 0;
            return 1;
        }
        return 0;
    }

    openUpAnimation ()
    {
        this.animationSub(1, Math.trunc(this.animationFrame/this.openFrame)+1,
        Math.PI/2*(this.animationFrame%this.openFrame)/this.openFrame);
    }

    closeAnimationSub ()
    {
        let newWay = 0;
        let queue = [];
        let serched = new Array(6);
        serched.fill(false);

        //bfs
        newWay = this.faceWay[this.nowNum];
        queue.push(this.nowNum);
        serched[this.nowNum] = true;
        while(queue.length != 0)
        {
            let now = queue.shift();
            let newDis = 0;
            this.faceGraph[now].forEach(next => 
            {
                if(serched[next])
                {
                    newDis = this.faceDis[next] + 1;
                }
                else
                {
                    if(this.faceDis[now] > this.faceDis[next])//根に向かう
                    {
                        [this.faceWay[next], newWay] = [(newWay + 2) % 4, this.faceWay[next]];
                    }

                    queue.push(next);
                    serched[next] = true;
                }
            })
            this.faceDis[now] = newDis;
        }
    }

    closeAnimation ()
    {
        let mxDis = 0;
        this.faceDis.forEach(element =>{mxDis = Math.max(element, mxDis)})
        let result = this.animationSub(1, -Math.trunc(this.animationFrame/this.openFrame)+mxDis,
                        Math.PI/2 - Math.PI/2*(this.animationFrame%this.openFrame)/this.openFrame);
        
        if(result == 1)
        {
            this.close();
            this.blockUpdate();//これがないと一瞬消える
            this.openUpFrag = true;
        }
    }

    update ()
    {
        this.serch();
        if(this.openUpFrag)
        {
            if(!this.openUpFragOld)
            {
                if(this.nowNum < 0)
                {
                    this.openUpFrag = this.openUpFragOld;
                }
                else
                {
                    this.openUpFragOld = true;
                    this.openUp();
                    gameSituation.event = true;
                    gameSituation.openMovie = true;
                    vctx.clearRect(0, 0, vcan.width, vcan.height);
                }
            }
        }
        else
        {
            if(this.openUpFragOld)
            {
                if(this.nowNum < 0)
                {
                    this.openUpFrag = this.openUpFragOld;
                }
                else
                {
                    this.openUpFragOld = false;
                    this.closeAnimationSub();
                    gameSituation.event = true;
                    gameSituation.openMovie = true;
                    vctx.clearRect(0, 0, vcan.width, vcan.height);
                }
            }
        }
    }
}

let stages = [];

//0
stages.push(new stage());
stages[stages.length-1].goalFace = 4;
stages[stages.length-1].goalWay = 3;
stages[stages.length-1].plX = 1;
stages[stages.length-1].plY = 7;
stages[stages.length-1].map =
[
    [//0
        [1, 1, 1, 1, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 4, 1, 1, 1, 4, 1, 1],
    ],
    [//1
        [0, 0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [4, 0, 0, 0, 0, 0, 1, 0, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 2, 1, 1, 1, 2, 1, 1],
    ],
    [//2
        [1, 1, 2, 1, 1, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 1, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 1, 1, 1, 1, 1, 1],
    ],
    [//3
        [1, 1, 3, 1, 1, 1, 3, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 1, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 1, 0, 0, 0, 1, 0, 4],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 0, 0, 1],
    ],
    [//4
        [1, 1, 4, 1, 1, 1, 4, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 3, 1, 1, 1, 3, 1, 1],
    ],
    [//5
        [1, 1, 2, 1, 1, 1, 2, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 3, 1, 1, 1, 3, 1, 1],
    ],
];

stages[stages.length-1].net = 
[
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 2],
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
        [0, 2, 1],
    ],
];

//1
stages.push(new stage());
stages[stages.length-1].goalFace = 0;
stages[stages.length-1].goalWay = 1;
stages[stages.length-1].plX = 1;
stages[stages.length-1].plY = 7;
stages[stages.length-1].map =
[
    [//0
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 1],
    [0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 1],
    ],
    [//1
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 1, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 1, 1],
    ],
    [//2
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0],
    [1, 0, 1, 1, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1],
    ],
    [//3
    [1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 1, 0, 0, 0, 1, 0, 1],
    [0, 0, 0, 1, 0, 1, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 1, 0, 1],
    [0, 0, 0, 1, 1, 0, 0, 0, 1],
    ],
    [//4
    [1, 1, 1, 1, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1],
    [0, 0, 1, 1, 0, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0, 1, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 1],
    ],
    [//5
    [1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1],
    ],
];

stages[stages.length-1].net = 
[
    [
        [0, 2],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, 0],
    ],
    [
        [0, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [2, 0],
    ],
    [
        [0, 0, 1],
        [2, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [1, 2, 1],
    ]
];

//2
stages.push(new stage());
stages[stages.length-1].map =
[
    [//0
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 1],
        [0, 1, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 1, 0],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
    ],
    [//1
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [4, 0, 1, 0, 0, 0, 0, 0, 3],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 1, 0, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 2, 0, 0, 0, 2, 1, 1],
    ],
    [//2
        [1, 1, 2, 0, 0, 0, 2, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [3, 0, 1, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 4, 0, 0, 0, 4, 1, 1],
    ],
    [//3
        [1, 1, 3, 0, 0, 0, 3, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 1, 0, 0, 0, 1, 0, 4],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 1, 0, 0, 0, 1, 0, 4],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
    ],
    [//4
        [1, 1, 4, 0, 0, 0, 4, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0, 1, 0, 2],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 3, 0, 0, 0, 3, 1, 1],
    ],
    [//5
        [1, 1, 2, 0, 0, 0, 2, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 4],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0, 1, 0, 4],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 3, 0, 0, 0, 3, 1, 1],
    ],
];

stages[stages.length-1].net = 
[
    [
        [1, 2, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
    ],
    [
        [0, 2, 0],
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1],
    ],
];

//3
stages.push(new stage());
stages[stages.length-1].map =
[
    [//0
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
    ],
    [//1
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
    ],
    [//1
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
    ],
    [//1
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
    ],
    [//1
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
    ],
    [//5
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
    ],
];

stages[stages.length-1].net = 
[
    [
        [1, 2, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
    ],
    [
        [0, 2, 0],
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1],
    ],
    [
        [0, 0, 1, 1],
        [0, 2, 1, 0],
        [1, 1, 0, 0],
    ],
    [
        [0, 0, 1, 1, 1],
        [1, 1, 2, 0, 0],
    ],
    [
        [0, 1],
        [0, 1],
        [2, 1],
        [1, 0],
        [1, 0],
    ],
];

//4
stages.push(new stage());
stages[stages.length-1].map =
[
    [//0
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
    ],
    [//1
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
    ],
    [//1
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
    ],
    [//1
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
    ],
    [//1
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
    ],
    [//5
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
    ],
];

stages[stages.length-1].net = 
[
    [
        [1, 2, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
    ],
    [
        [0, 2, 0],
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1],
    ],
    [
        [0, 0, 1, 1],
        [0, 2, 1, 0],
        [1, 1, 0, 0],
    ],
    [
        [0, 0, 1, 1, 1],
        [1, 1, 2, 0, 0],
    ],
    [
        [0, 1],
        [0, 1],
        [2, 1],
        [1, 0],
        [1, 0],
    ],
];

//5
stages.push(new stage());
stages[stages.length-1].goalFace = 5;
stages[stages.length-1].goalWay = 3;
stages[stages.length-1].plX = 1;
stages[stages.length-1].plY = 11;
stages[stages.length-1].map =
[
    [//0
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1,],
    ],
    [//1
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
        [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,],
    ],
    [//2
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
    ],
    [//3
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1,],
    ],
    [//4
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,],
    ],
    [//5
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0,],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0,],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
    ],
];

stages[stages.length-1].net = 
[
    [
        [1, 2, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
    ],
    [
        [0, 1, 0],
        [1, 2, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
    [
        [0, 0, 1, 1],
        [0, 2, 1, 0],
        [1, 1, 0, 0],
    ],
    [
        [0, 0, 1, 1, 1],
        [1, 1, 2, 0, 0],
    ],
    [
        [0, 1],
        [0, 1],
        [2, 1],
        [1, 0],
        [1, 0],
    ],
];