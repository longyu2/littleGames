$(function () {
  const map = new Array(); //生成地图数组,  9是食物
  let direction = 0; //方向变量，右开始，逆时针

  let food = {
    //食物
    x: 0,
    y: 0,
  };

  let time; //计时器
  let GAMEMODE = 0; //游戏模式 0标准，1穿墙 2无敌
  let GAMETIME = 0; //     计时器，记录游戏时长

  let GAME = {
    mode: 0, //游戏模式 0标准，1穿墙 2无敌
    time: 0, //     计时器，记录游戏时长
  };

  let snake = {
    HeadColor: "blue", //蛇头颜色
    bodyColor: "orange", //蛇身颜色
    array: [
      {
        x: 0,
        y: 0,
      },
    ], //蛇身数组
  };

  IsbtnGo = false; //表示  setintervel  开启与否
  borderColor = "black"; //表示外墙颜色

  loading();

  //初始化界面，生成地图函数
  function loading() {
    tableHtml = "";
    for (i = 0; i < 20; i++) {
      tableHtml += "<tr>";
      for (j = 0; j < 20; j++) {
        tableHtml += "<td></td>";
      }
      tableHtml += "</tr>";
    }
    $("table").append(tableHtml);

    for (i = 0; i < 20; i++) {
      map[i] = new Array();
      for (j = 0; j < 20; j++) {
        if (i == 0 || i == 20 - 1) {
          map[i][j] = 7; //墙壁
        } else {
          if (j == 0 || j == 20 - 1) {
            map[i][j] = 7; //墙壁
          } else {
            map[i][j] = 0;
          }
        }
      }
    }

    foodAdd(); //调用方法产生食物

    //随机生成蛇头
    snake.array[0].y = Math.floor(Math.random() * 15);
    snake.array[0].x = Math.floor(Math.random() * 15);

    //确保蛇不会生成在食物附近
    while (
      Math.abs(snake.array[0].y - food.y) < 5 &&
      Math.abs(snake.array[0].x - food.x) < 5
    ) {
      snake.array[0].y = Math.floor(Math.random() * 15);
      snake.array[0].x = Math.floor(Math.random() * 15);
    }

    // 生成蛇身
    for (let i = 1; i < 3; i++) {
      snake.array.push({ x: 0, y: 0 });
      snake.array[i].y = snake.array[0].y;
      snake.array[i].x = snake.array[0].x - i;
    }

    Render();
  }

  //食物生成函数
  function foodAdd() {
    // 随机生成果子
    food.y = Math.floor(Math.random() * 18 + 1);
    food.x = Math.floor(Math.random() * 18 + 1);

    for (let i = 0; i < snake.array.length; i++) {
      if (food.y == snake.array[i].y && food.x == snake.array[i].x) {
        foodAdd(); //如果发现
      }
    }
  }

  //蛇身移动函数
  function move() {
    //若dead死亡，则不继续
    if (!dead(direction)) {
      return;
    }

    //复制head,防止浅拷贝带来的指针问题
    let snakeHeadCopy = { y: snake.array[0].y, x: snake.array[0].x };

    // head按照运动方向推进一格
    if (direction == 0) {
      snakeHeadCopy.x += 1;
    } else if (direction == 1) {
      snakeHeadCopy.y -= 1;
    } else if (direction == 2) {
      snakeHeadCopy.x -= 1;
    } else if (direction == 3) {
      snakeHeadCopy.y += 1;
    }

    //判吃到果子没有，如果吃到，则数组长度+1,头部插入果子的坐标即可

    if (snakeHeadCopy.x === food.x && snakeHeadCopy.y === food.y) {
      snake.array.unshift({ x: food.x, y: food.y });
      //果子已经被吃掉，调用果子生成，清除原来的果子，生成新的果子
      foodAdd();
    } else {
      // 若没吃到，则从尾部开始，坐标变成前一步的坐标，不包括头
      for (let i = snake.array.length - 1; i > 0; i--) {
        snake.array[i] = snake.array[i - 1];
      }

      snake.array[0] = snakeHeadCopy; // 将头指向调整好的头的复制

      //调用方法渲染页面
    }

    Render(); // 将数据渲染成视图
  }

  //判定死亡函数
  function dead() {
    nextx = snake.array[0].y;
    nexty = snake.array[0].x;
    //获得两个用来存储下一格的变量
    if (direction == 0) {
      nexty += 1;
    } else if (direction == 1) {
      nextx -= 1;
    } else if (direction == 2) {
      nexty -= 1;
    } else if (direction == 3) {
      nextx += 1;
    }

    //标准模式和穿墙模式，遇到身体死亡
    if (GAMEMODE == 0 || GAMEMODE == 1) {
      //遍历snake.array，判断蛇头的下一个点是否是蛇身
      for (i = 0; i < snake.array.length; i++) {
        if (nextx == snake.array[i].y && nexty == snake.array[i].x) {
          if (confirm("你已经死了，选择是重开游戏，选择否取消")) {
            location.reload(true);
          }
          GoAndStop();
          return false;
        }
      }
    }

    //标准模式撞墙死亡，其余穿墙
    if (GAMEMODE == 0) {
      if (nexty == 19) {
        if (confirm("你已经死了，选择是重开游戏，选择否取消")) {
          location.reload(true);
        } else {
          GoAndStop();
          return false;
        }
      }
      if (nexty == 0) {
        if (confirm("你已经死了，选择是重开游戏，选择否取消")) {
          location.reload(true);
        } else {
          GoAndStop();
          return false;
        }
      }
      if (nextx == 0) {
        if (confirm("你已经死了，选择是重开游戏，选择否取消")) {
          location.reload(true);
        } else {
          GoAndStop();
          return false;
        }
      }
      if (nextx == 19) {
        if (confirm("你已经死了，选择是重开游戏，选择否取消")) {
          location.reload(true);
        } else {
          GoAndStop();
          return false;
        }
      }
    } else {
      if (nexty == 19) {
        snake.array[0].x = 0;
      }
      if (nexty == 0) {
        snake.array[0].x = 19;
      }
      if (nextx == 0) {
        snake.array[0].y = 19;
      }
      if (nextx == 19) {
        snake.array[0].y = 0;
      }
    }
    return true;
  }

  //根据数组对页面进行渲染
  function Render() {
    //显示时间以及分数
    if (GAMETIME % 2 == 0) {
      if ((GAMETIME / 2) % 60 < 10) {
        $("#gametimeM").text("0" + ((GAMETIME / 2) % 60));
      } else {
        $("#gametimeM").text((GAMETIME / 2) % 60);
      }
      if (GAMETIME / 2 / 60 < 10) {
        $("#gametimeF").text("0" + Math.floor(GAMETIME / 2 / 60));
      } else {
        $("#gametimeF").text(Math.floor(GAMETIME / 2 / 60));
      }
    }
    $("#score").text(snake.array.length - 3);

    $("td").css("background", "white");

    //边界
    for (i = 0; i < 20; i++) {
      for (j = 0; j < 20; j++) {
        if (i == 0 || i == 20 - 1) {
          $("tr:eq(" + i + ")>td:eq(" + j + ")").css("background", borderColor);
        } else {
          if (j == 0 || j == 20 - 1) {
            $("tr:eq(" + i + ")>td:eq(" + j + ")").css(
              "background",
              borderColor
            );
          }
        }
      }
    }

    // 渲染食物
    $("tr:eq(" + food.y + ")>td:eq(" + food.x + ")").css("background", "red");

    //根据数组渲染蛇
    for (i = 0; i < snake.array.length; i++) {
      if (i == 0) {
        $(
          "tr:eq(" + snake.array[i].y + ")>td:eq(" + snake.array[i].x + ")"
        ).css("background", snake.HeadColor);
      } else {
        $(
          "tr:eq(" + snake.array[i].y + ")>td:eq(" + snake.array[i].x + ")"
        ).css("background", snake.bodyColor);
      }
    }
  }

  //键盘事件，调用move,wasd 87 65 83 68  上38左37下40右39
  $(document).keydown(function (event) {
    events = event.keyCode;

    if (events == "87" || events == "38") {
      if (direction != 3) {
        direction = 1; //上
        move();
      } else {
        return;
      }
    } else if (events == 65 || events == 37) {
      if (direction != 0) {
        direction = 2; //左
        move();
      } else {
        return;
      }
    } else if (events == 83 || events == 40) {
      if (direction != 1) {
        direction = 3; //左
        move();
      } else {
        return;
      }
    } else if (events == 65 || events == 39) {
      if (direction != 2) {
        direction = 0; //左
        move();
      } else {
        return;
      }
    }
  });

  //下拉框改变事件，调整游戏模式
  $("#changeGameMode").change(function () {
    GAMEMODE = $(this).val();
  });

  //调整地图大小
  $(".mapSize").click(function () {});

  //开始或停止事件
  function GoAndStop() {
    if (!IsbtnGo) {
      IsbtnGo = !IsbtnGo;
      $(".go").text("暂停");
      time = setInterval(function () {
        move();
        GAMETIME++;
      }, 500);
    } else {
      IsbtnGo = !IsbtnGo;

      $(".go").text("开始游戏");
      clearInterval(time);
    }
  }

  //开始游戏按钮
  $(".go").click(function () {
    GoAndStop();
  });
});
