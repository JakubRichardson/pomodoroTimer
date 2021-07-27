const root = document.documentElement;
const body = document.querySelector("body");
const clock = document.querySelector('[data-time]');
const fill = document.querySelector(".fill");

document.querySelector("input[id=pomodoro]").addEventListener("change", pomodoroSettings)
document.querySelector("input[id=shortBreak]").addEventListener("change", shortBreakSettings)
document.querySelector("input[id=longBreak]").addEventListener("change", longBreakSettings)

const TIME_LIMIT = 25 * 60;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
// let remainingPathColor = COLOR_CODES.info.color;

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
    console.log("Pomodoro: 25 min")
}

function shortBreakSettings() {
    body.classList.remove("pomodoro");
    body.classList.remove("longBreak");
    body.classList.add("shortBreak");
    console.log("Short break: 5 min")
}

function longBreakSettings() {
    body.classList.remove("pomodoro");
    body.classList.remove("shortBreak");
    body.classList.add("longBreak");
    console.log("Long break: 15 min")
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

setClock();

