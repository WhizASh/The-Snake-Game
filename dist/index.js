"use strict";
const canvas = document.querySelector("canvas");
const gameButton = document.querySelector('#gameStart');
const highScore = document.querySelector('#highScore');
const score = document.querySelector('#score');
const diff = document.querySelector('#difficulty');
if (canvas) {
    const width = 500;
    const height = 500;
    canvas.height = height;
    canvas.width = width;
    const difficulty = {
        "easy": {
            cellUnit: 20,
            tick: 180
        },
        "medium": {
            cellUnit: 10,
            tick: 140
        },
        "hard": {
            cellUnit: 5,
            tick: 80
        }
    };
    const cxt = canvas.getContext('2d');
    let cellUnit = difficulty['easy'].cellUnit;
    let tick = difficulty['easy'].tick;
    let xVelocity = cellUnit;
    let yVelocity = 0;
    let gameOver = false;
    let id;
    let food = {
        x: Math.floor((Math.random() * width) / cellUnit) * cellUnit,
        y: Math.floor((Math.random() * height) / cellUnit) * cellUnit,
    };
    let snakeLength = 0;
    let highestScore = 0;
    let snake = [
        { x: cellUnit * 4, y: 0 * 4 },
        { x: cellUnit * 3, y: 0 * 3 },
        { x: cellUnit * 2, y: 0 * 2 },
        { x: cellUnit * 1, y: 0 * 1 },
    ];
    function init() {
        snake = [...initalPos];
        xVelocity = cellUnit;
        yVelocity = 0;
        gameOver = false;
        spawnFood();
        drawFood();
        snakeLength = 0;
        if (snakeLength > highestScore) {
            highestScore = snakeLength;
        }
        if (highScore)
            highScore.innerHTML = "Your Highest Score -> " + highestScore;
        if (score)
            score.innerHTML = "Score -> " + snakeLength.toString();
        clearInterval(id);
        id = setInterval(animate, tick);
    }
    function extendSnake() {
        const tail = snake[snake.length - 1];
        snake.push({
            x: tail.x - 25,
            y: tail.y - 25
        });
        snakeLength += 1;
        if (score)
            score.innerHTML = "Score -> " + snakeLength.toString();
    }
    const initalPos = [...snake];
    if (diff)
        diff.addEventListener('change', (event) => {
            const element = event.target;
            changeDifficulty(element.value);
        });
    if (diff)
        diff.addEventListener('blur', () => {
            console.log("diff blur");
        });
    document.addEventListener('keydown', (event) => {
        if (!event.repeat) {
            if (event.key == 'ArrowDown' && yVelocity == 0) {
                xVelocity = 0;
                yVelocity = cellUnit;
            }
            else if (event.key == 'ArrowLeft' && xVelocity == 0) {
                xVelocity = -cellUnit;
                yVelocity = 0;
            }
            else if (event.key == 'ArrowRight' && xVelocity == 0) {
                xVelocity = cellUnit;
                yVelocity = 0;
            }
            else if (event.key == 'ArrowUp' && yVelocity == 0) {
                xVelocity = 0;
                yVelocity = -cellUnit;
            }
        }
    });
    function changeDifficulty(diffi) {
        cellUnit = difficulty[diffi].cellUnit;
        tick = difficulty[diffi].tick;
        console.log(gameOver);
        if (!gameOver) {
            alert("difficulty changed Restating the game");
            //@ts-ignore
            document.querySelector('body').focus();
            //@ts-ignore
            diff.blur();
            init();
        }
    }
    function move() {
        if (!gameOver) {
            cxt === null || cxt === void 0 ? void 0 : cxt.clearRect(0, 0, width, height);
            drawFood();
            if (cxt)
                cxt.fillStyle = '#064018';
            cxt === null || cxt === void 0 ? void 0 : cxt.fillRect(snake[0].x, snake[0].y, cellUnit, cellUnit);
            if (cxt)
                cxt.fillStyle = 'green';
            snake.slice(1).forEach(element => {
                cxt === null || cxt === void 0 ? void 0 : cxt.fillRect(element.x, element.y, cellUnit, cellUnit);
            });
        }
    }
    function update() {
        const head = snake[0];
        const newHead = { x: head.x + xVelocity, y: head.y + yVelocity };
        if (newHead.x >= width || newHead.x < 0 || newHead.y >= height || newHead.y < 0) {
            clearInterval(id);
            gameOver = true;
        }
        else {
            //insert new head at the start
            snake.unshift(newHead);
            //remove the tail
            snake.pop();
        }
    }
    function spawnFood() {
        food = {
            x: Math.floor((Math.random() * width) / cellUnit) * cellUnit,
            y: Math.floor((Math.random() * height) / cellUnit) * cellUnit,
        };
    }
    function drawFood() {
        if (cxt) {
            cxt.fillStyle = 'red';
            cxt.fillRect(food.x, food.y, cellUnit, cellUnit);
        }
    }
    function animate() {
        update();
        move();
        //snake head and food collision check
        if (snake[0].x == food.x && snake[0].y == food.y) {
            extendSnake();
            spawnFood();
            drawFood();
        }
        //snake self collision check
        snake.slice(1).forEach((e) => {
            if (snake[0].x == e.x && snake[0].y == e.y) {
                gameOver = true;
                alert("Collision !!!!!!!!");
                return;
            }
        });
        if (gameButton) {
            gameButton.innerHTML = gameOver ? "Restart" : "Start";
        }
        if (gameOver) {
            if (snakeLength > highestScore) {
                highestScore = snakeLength;
            }
            if (highScore)
                highScore.innerHTML = "Your Highest Score -> " + highestScore;
        }
    }
    gameButton === null || gameButton === void 0 ? void 0 : gameButton.addEventListener("click", () => {
        init();
    });
    if (score)
        score.innerHTML = "Score -> " + snakeLength.toString();
    // id = setInterval(animate,400)
}
