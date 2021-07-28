const root = document.documentElement;
const body = document.querySelector("body");
const clock = document.querySelector('[data-time]');
const fill = document.querySelector(".fill");

const pomodoro = document.querySelector("input[id=pomodoro]");
pomodoro.addEventListener("change", pomodoroSettings);
const shortBreak = document.querySelector("input[id=shortBreak]");
shortBreak.addEventListener("change", shortBreakSettings);
const longBreak = document.querySelector("input[id=longBreak]");
longBreak.addEventListener("change", longBreakSettings);

class PomodoroCounter {
    constructor() {
        const pomodoroCallback = changeRadioCallback(pomodoroSettings, pomodoro);
        const shortBreakCallback = changeRadioCallback(shortBreakSettings, shortBreak);
        const longBreakCallback = changeRadioCallback(longBreakSettings, longBreak);
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
}

let TIME_LIMIT;
let timePassed;
let timeLeft;
let timerInterval = null;
const steps = new PomodoroCounter();

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
    setupTimer(25)
}

function shortBreakSettings() {
    body.classList.remove("pomodoro");
    body.classList.remove("longBreak");
    body.classList.add("shortBreak");
    setupTimer(5)
}

function longBreakSettings() {
    body.classList.remove("pomodoro");
    body.classList.remove("shortBreak");
    body.classList.add("longBreak");
    setupTimer(15)
}

function changeRadioCallback(settings, button) {
    return () => {
        settings()
        button.checked = true;
    }
}

function setupTimer(mins) {
    TIME_LIMIT = mins;
    timePassed = 0;
    timeLeft = TIME_LIMIT;
    timesUp();
    setClock();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        setClock();
        setFill();
        setFillColor(timeLeft);

        if (timeLeft === 0) {
            timesUp();
            steps.nextStep();
        }
    }, 1000);
}

function timesUp() {
    clearInterval(timerInterval);
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
    root.style.setProperty("--fill", timeFraction);
}

steps.nextStep();

// TODO
// Start stop buttons
// colors fill animation