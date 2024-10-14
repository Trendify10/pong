const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

const user = {
  x: 0,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 100,
  color: 'white',
  score: 0
};

const computer = {
  x: canvas.width - 10,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 100,
  color: 'white',
  score: 0
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  color: 'white'
};

function drawRect(x, y, w, h, color) {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();
}

function drawText(text, x, y, color) {
  context.fillStyle = color;
  context.font = '45px sans-serif';
  context.fillText(text, x, y);
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, 'black');
  drawText(user.score, canvas.width / 4, canvas.height / 5, 'white');
  drawText(computer.score, 3 * canvas.width / 4, canvas.height / 5, 'white');
  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function collision(b, p) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX = -ball.velocityX;
  ball.speed = 5;
}

function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  const player = ball.x < canvas.width / 2 ? user : computer;

  if (collision(ball, player)) {
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);

    let angleRad = (Math.PI / 4) * collidePoint;

    let direction = ball.x < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    ball.speed += 0.5;
  }

  if (ball.x - ball.radius < 0) {
    computer.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }

  computer.y += (ball.y - (computer.y + computer.height / 2)) * 0.1;

  if (user.y > 0 && user.y + user.height < canvas.height) {
    user.y += (ball.y - (user.y + user.height / 2)) * 0.1;
  }
}

function game() {
  update();
  render();
}

const fps = 50;
setInterval(game, 1000 / fps);
