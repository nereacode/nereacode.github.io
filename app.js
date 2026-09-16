/* ==========================================================
   NereaCode — shared behaviour
   1. Home clock
   2. Todo list (saved in localStorage)
   3. Photo lightbox
   4. Gentle reveal-on-scroll
   5. Journey map stops
   ========================================================== */

/* ---------- 1. Home clock ---------- */

function updateTime() {
    const timeElement = document.getElementById("time");
    if (!timeElement) { return; }
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    timeElement.textContent = hours + ":" + minutes;
}

updateTime();
setInterval(updateTime, 1000);


/* ---------- 2. Todo page ---------- */

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");

if (taskInput && addTaskButton && taskList) {

    let tasks = JSON.parse(localStorage.getItem("nereacodeTasks")) || [];

    function saveTasks() {
        localStorage.setItem("nereacodeTasks", JSON.stringify(tasks));
    }

    function renderEmptyState() {
        const empty = document.querySelector(".todo-empty");
        if (empty) { empty.style.display = tasks.length ? "none" : "block"; }
    }

    function renderTasks() {
        taskList.innerHTML = "";

        tasks.forEach(function (task) {
            const li = document.createElement("li");
            li.className = "task" + (task.completed ? " completed" : "");

            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="complete-checkbox"
                        ${task.completed ? "checked" : ""}>
                    <span></span>
                </div>
                <div class="task-actions">
                    <button class="edit-button">Edit</button>
                    <button class="delete-button">Delete</button>
                </div>
            `;

            /* text goes in via textContent so typed HTML stays harmless */
            li.querySelector(".task-content span").textContent = task.text;

            li.querySelector(".complete-checkbox")
                .addEventListener("change", function () {
                    task.completed = this.checked;
                    saveTasks();
                    renderTasks();
                });

            li.querySelector(".edit-button")
                .addEventListener("click", function () {
                    const next = prompt("Edit this task:", task.text);
                    if (next !== null && next.trim() !== "") {
                        task.text = next.trim();
                        saveTasks();
                        renderTasks();
                    }
                });

            li.querySelector(".delete-button")
                .addEventListener("click", function () {
                    tasks = tasks.filter(function (t) { return t.id !== task.id; });
                    saveTasks();
                    renderTasks();
                });

            taskList.appendChild(li);
        });

        renderEmptyState();
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === "") { return; }
        tasks.push({ id: Date.now(), text: taskText, completed: false });
        saveTasks();
        renderTasks();
        taskInput.value = "";
        taskInput.focus();
    }

    addTaskButton.addEventListener("click", addTask);
    taskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") { addTask(); }
    });

    renderTasks();
}


/* ---------- 3. Photo lightbox ---------- */

(function () {
    const shots = document.querySelectorAll("[data-full]");
    if (!shots.length) { return; }

    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `
        <figure>
            <img alt="">
            <figcaption></figcaption>
            <button class="lightbox-close" aria-label="Close">✕</button>
        </figure>
    `;
    document.body.appendChild(box);

    const img = box.querySelector("img");
    const cap = box.querySelector("figcaption");

    function open(full, caption) {
        img.src = full;
        img.alt = caption || "";
        cap.textContent = caption || "";
        box.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function close() {
        box.classList.remove("open");
        document.body.style.overflow = "";
    }

    shots.forEach(function (shot) {
        shot.addEventListener("click", function () {
            open(shot.getAttribute("data-full"), shot.getAttribute("data-caption"));
        });
    });

    box.addEventListener("click", function (event) {
        if (event.target === box || event.target.classList.contains("lightbox-close")) {
            close();
        }
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") { close(); }
    });
})();


/* ---------- 4. Reveal on scroll ---------- */

(function () {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) { return; }
    if (!("IntersectionObserver" in window)) {
        items.forEach(function (el) { el.classList.add("in"); });
        return;
    }
    const watcher = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("in");
                watcher.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    items.forEach(function (el) { watcher.observe(el); });
})();


/* ---------- 5. Journey map stops ---------- */

document.querySelectorAll(".map-stop").forEach(function (stop) {
    stop.addEventListener("click", function () {
        const target = document.getElementById(stop.getAttribute("data-target"));
        if (target) { target.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
});


/* 自动把 data-place 放到胶带上 */
document.querySelectorAll('.polaroid[data-place]').forEach(function (fig) {
    if (fig.querySelector('.tape-label')) return;
    var span = document.createElement('span');
    span.className = 'tape-label';
    span.textContent = fig.getAttribute('data-place');
    fig.insertBefore(span, fig.firstChild);
});