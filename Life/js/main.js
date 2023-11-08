$(function  () {
	
//--程序正文--------------------------------------------------

// 定义地图大小
map_x = 100
map_y = 100

loop_tick = 100	// 定义初始循环间隔

//定义存储数据用的主数组
var arrx=new Array();
var arr_Copy=new Array();
loading()




//游戏开始之前设定初始状态，td点击变色，点击按钮开始游戏
//思路是点击改变存储的值，只有0和1两种状态，0死1生
$("td").click(function  () {
	
		//通过巧妙的运算获取索引，不过是由于基础知识太过缺乏导致的，日后应当修改
		var ax=zuobiao2($("td").index($(this)))[0]
		var ay=zuobiao2($("td").index($(this)))[1]
		
		
		if(arrx[ax][ay]==0)
		{

			arrx[ax][ay]=1
			$(this).css("background","white");
		}
		else if(arrx[ax][ay]==1)
		{
			
			arrx[ax][ay]=0
			$(this).css("background","black");
		}		
		
		//将数组值赋值给td的text
		for(i=0;i<map_x;i++){
			for(j=0;j<map_y;j++){
				arr_Copy[i][j] = arrx[i][j]
			}
		}	
})



//函数区-----------------------------------------------
function setMapSize(){
	map_size = ""
	while(typeof(map_size) != 'number'){
		map_size = Number(prompt("请输入地图大小,请输入一个正整数"))	
	}
	$(".main").empty()
	map_x = map_size
	map_y = map_size

	loading()

	// 由于新生成的td没有被绑定点击事件，这里重新绑定一次
	$("td").click(function  () {
		//通过巧妙的运算获取索引，不过是由于基础知识太过缺乏导致的，日后应当修改
		var ax=zuobiao2($("td").index($(this)))[0]
		var ay=zuobiao2($("td").index($(this)))[1]
		
		
		if(arrx[ax][ay]==0)
		{

			arrx[ax][ay]=1
			$(this).css("background","white");
		}
		else if(arrx[ax][ay]==1)
		{
			
			arrx[ax][ay]=0
			$(this).css("background","black");
		}		
		
		//将数组值赋值给td的text
		for(i=0;i<map_x;i++){
			for(j=0;j<map_y;j++){
				arr_Copy[i][j] = arrx[i][j]
			}
		}	
})

}

function autoGo(){
	loop_setinterval = setInterval(() => {
		compute()
	}, loop_tick);
}

function setSpeed(){
	loop_tick = Number(prompt("请输入运行时间间隔，为0到1000的正整数，数字代表毫秒"))
	$("#speed").text("当前速度为"+loop_tick)
}

function stopGame(){
	clearInterval(loop_setinterval)
}

//下面两个函数用来坐标转换
function zuobiao1 (x,y) {
	return x*map_y+y;
}

function zuobiao2 (id) {
	var yyy,xxx;
	yyy=id%map_y;
	xxx=(id-yyy)/map_y;
	var arrxxyy=new Array(2)
	arrxxyy[0]=xxx;
	arrxxyy[1]=yyy;
	return arrxxyy;
}

//计算的函数，调用一次计算一次
function compute (){
	//计算的思路很简单遍历每一个元素，再遍历每一个元素的周边元素，根据其周边元素的形态决定其的生死
	
	//遍历每一个元素
	for(i=1;i<map_x-1;i++){
		for(j=1;j<map_x-1;j++){
			

			//已经获取到每一个元素，现在获取每个元素的周围有多少个生命
			//定义计数器
			time=0
		
			for(iAround=i-1;iAround <i+2 ;iAround++){
				for(jAround=j-1;jAround< j+2 ; jAround++){			
					if(arr_Copy[iAround][jAround] == 1 && !(iAround==i&&jAround == j)){
						time++
					}
				}
			}
	

			//现在已经把当前元素周围生命的个数写到time中，现在根据time修改数组
			if(time>3||time<2){
				// console.log("qingligng"+i,j)
				arrx[i][j] = 0
				
			}
			else if(time == 3){
				arrx[i][j]=1
				// console.log("存活"+i,j)

			}
			
		}
	}


	
	//数组修改已经完成，根据数组渲染元素
	for(i=1;i<map_x-1;i++){
		for(j=1;j<map_x-1;j++){
			if(arrx[i][j]==1 && arr_Copy[i][j] != arrx[i][j]){
				$("tr:eq("+i+")>td:eq("+j+")").css("background","white")
				// $("tr:eq("+i+")>td:eq("+j+")").text("1")				
			}
			else if(arrx[i][j]==0 && arr_Copy[i][j] != arrx[i][j]){
				$("tr:eq("+i+")>td:eq("+j+")").css("background","black")
				
			}
		}
	}

	// arrx 是修改过的值，arrx_Copy是未修改的数组 ，在运算方法的最后同步两个数组
	for(i=0;i<map_x;i++){
		for(j=0;j<map_y;j++){
			arr_Copy[i][j] = arrx[i][j]
		}
	}	


}

//地图初始化函数
function loading(){
	for (var i=0;i<map_x;i++) {
		arrx[i]=new Array()
		for (var j=0;j<map_y;j++) {
			 arrx[i][j]=0
		}
	}
	

		
	for (var i=0;i<map_x;i++) {
		arr_Copy[i]=new Array()
		for (var j=0;j<map_y;j++) {
			arr_Copy[i][j]=0
		}
	}



		
	//根据设定的地图大小，填充图形
	str = ""
	for(i = 0;i<map_x;i++){
		str+="<tr>"
		for(j=0;j<map_y;j++){
			str +="<td></td>"
		}
		str+="</tr>"
	}

	$(".main").append(str)


}


document.getElementById('go').onclick = compute
document.getElementById('auto-game').onclick = autoGo
document.getElementById('stop').onclick = stopGame
document.getElementById('set-speed').onclick = setSpeed
document.getElementById('set-mapsize').onclick = setMapSize



//---程序到此为止--------------------------------------------------------------------
})