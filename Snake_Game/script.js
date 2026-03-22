const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, direction, food, score, level, speed, game;

// Load High Score
let highScore = localStorage.getItem("snakeHighScore") || 0;
document.getElementById("highScore").innerText = highScore;

// Init Game
function init() {
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    score = 0;
    level = 1;
    speed = 180;

    food = randomFood();

    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = level;
    document.getElementById("gameOverScreen").classList.add("hidden");

    if (game) clearInterval(game);
    game = setInterval(draw, speed);
}

// Random Food
function randomFood() {
    return {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
}

// Keyboard Control
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Mobile Control
function setDir(dir) {
    direction = dir;
}

// Collision
function collision(head) {
    return snake.some(seg => seg.x === head.x && seg.y === head.y);
}

// Draw Game
function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 400, 400);

    // 🐍 Snake (round body)
    snake.forEach((s, i) => {
        ctx.beginPath();
        ctx.arc(s.x + box/2, s.y + box/2, box/2 - 2, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? "#00ffcc" : "#00aa88";
        ctx.fill();
    });

    // Eyes
    let head = snake[0];
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(head.x + 6, head.y + 6, 2, 0, Math.PI * 2);
    ctx.arc(head.x + 14, head.y + 6, 2, 0, Math.PI * 2);
    ctx.fill();

    // Food
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    // Eat Food
    if (headX === food.x && headY === food.y) {
        score++;
        document.getElementById("score").innerText = score;

        if (score % 5 === 0) {
            level++;
            if (speed > 80) speed -= 5;

            document.getElementById("level").innerText = level;

            clearInterval(game);
            game = setInterval(draw, speed);
        }

        food = randomFood();
    } else {
        snake.pop();
    }

    let newHead = { x: headX, y: headY };

    // Game Over
    if (
        headX < 0 || headY < 0 ||
        headX >= 400 || headY >= 400 ||
        collision(newHead)
    ) {
        clearInterval(game);

        if (score > highScore) {
            localStorage.setItem("snakeHighScore", score);
            document.getElementById("highScore").innerText = score;
        }

        document.getElementById("finalScore").innerText = score;
        document.getElementById("gameOverScreen").classList.remove("hidden");
        return;
    }

    snake.unshift(newHead);
}

// Restart
function restartGame() {
    init();
}

// Start Game
init();