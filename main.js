const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width);

const N = 1000;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.8);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(2), -100, 30, 50, "DUMMY", (maxSpeed = 1)),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", (maxSpeed = 1)),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", (maxSpeed = 1)),
  new Car(road.getLaneCenter(1), -200, 30, 50, "DUMMY", (maxSpeed = 1)),
  new Car(road.getLaneCenter(2), -350, 30, 50, "DUMMY", (maxSpeed = 1)),
  new Car(road.getLaneCenter(0), -400, 30, 50, "DUMMY", (maxSpeed = 1)),
  new Car(road.getLaneCenter(1), -550, 30, 50, "DUMMY", (maxSpeed = 1)),
  new Car(road.getLaneCenter(1), -650, 30, 50, "DUMMY", (maxSpeed = 1)),
  new Car(road.getLaneCenter(2), -750, 30, 50, "DUMMY", (maxSpeed = 1)),
  new Car(road.getLaneCenter(1), -850, 30, 50, "DUMMY", (maxSpeed = 1)),
  new Car(road.getLaneCenter(0), -950, 30, 50, "DUMMY", (maxSpeed = 1)),
  new Car(road.getLaneCenter(0), -1050, 30, 50, "DUMMY", (maxSpeed = 1)),
  new Car(road.getLaneCenter(2), -1550, 30, 50, "DUMMY", (maxSpeed = 1)),
  new Car(road.getLaneCenter(2), -1350, 30, 50, "DUMMY", (maxSpeed = 1)),
];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 0; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  const bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.8);
  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "blue");
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "black");
  }

  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "black", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;

  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
