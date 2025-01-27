//DOM elem selection, userData var init
const theme = document.getElementById("theme");
const heading = document.getElementById("heading");
const tasks = document.getElementById("tasks");
const addOrEditTask = document.getElementById("create-new-task");
const createTask = document.getElementById("create-task");
const closeTask = document.getElementById("close-task");
const addTask = document.getElementById("add-task");
const taskSort = document.getElementById("task-sorting");
const taskName = document.getElementById("task-name");
const taskDate = document.getElementById("task-date");
const taskDesc = document.getElementById("task-desc");
var taskList = [], currentTaskIndex, currentTaskNumber;

//loads taskList with localStorage items & renders them in the <div>
window.onload = () => {
    heading.classList.add("load-header");
    loadTasks();
    //else clause here, remove unnecessary conditional statement at renderTasks()?
    renderTasks();
}

//displays modal add task window
addTask.addEventListener('click', function() {
    addOrEditTask.showModal()
});

closeTask.addEventListener('click', function() { 
    addOrEditTask.close();
})

//does custom DOM elem creation && info storage in array 
createTask.addEventListener('click', () => {
    if (taskName.value !== "" && taskDate.value !== "") { 
        if (currentTaskNumber != null && currentTaskIndex != null) { 
            taskList[currentTaskIndex] = {id: `task-${currentTaskNumber}-${taskDate.value}`, date: taskDate.value, name: taskName.value, description: taskDesc.value};
        } else { 
            taskList.unshift({id: `task-${taskList.length}-${taskDate.value}`, date: taskDate.value, name: taskName.value, description: taskDesc.value});
        }
        onTaskClose();
        clearEdits();
        renderTasks();
        addOrEditTask.close();
    } else { 
        alert('You must write out a task and its due date before displaying it');
    }
})

//reads the event from the dropdown to call a sorting algorithm
taskSort.addEventListener("change", (event) => { 
    switch (event.target.value) { 
        case "sort-abc": 
            sortABC();
            break;
        case "sort-newest":
            sortNewest();
            break;
        case "sort-oldest":
            sortOldest();
            break;
        case "sort-reverse-abc":
            sortABCReverse();
            break;
        case "sort-completed":
            sortCompleted();
            break;
        case "sort-deleted":
            sortDeleted();
            break;
    }
})
//transfer an array across a different object, removing its original copy
tasks.addEventListener("change", (e) => { 
    e.target.parentElement.parentElement.classList.add("complete-animation");
    const taskIndex = taskList.findIndex((task) => task.id == e.target.parentElement.id);
    taskList.splice(taskIndex, 1);
    renderTasks();
});

//sorts taskList into a-z order
function sortABC() { 
    taskList.sort((a,b)=>{if (a.name < b.name) return -1; else return 1});
    console.log(taskList);
    renderTasks();
}
//sorts taskList in z-a order
function sortABCReverse() { 
    taskList.sort((a,b)=>{if (a.name<b.name) return 1; else return -1});
    renderTasks();
}
//sorts taskList in newest order
function sortNewest() { 
    taskList.sort((a,b)=>{if (a.date<b.date) return 1; else return -1});
    renderTasks();
}
//sorts taskList in oldest order
function sortOldest() { 
    taskList.sort((a,b) => {if (a.date<b.date) return -1; else return 1});
    renderTasks();
}
const deleteSelector = () => { 
    const deletes = document.querySelectorAll(`a[class="delete"]`);
    for (let i of deletes) { 
        i.addEventListener("click", function() { 
            let index = taskList.findIndex((a) => a.id == i.parentElement.id);
            taskList.splice(index, 1);
            renderTasks();
})}}
const editSelector = () => { 
    const edits = document.querySelectorAll(`a[class="edit"]`);
    // for (let g of edits) { 
        edits.forEach((icon) => 
        icon.addEventListener("click", function() { 
            createTask.value = "Done";
            addOrEditTask.showModal();
            currentTaskIndex = taskList.findIndex((a) => a.id == icon.parentElement.id);
            currentTaskNumber = icon.parentElement.id.split("-")[1];
            taskName.value = `${taskList[currentTaskIndex]["name"]}`;
            taskDate.value = `${taskList[currentTaskIndex]["date"]}`;
            taskDesc.value = `${taskList[currentTaskIndex]["description"]}`;
}))}

