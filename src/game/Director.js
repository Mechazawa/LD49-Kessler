import game from './index';
import launchCoordinates from '../assets/launch-coordinates.json';
import Satellite1 from './entities/Satellite1';
import Satellite2 from './entities/Satellite2';
import Satellite3 from './entities/Satellite3';
import Sputnik from './entities/Sputnik';
import { randInt, randomPick } from '../utils';
import texts from '../assets/text.json';
import entityStore from './EntityStore';
import Satellite from './entities/Satellite';

export default class Director {
  timeElapsed = 0;

  lastEvent = 0;

  interval = 13;

  eventChance = 0.8;

  gameOver = false;

  score = 0;

  timers = [
    [0, () => window.news.add({
      title: 'Space Race Begins',
      image: 'images/photo-positive.svg',
      value: 'Starburst IX launches their first satellite "[satellite]"',
    })],
    [0, () => entityStore.add(new Satellite1(...randomPick(launchCoordinates), 15)).moveToSafeCoordinates()],
    [0, () => this.launch()],
    [0, () => this.launch()],
    [20, () => window.news.add({
      title: 'Population Growth',
      value: 'Starburst IX just got their 500.000th Margobian.',
    })],
    [50, () => window.news.add({
      title: 'Population Growth',
      value: 'Starburst IX just got their 1.000.000th Margobian.',
    })],
    [200, () => window.news.add({
      title: 'Population Growth',
      value: 'Starburst IX just got their 5.000.000th Margobian.',
    })],
    [300, () => window.news.add({
      title: 'Population Growth',
      value: 'Starburst IX just got their 10.000.000th Margobian.',
    })],
    [240, () => window.news.add({
      title: 'Enviromental Report',
      value: 'Air is becoming increasingly difficult to breath due to smog, [state] is starting new research in usage of farts to combat smog.',
    })],
    [50, () => window.news.add({
      title: 'Enviromental Report',
      value: 'Half of starburst IX is sour water, [state] has started the first research to find life in the ocean.',
    })],
  ];

  tick (delta) {
    this.timeElapsed += delta * (1 / game.ticker.speed / 60);

    // random event
    if (this.timeElapsed - this.lastEvent > this.interval) {
      this.lastEvent = this.timeElapsed;

      if (Math.random() <= this.eventChance) {
        this.nextEvent();
      }

      this.score += Math.round(randInt(0, entityStore.getEntitiesForType(Satellite).size * 100)) + entityStore.getEntitiesForType(Satellite).size * 30;
    }

    // timers
    for (const timer of this.timers) {
      if (timer[0] < 0) continue;

      if (timer[0] < this.timeElapsed) {
        timer[0] = -1;
        timer[1].call(this);
      }
    }

    // game over
    this.gameOver = entityStore.getEntitiesForType(Satellite).size === 0;

    if (this.gameOver) {
      game.paused = true;
    }
  }

  nextEvent () {
    const pick = Math.random();

    if (pick < 0.1) {
      this.news();
    } else if (pick < 0.4) {
      this.launchWithNews();
    } else if (pick < 0.5)  {
      this.launch();
      this.launch();
    } else  {
      this.launch();
    }
  }

  news () {
    window.news.add(randomPick(texts.news));
  }

  launch () {
    const points = 5 + this.timeElapsed / 15;
    const Constructor = randomPick([
      Satellite1,
      Satellite1,
      Satellite2,
      Satellite2,
      Satellite3,
      Satellite3,
      Sputnik,
    ]);

    const satellite = new Constructor(...randomPick(launchCoordinates), points);

    entityStore.add(satellite);
    satellite.moveToSafeCoordinates(Math.max(160, Math.round(300 - this.timeElapsed / 15)));

    this.score += Math.round(Math.random() * points * 10) + 1000;

    return satellite;
  }

  launchWithNews () {
    // add news about rocket
    // todo related new
    this.launch();
    this.news();
  }
}

