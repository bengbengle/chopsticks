import { defaultLogger, truncate } from './logger'

const logger = defaultLogger.child({ name: 'timer-mining' })

const enum TimerState {
  STOP,
  RUNNING,
}

export class Timer {
  
  #state = TimerState.STOP;
  #timeout: NodeJS.Timeout | null = null;
  #interval: number;

  #mineFunc: () => any;

  constructor(interval: number, _mineFunc: () => Promise<void> ) {
    this._validateInterval(interval);

    this.#interval = interval;

    this.#mineFunc = _mineFunc;
  }

  get interval(): number {
    return this.#interval;
  }

  get enabled(): boolean {
    return this.#interval !== 0;
  }

  get state(): TimerState {
    return this.#state
  }

  public setInterval(interval: number): void {
    this._validateInterval(interval);

    if (interval === 0) {
      this.stop();
      return;
    }

    if (this.#state === TimerState.RUNNING) {
      this.stop();
    }

    this.#interval = interval;

    this.start();
  }

  public start(): void {
    if (this.#state === TimerState.RUNNING || !this.enabled ) {
      return;
    }

    this.#state = TimerState.RUNNING;
    logger.info({time: new Date().toISOString() }, `Timer Mining Start: #${ new Date().toISOString() }`);

    this.#timeout = setTimeout(() => this._loop(), this.#interval);
  }

  public stop(): void {
    if (this.#state === TimerState.STOP) {
      return;
    }

    this.#state = TimerState.STOP;

    logger.info({time: new Date().toISOString() }, `Timer Stop at time: #${ new Date().toISOString() }`);

    if (this.#timeout !== null) {
      clearTimeout(this.#timeout);
    }
  }

  private _validateInterval(interval: number) {
    if (interval < 0) {
      throw new Error("Block time cannot be negative");
    }
  }

  private async _loop() {
    if (this.#state === TimerState.STOP) return;
    this.#timeout = setTimeout(() => this._loop(), this.interval);  

    await this.#mineFunc();
  }
}
