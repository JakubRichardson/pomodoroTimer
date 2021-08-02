const root = document.documentElement;
const body = document.querySelector("body");
const clock = document.querySelector('[data-time]');
const fill = document.querySelector(".fill");

const pomodoro = document.querySelector("input[id=pomodoro]");
const shortBreak = document.querySelector("input[id=shortBreak]");
const longBreak = document.querySelector("input[id=longBreak]");

const startButton = document.querySelector(".start-stop");
const skipButton = document.querySelector(".skipButton");

class PomodoroCounter {
    constructor() {
        const pomodoroCallback = nextStepCallback(pomodoroSettings, pomodoro);
        const shortBreakCallback = nextStepCallback(shortBreakSettings, shortBreak);
        const longBreakCallback = nextStepCallback(longBreakSettings, longBreak);
        this.index = -1
        this.pomodoroSteps = [pomodoroCallback, shortBreakCallback, pomodoroCallback, shortBreakCallback, pomodoroCallback, shortBreakCallback, pomodoroCallback, longBreakCallback];
    }

    #incrementIndex() {
        this.index++;
        if (this.index === this.pomodoroSteps.length) {
            this.index = 0;
        }
    }

    get nextStep() {
        this.#incrementIndex();
        return this.pomodoroSteps[this.index];
    }

    goToPomodoro = () => {
        this.index = 0;
    }

    gotToShortBreak = () => {
        this.index = 1;
    }

    goToLongBreak = () => {
        this.index = 7;
    }
}

let TIME_LIMIT;
let timePassed;
let timeLeft;
let timerInterval = null;
const steps = new PomodoroCounter();
pomodoro.addEventListener("change", changeRadioCallback(pomodoroSettings, steps.goToPomodoro));
shortBreak.addEventListener("change", changeRadioCallback(shortBreakSettings, steps.gotToShortBreak));
longBreak.addEventListener("change", changeRadioCallback(longBreakSettings, steps.goToLongBreak));

const TIMER_COLORS = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: 0.5
    },
    alert: {
        color: "red",
        threshold: 0.2
    }
};

function pomodoroSettings() {
    body.classList.remove("shortBreak");
    body.classList.remove("longBreak");
    body.classList.add("pomodoro");
    setupTimer(25);
}

function shortBreakSettings() {
    body.classList.remove("pomodoro");
    body.classList.remove("longBreak");
    body.classList.add("shortBreak");
    setupTimer(5);
}

function longBreakSettings() {
    body.classList.remove("pomodoro");
    body.classList.remove("shortBreak");
    body.classList.add("longBreak");
    setupTimer(15);
}

function nextStepCallback(settings, button) {
    return () => {
        settings();
        button.checked = true;
    }
}

function changeRadioCallback(settings, goTo) {
    return () => {
        stop();
        settings();
        goTo();
    }
}

function setupTimer(mins) {
    // clearInterval(timerInterval);
    resetFill();
    TIME_LIMIT = mins * 60;
    timePassed = 0;
    timeLeft = TIME_LIMIT;
    setClock();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timePassed++;
        timeLeft = TIME_LIMIT - timePassed;
        setClock();
        setFill();
        setFillColor(timeLeft);

        if (timeLeft === 0) {
            stop();
            resetFill();
            steps.nextStep();
        }
    }, 1000);
}

function start() {
    startTimer();
    skipButton.classList.remove("hidden");
    startButton.textContent = "Stop";
    startButton.onclick = stop;
}

function stop() {
    clearInterval(timerInterval);
    skipButton.classList.add("hidden");
    startButton.textContent = "Start";
    startButton.onclick = start;
}

function skip() {
    stop();
    steps.nextStep();
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setClock() {
    clock.textContent = formatTime(timeLeft);
}

function setFillColor(timeLeft) {
    const { alert, warning, info } = TIMER_COLORS;
    if (timeLeft <= TIME_LIMIT * alert.threshold) {
        fill.classList.remove(warning.color);
        fill.classList.add(alert.color);
    } else if (timeLeft <= TIME_LIMIT * warning.threshold) {
        fill.classList.remove(info.color);
        fill.classList.add(warning.color);
    }
}

function setFill() {
    const timeFraction = timeLeft / TIME_LIMIT;
    root.style.setProperty("--fill", timeFraction - (1 / TIME_LIMIT) * (1 - timeFraction));
}

function resetFill() {
    const { alert, warning, info } = TIMER_COLORS;
    root.style.setProperty("--fill", 1);
    fill.classList.remove(warning.color);
    fill.classList.remove(alert.color);
    fill.classList.add(info.color);
}

steps.nextStep();

