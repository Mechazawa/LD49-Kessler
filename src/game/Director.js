import game from './index';
import launchCoordinates from '../assets/launch-coordinates.json';
import Satellite1 from './entities/Satellite1';
import Satellite2 from './entities/Satellite2';
import Satellite3 from './entities/Satellite3';
import Sputnik from './entities/Sputnik';
import { randomPick } from '../utils';
import texts from '../assets/text.json';
import entityStore from './EntityStore';

export default class Director {
  timeElapsed = 0;

  lastEvent = 0;

  interval = 20;

  eventChance = 0.8;

  gameOver = false;

  timers = [
    [0, () => window.news.add({
      title: 'Space Race Begins',
      value: 'Starburst IX launches their first satellite "[satellite]"',
    })],
    [0, () => entityStore.add(new Satellite1(...randomPick(launchCoordinates), 15)).moveToSafeCoordinates()],
    [20, () => window.news.add({
      title: 'Population Growth',
      value: 'Starburst IX just got their 10.000th Margobian.',
    })],
    [50, () => window.news.add({
      title: 'Population Growth',
      value: 'Starburst IX just got their 50.000th Margobian.',
    })],
    [90, () => window.news.add({
      title: 'Population Growth',
      value: 'Starburst IX just got their 100.000th Margobian.',
    })],
    [160, () => window.news.add({
      title: 'Population Growth',
      value: 'Starburst IX just got their 500.000th Margobian.',
    })],
    [250, () => window.news.add({
      title: 'Population Growth',
      value: 'Starburst IX just got their 1.000.000th Margobian.',
    })],
    [200, () => window.news.add({
      title: 'Enviromental Report',
      value: 'Air is becoming increasingly difficult to breath due to smog, [state] is starting new research in usage of farts to combat smog.',
    })],
    [120, () => window.news.add({
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
    }

    //
    for (const timer of this.timers) {
      if (timer[0] < 0) continue;

      if (timer[0] < this.timeElapsed) {
        timer[0] = -1;
        timer[1].call(this);
      }
    }
  }

  nextEvent () {
    const pick = Math.random();

    if (pick < 0.3) {
      this.news();
    } else if (pick < 0.6) {
      this.launchWithNews();
    } else {
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

    entityStore.add(satellite)
    satellite.moveToSafeCoordinates();

    return satellite;
  }

  launchWithNews () {
    // add news about rocket
    // todo related new
    this.launch();
    this.news();
  }
}

