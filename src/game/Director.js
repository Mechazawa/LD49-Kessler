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
import CometMoon from './entities/CometMoon';

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
    [0, () => entityStore.add(new Satellite3(...randomPick(launchCoordinates), 15, 0)).moveToSafeCoordinates()],
    [0, () => entityStore.add(new Satellite1(...randomPick(launchCoordinates), 15, 0)).moveToSafeCoordinates()],
    ...texts.population.map((amount, i) => [i * 120, () => window.news.add({
      title: 'Population Growth',
      value: `The population of Starburst IX grew to ${amount}`,
    })]),
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

      if (Math.random() <= this.eventChance || this.getSatCount() <= 2) {
        this.nextEvent();
      }

      this.score += Math.round(randInt(0, this.getSatCount() * 100)) + entityStore.getEntitiesForType(Satellite).size * 30;
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
    this.gameOver = this.getSatCount() === 0;

    if (this.gameOver) {
      game.paused = true;
    }
  }

  nextEvent () {
    const pick = Math.random();

    if (pick < 0.1 && this.getSatCount() > 3) {
      this.news();
    } else if (pick < 0.3) {
      this.launchWithNews();
    } else if (pick < 0.4) {
      this.launch();
      this.launch();
    } else if (pick < 0.9) {
      this.launch();
    } else {
      this.comet();
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

  getSatCount () {
    return entityStore.getEntitiesForType(Satellite).size;
  }

  comet () {
    const spawnPoints = [
      [995, 445, 0.9, -0.6],
      [995, 245, 0.3, 0.6],
      [10, 145, -0.3, -0.6],
      [10, 745, -0.9, 1.3],
    ];

    entityStore.add(new CometMoon(...randomPick(spawnPoints)));
  }
}

