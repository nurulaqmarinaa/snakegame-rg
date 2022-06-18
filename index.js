const CELL_SIZE = 20;
const CANVAS_SIZE = 500;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}
var MOVE_INTERVAL = [150, 110, 80, 50, 30];
var currentLevel = 0;

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{ x: head.x, y: head.y }];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        lifes: 3
    }
}
let snake1 = initSnake("darkgreen");
let apple = [
    {
        position: initPosition()
    },
    {
        position: initPosition()
    },
    {
        position: initPosition()
    }
]

let positionObstcale = [
    { x: 3, y: Math.floor(HEIGHT * 1 / 4) },//posisi lvl 2
    { x: 3, y: Math.floor(HEIGHT * 2 / 4) },//posisi lvl 3
    { x: 3, y: Math.floor(HEIGHT * 3 / 4) },//posisi lvl 4
    { x: Math.floor(WIDTH * 1 / 5), y: 3 },//posisi lvl 5
    { x: Math.floor(WIDTH * 4 / 5), y: 3 },//posisi lvl 5
];

function drawHorizontal(ctx, x, y, width, height) {
    ctx.fillStyle = "Black";
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE * width, CELL_SIZE * height);
}

let hearts = {
    position: initPosition()
}
function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x * CELL_SIZE + 10, y * CELL_SIZE + 10, CELL_SIZE - 12, CELL_SIZE - 12, 0, 0, 2 * Math.PI);
    ctx.fill();
}
let scores = 0;
let lastScore = 0;
function drawScore(snake) {
    let scoreCanvas = document.getElementById("score1Board");
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "18px Arial";
    scoreCtx.fillStyle = snake.color;
    scoreCtx.fillText(lastScore + snake.score, 20, scoreCanvas.scrollHeight / 2);
}
let lifesNow = snake1.lifes;
function lifes(ctx, x, y) {
    let heart = document.getElementById("lifes");
    for (let i = 0; i < lifesNow; i++) {
        ctx.drawImage(heart, 10 + x * i, y, CELL_SIZE, CELL_SIZE);
    }
}
function heart(ctx, x, y) {
    let heart = document.getElementById("lifes");
    let primal = snake1.score + lastScore;
    let divider = 0;
    for (let i = 1; i <= primal; i++) {
        if (primal % i == 0) {
            divider++;
        }
    }
    if (divider == 2 && snake1.score + lastScore > 5) {
        ctx.drawImage(heart, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        console.log(primal + " Bilangan prima");
    }
}
function draw() {
    setInterval(function () {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");
        let img = document.getElementById("iconApple");
        let headTopDown = document.getElementById("headTopDown");
        let headLeftRight = document.getElementById("headLeftRight");
        let bodySnake = document.getElementById("bodySnake");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        //check level
        checkLevel(snake1, ctx);

        //draw snake
        if (snake1.direction === DIRECTION.LEFT || snake1.direction === DIRECTION.RIGHT) {
            ctx.drawImage(headLeftRight, snake1.head.x * CELL_SIZE, snake1.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else {
            ctx.drawImage(headTopDown, snake1.head.x * CELL_SIZE, snake1.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }

        for (let i = 1; i < snake1.body.length; i++) {
            ctx.drawImage(bodySnake, snake1.body[i].x * CELL_SIZE, snake1.body[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        for (let i = 0; i < apple.length; i++) {
            ctx.drawImage(img, apple[i].position.x * CELL_SIZE, apple[i].position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        heart(ctx, hearts.position.x, hearts.position.y);
        lifes(ctx, 20, 10);
        drawScore(snake1);
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apple, hearts) {
    for (let i = 0; i < apple.length; i++) {
        if (snake.head.x == apple[i].position.x && snake.head.y == apple[i].position.y) {
            apple[i].position = initPosition();
            scores = snake.score++;
            snake.body.push({ x: snake.head.x, y: snake.head.y });
            document.getElementById("eatApple").play();
        } else if (snake.head.x == hearts.position.x && snake.head.y == hearts.position.y) {
            hearts.position = initPosition();
            scores = snake.score++;
            lifesNow++;
            snake.body.push({ x: snake.head.x, y: snake.head.y });
        }
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple, hearts);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple, hearts);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple, hearts);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple, hearts);
}

function checkCollision(snakes) {
    let isCollide = false;
    //this
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
        //cek obstacle
        let l = 0;
        while (l < currentLevel && currentLevel <= 3) {
            if ((snakes[i].head.x >= positionObstcale[l].x) && (snakes[i].head.x <= (positionObstcale[l].x + 19)) &&
                (snakes[i].head.y == positionObstcale[l].y)) {
                isCollide = true;
            }
            l++;
        }
        if (currentLevel == 4) {
            if (((snakes[i].head.y >= positionObstcale[3].y) && (snakes[i].head.y <= (positionObstcale[3].y + 19)) && (snakes[i].head.x == positionObstcale[3].x)) ||
                ((snakes[i].head.y >= positionObstcale[4].y) && (snakes[i].head.y <= (positionObstcale[4].y + 19)) && (snakes[i].head.x == positionObstcale[4].x))) {
                isCollide = true;
            }

        }
    }
    if (isCollide) {
        snake1 = initSnake("green");
        lifesNow -= 1;
        lastScore = lastScore + scores + 1;
        console.log("current " + lastScore);
        if (lifesNow < 1) {
            document.getElementById("gameover").play();
            alert("Game Over");
            lifesNow = 3;
            lastScore = 0;
        }
    }
    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake1])) {
        setTimeout(function () {
            move(snake);
        }, MOVE_INTERVAL[currentLevel]);
    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}
let levelUp = true;
function checkLevel(snake, ctx) {
    let textLevel = document.getElementById("leveling");
    if (lastScore + snake.score <= 5) {
        //level 1
        textLevel.textContent = "1";
        currentLevel = 0;

    } else if (lastScore + snake.score <= 10) {
        //level 2
        textLevel.textContent = "2";
        drawHorizontal(ctx, positionObstcale[0].x, positionObstcale[0].y, 20, 1);
        currentLevel = 1;
        if (levelUp) {
            document.getElementById("levelUp").play();
            levelUp = false;
        }
    } else if (lastScore + snake.score <= 15) {
        //level 3
        textLevel.textContent = "3";
        drawHorizontal(ctx, positionObstcale[0].x, positionObstcale[0].y, 20, 1);
        drawHorizontal(ctx, positionObstcale[1].x, positionObstcale[1].y, 20, 1);
        currentLevel = 2;
        if (!levelUp) {
            document.getElementById("levelUp").play();
            levelUp = true;
        }

    } else if (lastScore + snake.score <= 20) {
        //level 4
        textLevel.textContent = "4";
        drawHorizontal(ctx, positionObstcale[0].x, positionObstcale[0].y, 20, 1);
        drawHorizontal(ctx, positionObstcale[1].x, positionObstcale[1].y, 20, 1);
        drawHorizontal(ctx, positionObstcale[2].x, positionObstcale[2].y, 20, 1);
        currentLevel = 3;
        if (levelUp) {
            document.getElementById("levelUp").play();
            levelUp = false;
        }

    } else {
        //level 5
        textLevel.textContent = "5";
        drawHorizontal(ctx, positionObstcale[3].x, positionObstcale[3].y, 1, 20);
        drawHorizontal(ctx, positionObstcale[4].x, positionObstcale[4].y, 1, 20);
        currentLevel = 4;
        if (!levelUp) {
            document.getElementById("levelUp").play();
            levelUp = true;
        }
    }

}


document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake1, DIRECTION.DOWN);
    }
})

function initGame() {
    move(snake1);
}

initGame();