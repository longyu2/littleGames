const drawPixel = (x, y, color) => {
  document.querySelectorAll("td")[(y + 1) * 20 + x + 1].style.backgroundColor = color

}
// 定义点的模版
class point {
  x
  y
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}


let direction = 0; //方向变量，右开始，逆时针
let gameSpeed = 1; // 蛇的速度，数值越低蛇运动越快


let time; //计时器
let GAMEMODE = 0; //游戏模式 0标准，1穿墙 2无敌
let FrameNumber = 0; //     计时器，记录游戏时长


let snake = {
  HeadColor: "blue", //蛇头颜色
  bodyColor: "orange", //蛇身颜色
  array: [], //蛇身数组
}

isPause = true; //表示  setintervel  开启与否
borderColor = "black"; //表示外墙颜色

// 免除多次写for循环
const loop = (f, min, max) => {
  for (let i2 = min; i2 <= max; i2++) {
    for (let j2 = min; j2 <= max; j2++) {

      f(i2, j2)
    }
  }
}


// 执行死亡
const runDead = () => {
  if (confirm("你已经死了，选择是重开游戏，选择否取消")) {
    location.reload(true);
  }
  else {
    GoAndStop();
  }
}

let food = new point(0, 0)

//食物生成函数
const initFood = () => {
  // 随机生成果子

  food.y = Math.floor(Math.random() * 18);
  food.x = Math.floor(Math.random() * 18);

  for (let i = 0; i < snake.array.length; i++) {
    if (food.y == snake.array[i].y && food.x == snake.array[i].x) {
      initFood(); //发现生成的果子在蛇体内则重新生成
    }
  }

  // 每获得5分增加难度
  if ((snake.array.length) % 4 === 0 && gameSpeed > 170) {

    gameSpeed += 1;      // 蛇的长度达到4的倍数增加速度

    initTime();
  }

}

//判定死亡函数
const dead = () => {
  let newHead = new point(snake.array[0].x + directionArr[direction].x, snake.array[0].y + directionArr[direction].y)
  //标准模式和穿墙模式，遇到身体死亡,//标准模式撞墙死亡

  console.log(snake.array[0])
  console.log(newHead);


  for (let i = 0; i < snake.array.length; i++) {
    if (snake.array[i].x == newHead.x && snake.array[i].y === newHead.y) {
      runDead()
    }
  }


  if (GAMEMODE == 0 && (newHead.y == 18 || newHead.y == -1 || newHead.x == -1 || newHead.x == 18)) {
    runDead()
  }
}

//初始化界面，生成地图函数
const loading = () => {

  tableHtml = "";

  loop((i, j) => {
    if (j == 0) {
      tableHtml += "<tr>";
    }
    tableHtml += "<td></td>";
    if (j == 19) {
      tableHtml += "</tr>";
    }
  }, 0, 19)

  document.querySelector("table").innerHTML = tableHtml




  initFood(); //调用方法产生食物

  snake.array.push(new point(Math.floor(Math.random() * 15), Math.floor(Math.random() * 15)))   //随机生成蛇头
  snake.array.push(new point(0, 0))
  snake.array.push(new point(0, 0))

  // 生成蛇身
  for (let i = 1; i < 3; i++) {
    snake.array[i].y = snake.array[0].y;
    snake.array[i].x = snake.array[0].x - i;
  }
}

//蛇身移动函数
const move = () => {
  //若dead死亡，则不继续
  dead()
  let newHead1 = new point(snake.array[0].x + directionArr[direction].x, snake.array[0].y + directionArr[direction].y)


  console.log(GAMEMODE);
  if (GAMEMODE == 1) {
    if (newHead1.x > 17) {
      newHead1.x = 0;
    }
    if (newHead1.x < 0) {
      newHead1.x = 17;
    }
    if (newHead1.y < 0) {
      newHead1.y = 17;
    }
    if (newHead1.y > 17) {
      newHead1.y = 0;
    }
  }

  snake.array.unshift(newHead1);

  if (newHead1.x === food.x && newHead1.y === food.y) {
    //果子已经被吃掉，调用果子生成，清除原来的果子，生成新的果子
    initFood();
  } else {
    // 若没吃到，则从尾部开始，坐标变成前一步的坐标，不包括头
    snake.array.pop()
  }


}

//根据数组对页面进行渲染
const Render = () => {

  // 清除画布
  loop((i, j) => drawPixel(j, i, "white"), 0, 17)


  loop((i, j) => {
    if (i == 0 || i == 19 || j == 0 || j == 19) {
      document.querySelectorAll("td")[i * 20 + j].style.backgroundColor = borderColor
    }
  }, 0, 19)



  $("#score").text(snake.array.length - 3); // 超级暴力计算分数
  drawPixel(food.x, food.y, "red")  // 渲染食物
  drawPixel(snake.array[0].x, snake.array[0].y, snake.HeadColor) // 渲染蛇头
  //根据数组渲染蛇
  for (i = 1; i < snake.array.length; i++) {
    drawPixel(snake.array[i].x, snake.array[i].y, snake.bodyColor)
  }
}

const directionArr = [new point(1, 0), new point(0, -1), new point(-1, 0), new point(0, 1)]

$(function () {

  loading()

  Render()
  //键盘事件，调用move,wasd 87 65 83 68  上38左37下40右39
  $(document).keydown((e) => {
    if (e.keyCode == "87" || e.keyCode == "38" && direction != 3) {
      direction = 1; //上
    }
    else if (e.keyCode == 65 || e.keyCode == 37 && direction != 0) {
      direction = 2; //左
    } else if (e.keyCode == 83 || e.keyCode == 40 && direction != 1) {
      direction = 3; //左
    } else if (e.keyCode == 65 || e.keyCode == 39 && direction != 2) {
      direction = 0; //左
    }
    move();
  })

  //下拉框改变事件，调整游戏模式
  $("#changeGameMode").change(function () {
    GAMEMODE = $(this).val();
  });


  // 启动游戏
  const run = () => {
    FrameNumber++;
    if (!isPause) {
      if (FrameNumber * gameSpeed % 100 == 0) {
        move()
      }
    }
    Render()
    window.requestAnimationFrame(run)
  }

  //开始游戏按钮
  document.querySelector(".go").onclick = () => {
    isPause = !isPause;
    document.querySelector(".go").innerHTML = isPause ? "开始游戏" : "暂停游戏"
    run()
  }
})
