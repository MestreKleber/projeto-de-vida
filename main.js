const storageKey = "life-stopwatch-birthdate";
const lifeExpectancyYears = 90;
const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const year = 365.2425 * day;

const birthInput = document.querySelector("#birthdate");
const saveButton = document.querySelector("#saveBirthdate");
const resetButton = document.querySelector("#resetBirthdate");
const secondsNode = document.querySelector("#secondsLived");
const minutesNode = document.querySelector("#minutesLived");
const hoursNode = document.querySelector("#hoursLived");
const daysNode = document.querySelector("#daysLived");
const weeksNode = document.querySelector("#weeksLived");
const yearsNode = document.querySelector("#yearsLived");
const breathsNode = document.querySelector("#breathsEstimate");
const beatsNode = document.querySelector("#beatsEstimate");
const progressNode = document.querySelector("#lifeProgress");
const progressTextNode = document.querySelector("#lifeProgressText");
const countDownNode = document.querySelector("#countdown");
const statusNode = document.querySelector("#statusMessage");
const ageBadgeNode = document.querySelector("#ageBadge");
const heartbeatNode = document.querySelector("#heartbeat");

function formatNumber(value, digits = 0) {
    return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

function parseDate(value) {
    if (!value) {
        return null;
    }

    const [yearPart, monthPart, dayPart] = value.split("-").map(Number);
    if (!yearPart || !monthPart || !dayPart) {
        return null;
    }

    return new Date(yearPart, monthPart - 1, dayPart, 12, 0, 0, 0);
}

function getDefaultBirthdate() {
    return localStorage.getItem(storageKey) || "1997-05-12";
}

function saveBirthdate() {
    localStorage.setItem(storageKey, birthInput.value);
    updateClock();
}

function clearBirthdate() {
    localStorage.removeItem(storageKey);
    birthInput.value = getDefaultBirthdate();
    updateClock();
}

function getNextBirthday(birthDate, now) {
    const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate(), 12, 0, 0, 0);
    if (nextBirthday < now) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }

    return nextBirthday;
}

function updateMetrics(elapsedMs, birthDate, now) {
    const totalSeconds = Math.max(0, Math.floor(elapsedMs / second));
    const totalMinutes = Math.max(0, Math.floor(elapsedMs / minute));
    const totalHours = Math.max(0, Math.floor(elapsedMs / hour));
    const totalDays = Math.max(0, Math.floor(elapsedMs / day));
    const totalWeeks = Math.max(0, Math.floor(totalDays / 7));
    const totalYears = Math.max(0, elapsedMs / year);
    const estimatedBreaths = Math.max(0, Math.floor(totalMinutes * 16));
    const estimatedBeats = Math.max(0, Math.floor(totalMinutes * 72));
    const progress = Math.min(100, Math.max(0, (elapsedMs / (lifeExpectancyYears * year)) * 100));
    const remainingMs = Math.max(0, getNextBirthday(birthDate, now) - now);
    const remainingDays = Math.ceil(remainingMs / day);

    secondsNode.textContent = formatNumber(totalSeconds);
    minutesNode.textContent = formatNumber(totalMinutes);
    hoursNode.textContent = formatNumber(totalHours);
    daysNode.textContent = formatNumber(totalDays);
    weeksNode.textContent = formatNumber(totalWeeks);
    yearsNode.textContent = formatNumber(totalYears, 2);
    breathsNode.textContent = formatNumber(estimatedBreaths);
    beatsNode.textContent = formatNumber(estimatedBeats);
    progressNode.style.setProperty("--progress", `${progress}%`);
    progressTextNode.textContent = `${formatNumber(progress, 1)}% da janela estimada de ${lifeExpectancyYears} anos`;
    countDownNode.textContent = `${remainingDays} dias ate o proximo aniversario`;
    ageBadgeNode.textContent = `${formatNumber(totalYears, 2)} anos vividos`;
    heartbeatNode.textContent = `${formatNumber(Math.max(0, Math.floor(elapsedMs / 600)))} pulsos visuais por segundo`;
}

function updateClock() {
    const birthDate = parseDate(birthInput.value);

    if (!birthDate) {
        statusNode.textContent = "Escolha uma data valida para ativar o cronometro.";
        progressTextNode.textContent = "0,0% da janela estimada de 90 anos";
        countDownNode.textContent = "Sem aniversario calculado";
        ageBadgeNode.textContent = "0,00 anos vividos";
        heartbeatNode.textContent = "0 pulsos visuais por segundo";
        [secondsNode, minutesNode, hoursNode, daysNode, weeksNode, yearsNode, breathsNode, beatsNode].forEach((node) => {
            node.textContent = "0";
        });
        progressNode.style.setProperty("--progress", "0%");
        return;
    }

    const now = new Date();
    const elapsedMs = Math.max(0, now - birthDate);
    statusNode.textContent = "Cronometro em tempo real, salvo neste navegador.";
    updateMetrics(elapsedMs, birthDate, now);
}

birthInput.value = getDefaultBirthdate();
saveButton.addEventListener("click", saveBirthdate);
resetButton.addEventListener("click", clearBirthdate);
birthInput.addEventListener("change", saveBirthdate);
birthInput.addEventListener("input", updateClock);

updateClock();
setInterval(updateClock, 1000);

