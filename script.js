let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
const alarm = document.getElementById("alarmSound");

function saveReminders() {
    localStorage.setItem("reminders", JSON.stringify(reminders));
}

function addReminder() {
    const time = document.getElementById("timeInput").value;
    const repeat = document.getElementById("repeatDaily").checked;

    if (!time) {
        alert("Please select time!");
        return;
    }

    reminders.push({ time, repeat });
    saveReminders();
    displayReminders();
}

function deleteReminder(index) {
    reminders.splice(index, 1);
    saveReminders();
    displayReminders();
}

function displayReminders() {
    const list = document.getElementById("reminderList");
    list.innerHTML = "";

    reminders.forEach((reminder, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            📖 ${reminder.time} ${reminder.repeat ? "(Daily)" : ""}
            <button class="deleteBtn" onclick="deleteReminder(${index})">X</button>
        `;
        list.appendChild(li);
    });
}

function checkReminder() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0,5);

    reminders.forEach((reminder, index) => {
        if (reminder.time === currentTime) {
            triggerReminder(reminder, index);
        }
    });

    updateCountdown();
}

function triggerReminder(reminder, index) {
    showNotification();
    alarm.play();

    if (!reminder.repeat) {
        deleteReminder(index);
    }
}

function showNotification() {
    if (Notification.permission === "granted") {
        new Notification("📚 Time to Study!");
    } else {
        Notification.requestPermission();
        alert("📚 Time to Study!");
    }
}

function updateCountdown() {
    if (reminders.length === 0) {
        document.getElementById("countdown").innerText = "No active reminder";
        return;
    }

    const now = new Date();
    let nextTime = null;

    reminders.forEach(r => {
        const [hour, min] = r.time.split(":");
        const reminderDate = new Date();
        reminderDate.setHours(hour, min, 0);

        if (reminderDate < now) reminderDate.setDate(reminderDate.getDate() + 1);

        if (!nextTime || reminderDate < nextTime) {
            nextTime = reminderDate;
        }
    });

    const diff = nextTime - now;
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    document.getElementById("countdown").innerText =
        `Next Reminder in ${hrs}h ${mins}m ${secs}s`;
}

setInterval(checkReminder, 1000);
displayReminders();
