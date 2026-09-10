/* ==================================================
   1. 首页时钟
   ================================================== */

/*
   我们先找到首页右上角的时间元素。

   document.getElementById("time")
   = 在 HTML 中寻找：

   id="time"

   注意：
   Todo 页面没有这个元素。

   所以我们需要先判断它是否存在。
*/

function updateTime() {

    const timeElement =
        document.getElementById("time");


    /*
       如果当前页面没有 id="time"，
       就什么都不做。

       这样 Todo / About / Projects 等页面
       也可以安全使用同一个 app.js。
    */

    if (!timeElement) {
        return;
    }


    /*
       获取当前电脑时间
    */

    const now = new Date();


    /*
       获取小时

       例如：
       9 → "09"
       15 → "15"
    */

    const hours =
        String(now.getHours()).padStart(2, "0");


    /*
       获取分钟

       例如：
       5 → "05"
    */

    const minutes =
        String(now.getMinutes()).padStart(2, "0");


    /*
       把时间放进 HTML

       最终显示：

       09:35
    */

    timeElement.textContent =
        `${hours}:${minutes}`;
}


/*
   页面打开的时候立即更新时间
*/

updateTime();


/*
   每隔 1 秒更新一次

   这样首页的时间就会一直走。
*/

setInterval(
    updateTime,
    1000
);



/* ==================================================
   2. Todo 页面
   ================================================== */

/*
   下面这些代码只会在 Todo 页面真正工作。

   因为其他页面没有：

   taskInput
   addTaskButton
   taskList

   我们会先检查它们是否存在。
*/


const taskInput =
    document.getElementById("taskInput");


const addTaskButton =
    document.getElementById("addTaskButton");


const taskList =
    document.getElementById("taskList");



/*
   如果当前页面不是 Todo 页面，
   那么直接结束 Todo 部分。

   这样：

   Home
   About
   Projects
   Journal
   Travel
   Learning

   都不会出问题。
*/

