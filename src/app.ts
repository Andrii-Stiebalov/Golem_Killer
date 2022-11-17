import './style.scss';
import * as PIXI from 'pixi.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { urlToGolemFramesIdle, urlToGolemFramesDied } from './models/Golem';
import level1 from './assets/level1.json';

function creteHTMLElement(tag: string, className: string) {
  const element = document.createElement(tag);
  element.className = className;

  return element;
}

const counter = creteHTMLElement('div', 'counter');
const startMessage = creteHTMLElement('div', 'startMessage');
const startButton = creteHTMLElement('button', 'startButton');
startButton.innerHTML = 'Start';
const containerStartMessage = creteHTMLElement('div', 'container');

document.body.appendChild(counter);
document.body.appendChild(containerStartMessage);
containerStartMessage.appendChild(startMessage);
containerStartMessage.appendChild(startButton);

const title = creteHTMLElement('h1', 'title');
title.innerHTML = 'Golem Killer';

containerStartMessage.appendChild(title);

function hideStartMessage() {
  containerStartMessage.style.opacity = '0';
  containerStartMessage.style.transform = `translateX(${window.innerWidth}px)`;
}

function showStartMessage() {
  containerStartMessage.style.transform = 'translateX(0)';
  containerStartMessage.style.opacity = '1';
}

const app = new PIXI.Application({
  width: window.innerWidth - 20,
  height: window.innerHeight - 20,
  backgroundColor: 0xFFFFFF,
  sharedTicker: true,
  sharedLoader: true,
});

document.body.appendChild(app.view);

const container = new PIXI.Container();
app.stage.addChild(container);

const background = PIXI.Sprite.from('assets/img/game_background_3.png');
background.width = app.screen.width;
background.height = app.screen.height;
background.position.x = 20;
background.position.y = 20;

container.addChild(background);

const dyingTexture = new (PIXI.AnimatedSprite.fromFrames as any)(urlToGolemFramesDied);

function removeGolem(golem: PIXI.AnimatedSprite) {
  const ticker = PIXI.Ticker.shared;
  ticker.add(() => {
    // eslint-disable-next-line no-param-reassign
    golem.alpha -= 0.01;
  });
  setTimeout(() => golem.destroy(), 1500);
}

let countOfMobs = 0;

function onClick(this: PIXI.AnimatedSprite) {
  this.textures = dyingTexture.textures;
  this.play();
  this.loop = false;
  this.interactive = false;

  counter.innerHTML = `${--countOfMobs}`;
  this.onComplete = () => removeGolem(this);

  if (countOfMobs < 1) {
    showStartMessage();
  }
}

function createGolems() {
  const { mobs } = level1;
  countOfMobs = mobs.length;
  counter.innerHTML = `${countOfMobs}`;

  mobs.forEach((mob, i) => {
    const { x, y } = mob;

    const animatedGolem = new (PIXI.AnimatedSprite.fromFrames as any)(urlToGolemFramesIdle);
    animatedGolem.interactive = true;
    animatedGolem.animationSpeed = 1 / 6;
    animatedGolem.height = 0.5;
    animatedGolem.width = 0.5;
    animatedGolem.x = x;
    animatedGolem.y = y;
    animatedGolem.anchor.x = 1;
    animatedGolem.scale.x *= -1;
    animatedGolem.play();
    animatedGolem.tint = (Math.random() + 100) * 0xFFFFFF;

    animatedGolem.on('pointerdown', onClick);

    setTimeout(() => {
      container.addChild(animatedGolem);
    }, 300 * i);
  });
}

function startGame() {
  createGolems();
  hideStartMessage();
}

function onStart() {
  startGame();
}

startButton.addEventListener('click', onStart);