const onTaskClose = () => { 
    createTask.value = "Create New Task";
    currentTaskIndex = null;
    currentTaskNumber = null;
}

//after updating/creating an element, clears the modal values
function clearEdits() { 
    taskName.value = ""; taskDate.value = ""; taskDesc.value = "";
}
//event selector for theme
theme.addEventListener("change", function(e) { 
    switch(e.target.value) { 
        case "bw": 
            themeChange("black", "darkgrey");
            break;
        case "default": 
            themeChange("red", "white");
            break;
    }
})
const themeChange = (textColor, bgColor) => { 
    // console.log("call: ", textColor, " ", bgColor);
    document.querySelector('div[class="container"]').style.backgroundColor = `${textColor}`;
    document.querySelectorAll(' ul').style.backgroundColor = `${textColor}`;
    document.querySelector('body').style.backgroundColor = `${bgColor}`;
    let xcircle = document.querySelectorAll('a[class="delete"]');
    for (let item in xcircle) { 
        xcircle[item].innerHTML = `<svg style="color: ${bgColor}" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" fill="red"></path> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="red"></path> </svg>`
    }
}
//lays out properties from objects within array
function renderTasks() {
    tasks.innerHTML = "";
    for (const {id, date, name, description} of taskList) {
        tasks.innerHTML += `
        <li class="deletable">
        <button class="hover" type="button" id="${id}">
            <input type="checkbox"><label class="task-text">${name}</label>
            <a class="edit">
                <svg style="color: rgb(243, 185, 57);" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"> <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" fill="#f3b939"></path> <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" fill="#f3b939"></path> </svg>
            </a>
            <a class="delete">
                <svg style="color: black" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" fill="black"></path> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="black"></path> </svg>
            </a>
            <div>Date: ${date}</div>
            <div>Description: ${description}</div>
            <hr>
        </button>
        </li>
        `;
    }
    deleteSelector();
    editSelector();
    saveTasks();
}
const saveTasks = () => { 
    localStorage.clear();
    taskList.map((task) => localStorage.setItem(task.id.split("-")[1], JSON.stringify(task)));
}
const loadTasks = () => { 
    for (let n = 0; n < localStorage.length; n++) { 
        taskList.push(JSON.parse(localStorage.getItem(String(n))));
}}

//having ADHD and working with things in your short term memory feels like you're a visitor in a new country trying to constantly read a train route on a crowded subway station in Shinuku, Tokyo
//re-editing your old code to make it functional feels like moonwalking in an art gallery while blindfolded

//bug 2: editing a task desc and clicking done produces a new undefined task and modifies the original to undefined
    //cause: 2 eventListeners: one global and one nested within the edit eventListener
    //fix: making sure input parameters are for taskName, Date, and Desc, not for the other one
//bug 3: editing a task and clicking done creates a new copy of the same task
    //fix: addEventListener will stack new function calls every time you click the button, so don't call it multiple times
//bug 4: cannot destructure ID from taskList object + taskList.length is undefined on createTask event listener
    //causes & fix: initializing currentTaskIndex & currentTaskNumber == undefined, but undefined loosely equals null, not strictly
//bug 5: to-do list items are not being strikethroughed when checked
//bug 6: localStorage not saving/loading stored files 
    //causes: renderTasks() call
    //fix: syntactical bugs
//bug 7: <dialog> element not closing 
    //fix: .close() method below renderTasks() call, push your most bug-prone f(x) to bottom