if (
    taskInput &&
    addTaskButton &&
    taskList
) {


    /* ==================================================
       3. 从 localStorage 读取任务
       ================================================== */

    /*
       localStorage
       = 浏览器提供的本地储存空间。

       我们把 Todo 保存在那里。

       所以：

       添加任务
          ↓
       保存到浏览器
          ↓
       刷新页面
          ↓
       任务仍然存在
    */


    let tasks =
        JSON.parse(
            localStorage.getItem(
                "nereacodeTasks"
            )
        ) || [];



    /* ==================================================
       4. 保存任务
       ================================================== */

    function saveTasks() {

        /*
           localStorage 只能保存字符串。

           JSON.stringify()
           = 把 JavaScript 数组转换成字符串。
        */

        localStorage.setItem(
            "nereacodeTasks",
            JSON.stringify(tasks)
        );
    }



    /* ==================================================
       5. 显示所有任务
       ================================================== */

    function renderTasks() {

        /*
           每次重新显示任务之前，
           先清空原来的列表。

           否则任务会重复出现。
        */

        taskList.innerHTML = "";


        /*
           遍历 tasks 数组。

           每一个 task 都创建一个 <li>。
        */

        tasks.forEach(function (task) {


            /*
               创建一个新的列表项目

               <li>
            */

            const li =
                document.createElement("li");


            /*
               给它添加 CSS class

               class="task"
            */

            li.className = "task";


            /*
               创建这个 Todo 的 HTML。

               checkbox
               任务文字
               Edit
               Delete
            */

            li.innerHTML = `

                <div class="task-content">

                    <input
                        type="checkbox"
                        class="complete-checkbox"
                        ${task.completed ? "checked" : ""}
                    >

                    <span>
                        ${task.text}
                    </span>

                </div>


                <div class="task-actions">

                    <button class="edit-button">
                        Edit
                    </button>

                    <button class="delete-button">
                        Delete
                    </button>

                </div>

            `;


            /* ==================================================
               6. 已完成任务的视觉效果
               ================================================== */

            /*
               如果 completed = true

               就让文字：

               删除线
               + 半透明
            */

            if (task.completed) {

                li.style.textDecoration =
                    "line-through";

                li.style.opacity =
                    "0.5";
            }



            /* ==================================================
               7. Checkbox
               ================================================== */

            const checkbox =
                li.querySelector(
                    ".complete-checkbox"
                );


            /*
               用户点击 checkbox 时触发。
            */

            checkbox.addEventListener(
                "change",
                function () {


                    /*
                       把任务状态改成：

                       true
                       或
                       false
                    */

                    task.completed =
                        checkbox.checked;


                    /*
                       保存到浏览器
                    */

                    saveTasks();


                    /*
                       重新显示列表
                    */

                    renderTasks();
                }
            );



            /* ==================================================
               8. Edit 按钮
               ================================================== */

            const editButton =
                li.querySelector(
                    ".edit-button"
                );


            editButton.addEventListener(
                "click",
                function () {


                    /*
                       prompt()
                       = 弹出一个输入框。

                       第二个参数是原来的任务内容。
                    */

                    const newText =
                        prompt(
                            "Edit your task:",
                            task.text
                        );


                    /*
                       用户点击 Cancel

                       newText 会是 null。
                    */

                    if (newText === null) {
                        return;
                    }


                    /*
                       trim()
                       = 删除文字前后的空格。
                    */

                    const trimmedText =
                        newText.trim();


                    /*
                       如果用户什么都没输入，
                       就不修改。
                    */

                    if (trimmedText === "") {
                        return;
                    }


                    /*
                       更新任务文字
                    */

                    task.text =
                        trimmedText;


                    /*
                       保存
                    */

                    saveTasks();


                    /*
                       重新显示
                    */

                    renderTasks();
                }
            );



            /* ==================================================
               9. Delete 按钮
               ================================================== */

            const deleteButton =
                li.querySelector(
                    ".delete-button"
                );


            deleteButton.addEventListener(
                "click",
                function () {


                    /*
                       filter()
                       = 从数组中过滤掉某个任务。

                       保留：

                       id !== 当前任务 id

                       删除：

                       id === 当前任务 id
                    */

                    tasks =
                        tasks.filter(
                            function (item) {

                                return (
                                    item.id !== task.id
                                );

                            }
                        );


                    /*
                       保存新的任务列表
                    */

                    saveTasks();


                    /*
                       重新显示
                    */

                    renderTasks();
                }
            );


            /*
               最后把这个 li
               放进 <ul id="taskList">
            */

            taskList.appendChild(li);

        });
    }



    /* ==================================================
       10. 添加任务
       ================================================== */

    function addTask() {


        /*
           获取输入框中的文字。

           trim()
           可以去掉前后空格。
        */

        const taskText =
            taskInput.value.trim();


        /*
           如果没有输入任何内容，
           就不添加。
        */

        if (taskText === "") {
            return;
        }


        /*
           创建一个新的任务对象。

           id
           = 每个任务的身份证号码

           text
           = 任务内容

           completed
           = 是否完成
        */

        const newTask = {

            id: Date.now(),

            text: taskText,

            completed: false
        };


        /*
           把新任务放进 tasks 数组
        */

        tasks.push(newTask);


        /*
           保存
        */

        saveTasks();


        /*
           重新显示
        */

        renderTasks();


        /*
           添加完成之后，
           清空输入框。
        */

        taskInput.value = "";
    }



    /* ==================================================
       11. 点击 Add
       ================================================== */

    addTaskButton.addEventListener(
        "click",
        function () {

            addTask();

        }
    );



    /* ==================================================
       12. 按 Enter 添加
       ================================================== */

    taskInput.addEventListener(
        "keydown",
        function (event) {


            /*
               如果按的是 Enter
            */

            if (event.key === "Enter") {

                addTask();

            }

        }
    );



    /* ==================================================
       13. 页面打开时显示已有任务
       ================================================== */

    /*
       如果之前已经保存过 Todo，

       就把它们重新显示出来。
    */

    renderTasks();

}