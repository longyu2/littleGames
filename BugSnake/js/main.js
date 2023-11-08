$(function(){

    map = new Array()   //生成地图数组,  9是食物
    direction = 0       //方向变量，右开始，逆时针
    snake = new Array()   //蛇身数组
    var foodi = 0
    var foodj = 0         //食物坐标 
    var time                //计时器
    var GAMEMODE = 0           //游戏模式 0标准，1穿墙 2无敌
	var GAMETIME = 0			//     计时器，记录游戏时长
    IsbtnGo = false           //表示  setintervel  开启与否
    borderColor = "black"       //表示外墙颜色
    snakeHeadColor = "blue"     //蛇头颜色
    snakeBodyColor = "orange"   //蛇身颜色 

    loading()


    //初始化界面，生成地图函数
    function  loading(){
        tableHtml=""
        for (i =0 ;i<20;i++){
            tableHtml += "<tr>"
            for (j =0 ;j<20;j++){
                tableHtml += "<td></td>"
            }
            tableHtml += "</tr>"
        }
        $("table").append(tableHtml)
        
        for (i=0;i<20;i++){
            map[i] = new Array()
            for (j =0 ;j<20;j++){
                if(i == 0 || i == 20-1){
                    map[i][j] = 7 //墙壁 
                    
                     

                }
                else{
                    if(j == 0 || j == 20-1){
                        map[i][j] = 7   //墙壁 
                        
                    }
                    else{
                        map[i][j] = 0   
                    }
                    
                }
               
            }

        }


        foodAdd()   //调用方法产生食物

        //初始化蛇数组，为三个长度
        randSnakeHeadi = Math.floor(Math.random()*15)
        randSnakeHeadj = Math.floor(Math.random()*15)

        //确保蛇不会生成在食物附近
        while(randSnakeHeadi - foodi < 5 && randSnakeHeadj - foodj < 5){
            randSnakeHeadi = Math.floor(Math.random()*15)
            randSnakeHeadj = Math.floor(Math.random()*15)
        }

        console.log(randSnakeHeadi)
        console.log(randSnakeHeadj)
        for(i=0;i<3;i++){
            snake[i] = new Array()
            if(i==0){
                snake[i][0] = randSnakeHeadi
                snake[i][1] = randSnakeHeadj
                
            }
            else{
                snake[i][0] = randSnakeHeadi
                snake[i][1] = randSnakeHeadj-i
            }
            console.log(snake)
        }
        
        Render()
    }
    
   //食物生成函数
   function foodAdd(){

       map[foodi][foodj] = 0   //清除旧果子

       //果子不能生成在蛇体内，遍历一遍蛇，如果果子与蛇坐标重合就重新生成
        
            foodi = Math.floor(Math.random()*18+1)
            foodj = Math.floor(Math.random()*18+1)
            i =0;
            for( i =0 ;i<snake.length ; i++){
                if(foodi==snake[i][0] && foodj == snake[i][1])
                {
                    foodAdd()//如果发现
                    break
                }     
            }
            
        
        if (map[foodi][foodj] == 0){
                map[foodi][foodj] = 9   //生成新果子
        }    
        

                                                                                                                                                                                                                                                                  
   }

   //蛇身移动函数
   function move(){
        //定义个临时数组存储蛇头
        headxy = new Array()
        headxy[0] = snake[0][0]
        headxy[1] = snake[0][1]

        //若dead死亡，则不继续
        if(!dead(direction)){
            return
        }

        var snakeCopy = new Array()
        for (i =0 ;i<snake.length;i++){
            snakeCopy[i] =new Array()
            for (j =0 ;j<2;j++){
                snakeCopy[i][j]=snake[i][j]
            }
        }
       
        
            
        //根据此时的方向，将头部推进一格
        if(direction==0){
            snake[0][1] += 1;
        }
        else if(direction==1){
            snake[0][0] -= 1;
        }
        else if(direction==2){
            snake[0][1] -= 1;
        }
        else if(direction==3){
            snake[0][0] += 1;
        }
       
        
        
            
        //所有身体向前推进一格，此时只改变数组，没有渲染，所以用户无法察觉
        for(zz = snakeCopy.length-1 ;zz>1;zz--){
            snake[zz]=snakeCopy[zz-1]
        }
        //蛇第二推进到蛇头
        snake[1]=headxy
        
        //判吃到果子没有，如果吃到，则数组长度加1
        if(map[snake[0][0]][snake[0][1]]==9){
            //如果吃到，推进后snake数组加1，数组snake最后那个等于原来的最后的那个
            snake[snake.length] = (snakeCopy[snakeCopy.length-1])
            //果子已经被吃掉，调用果子生成，清除原来的果子，生成新的果子
            foodAdd()
            
        }

        //调用方法渲染页面
        Render()

   }
   //判定死亡函数
   function dead() {
        nextx = snake[0][0]
        nexty = snake[0][1]
        //获得两个用来存储下一格的变量
        if(direction==0){
            nexty += 1;
        }
        else if(direction==1){
            nextx -= 1;
        }
        else if(direction==2){
            nexty -= 1;
        }
        else if(direction==3){
            nextx += 1;
        }
        
        //标准模式和穿墙模式，遇到身体死亡
        if(GAMEMODE == 0 || GAMEMODE == 1){
            //遍历snake，判断蛇头的下一个点是否是蛇身
            for(i = 0;i<snake.length;i++){
                if(nextx == snake[i][0] && nexty == snake[i][1]){
                    if(confirm("你已经死了，选择是重开游戏，选择否取消")){
                        location.reload(true)
                    }
                    GoAndStop()
                    return false
                }
            }
       }

        //标准模式撞墙死亡，其余穿墙
        if(GAMEMODE == 0){
            if( nexty == 19){
                if(confirm("你已经死了，选择是重开游戏，选择否取消")){
                    location.reload(true)
                }
                else{
                    GoAndStop()
                    return false
                }
                
             }
             if(nexty == 0){
                if(confirm("你已经死了，选择是重开游戏，选择否取消")){
                    location.reload(true)
                }
                else{
                    GoAndStop()
                    return false
                }
                 
             }
             if(nextx == 0){
                if(confirm("你已经死了，选择是重开游戏，选择否取消")){
                    location.reload(true)
                }
				else{
                    GoAndStop()
                    return false
                }
             }
             if(nextx == 19){
                if(confirm("你已经死了，选择是重开游戏，选择否取消")){
                    location.reload(true)
                }
                else{
                    GoAndStop()
                    return false
                }

                
            }
        }
        else{
            if( nexty == 19){
                snake[0][1] = 0 
                
             }
             if(nexty == 0){
                snake[0][1] = 19 
                 
             }
             if(nextx == 0){
                snake[0][0] = 19 
                 
             }
             if(nextx == 19){
                snake[0][0] = 0 
                 
             }
        }
        return true
   }

   //根据数组对页面进行渲染
   function Render(){
       //显示时间以及分数
	   if(GAMETIME%2==0){
		   if((GAMETIME/2)%60<10){
			    $("#gametimeM").text("0"+(GAMETIME/2)%60)
		   }
		    else{
				$("#gametimeM").text((GAMETIME/2)%60)
			}
			if(((GAMETIME/2)/60) < 10){
				$("#gametimeF").text("0"+Math.floor((GAMETIME/2)/60))
			}else{
				$("#gametimeF").text(Math.floor((GAMETIME/2)/60))
			}
	   }
	   $("#score").text(snake.length-3)
	   

       //根据数组渲染食物
       $("td").css("background","white")

       //边界
       for (i=0;i<20;i++){
            for (j =0 ;j<20;j++){
                if(i == 0 || i == 20-1){
                    $("tr:eq("+i+")>td:eq("+j+")").css("background",borderColor)
                }
                else{
                    if(j == 0 || j == 20-1){
                    $("tr:eq("+i+")>td:eq("+j+")").css("background",borderColor)

                    }
                }
            }
        }

       

       $("tr:eq("+foodi+")>td:eq("+foodj+")").css("background","red") 

       //根据数组渲染蛇
       for(i=0 ;i<snake.length;i++){
           if(i==0){
            $("tr:eq("+snake[i][0]+")>td:eq("+snake[i][1]+")").css("background",snakeHeadColor) 

           }
           else{
            $("tr:eq("+snake[i][0]+")>td:eq("+snake[i][1]+")").css("background",snakeBodyColor) 

           }
       }

   }

   //键盘事件，调用move,wasd 87 65 83 68  上38左37下40右39 
   $(document).keydown(function(event){
        events= event.keyCode
       
        if(events == '87' || events == '38'){
            if(direction != 3){
                direction = 1    //上
				move()
            }
            else{
                return
            }
        }
        else if(events == 65 || events == 37){
           
            if(direction != 0){
                direction = 2    //左
				move()
            }
            else{
                return
            }
        }
        else if(events == 83 || events == 40){
            if(direction != 1){
                direction = 3    //左
				move()
            }
            else{
                return
            }
        }
        else if(events == 65 || events == 39){
            if(direction != 2){
                direction = 0    //左
				move()
            }
            else{
                return
            }
        }
		
		
        
   })

   //下拉框改变事件，调整游戏模式
   $("#changeGameMode").change(function(){
       GAMEMODE = $(this).val()
   })

   //调整地图大小
   $(".mapSize").click(function(){
       
   })

   //开始或停止事件
   function GoAndStop(){
    if(!IsbtnGo){
        IsbtnGo=!IsbtnGo
        $(".go").text("暂停")
        time = setInterval(function(){
            move()
            GAMETIME++;
            
       },500)
    }
    else{
        IsbtnGo=!IsbtnGo

        $(".go").text("开始游戏")
        clearInterval(time)
    }
   }

   //开始游戏按钮
   $(".go").click(function(){
      
    GoAndStop()
       
   })
})

