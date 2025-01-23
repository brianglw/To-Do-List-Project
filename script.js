
//bug 2: editing a task desc and clicking done produces a new undefined task and modifies the original to undefined
    //cause: 2 eventListeners: one global and one nested within the edit eventListener
    //fix: making sure input parameters are for taskName, Date, and Desc, not for the other one
//bug 3: editing a task and clicking done creates a new copy of the same task
    //fix: addEventListener will stack new function calls every time you click the button, so don't call it multiple times
//bug 4: cannot destructure ID from taskList object + taskList.length is undefined on createTask event listener
    //causes & fix: initializing currentTaskIndex & currentTaskNumber == undefined, but undefined loosely equals null, not strictly
//bug 5: to-do list items are not being strikethroughed when checked
    //

//DOM initialization
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

//storage for sort algorithms and localStorage
var taskList = [];
var currentTaskIndex;
var currentTaskNumber;

window.onload = () => {
    heading.classList.add("load-header");
    for (let n = 0; n < localStorage.length; n++) { 
        taskList.push(JSON.parse(localStorage.getItem(n)));
    }
    if (taskList == false) {
        taskList = [];
    }
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
        // console.log('currentTaskNumber ', currentTaskNumber);
        // console.log('currentTaskIndex ', currentTaskIndex);
        if (currentTaskNumber != null && currentTaskIndex != null) { 
            taskList[currentTaskIndex] = {id: `task-${currentTaskNumber}-${taskDate.value}`, date: taskDate.value, name: taskName.value, description: taskDesc.value};
        } else { 
            // console.log('taskList.length', taskList.length);
            taskList.unshift({id: `task-${taskList.length}-${taskDate.value}`, date: taskDate.value, name: taskName.value, description: taskDesc.value});
        }
        clearEdits();
        renderTasks();
        addOrEditTask.close();
    } else { 
        alert('You must write out a task and its due date before displaying it');
    }
})

//transfer an array across a different object, removing its original copy
tasks.addEventListener("change", (e) => { 
    e.target.parentElement.parentElement.classList.add("complete-animation");
    const taskIndex = taskList.findIndex((task) => task.id == e.target.parentElement.id);
    taskList.splice(taskIndex, 1);
    renderTasks();
});

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
//re-editing your old code to make it functional feels like moonwalking in an art gallery while blindfolded

//lays out properties from objects within array
function renderTasks() {
    tasks.innerHTML = "";
    if (taskList == false) {

    } else { 
    for (const {id, date, name, description} of taskList) {
        tasks.innerHTML += `
        <li class="deletable">
        <button class="hover" type="button" id="${id}">
            <input type="checkbox"><label class="task-text">${name}</label>
            <a class="edit">
                <svg style="color: rgb(243, 185, 57);" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"> 
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" 
                fill="#f3b939"></path> <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" 
                fill="#f3b939"></path> </svg>
            </a>
            <a class="delete">
                <svg style="color: black" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" fill="black"></path> 
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="black"></path> </svg>
            </a>
            <div>Date: ${date}</div>
            <div>Description: ${description}</div>
            <hr>
        </button>
        </li>
        `;
        }
    }
    deleteOrEditSelector();
    // updateHovers();
    localStorage.clear();
    for (const task in list) { 
        localStorage.setItem(task, JSON.stringify(list[task]));
    }
}
//sorts taskList into a-z order
function sortABC() { 
    taskList.sort((a,b) => {
        if (a["name"] < b["name"]) { 
            return -1;
        } else { 
            return 1;
        }
    });
    renderTasks();
}
//sorts taskList in z-a order
function sortABCReverse() { 
    taskList.sort((a,b) => {
        if (a["name"] < b["name"]) { 
            return 1;
        } else { 
            return -1;
        }
    });
    renderTasks();
}
//sorts taskList in newest order
function sortNewest() { 
    taskList.sort((a,b) => { 
        if (a["date"] < b["date"]) { 
            return -1;
        } else { 
            return 1;
        }
    });
    renderTasks();
}
//sorts taskList in oldest order
function sortOldest() { 
    taskList.sort((a,b) => { 
        if (a["date"] < b["date"]) { 
            return 1;
        } else { 
            return -1;
        }
    });
    renderTasks();
}

function deleteOrEditSelector() {
    const deletes = document.querySelectorAll(`a[class="delete"]`);
    for (let i of deletes) { 
        i.addEventListener("click", function() { 
            let index = taskList.findIndex((a) => a.id == i.parentElement.id);
            // deletedTaskList.push(taskList[index]);
            taskList.splice(index, 1);
            renderTasks();
        })
    }
    const edits = document.querySelectorAll(`a[class="edit"]`);
    for (let g of edits) { 
        g.addEventListener("click", function() { 
            createTask.value = "Done";
            addOrEditTask.showModal();
            currentTaskIndex = taskList.findIndex((a) => a.id == g.parentElement.id);
            console.log("first assignment of currentTaskIndex", currentTaskIndex);
            currentTaskNumber = g.parentElement.id.split("-")[1];
            console.log("first assignment of currentTaskNumber", currentTaskNumber);
            taskName.value = `${taskList[currentTaskIndex]["name"]}`;
            taskDate.value = `${taskList[currentTaskIndex]["date"]}`;
            taskDesc.value = `${taskList[currentTaskIndex]["description"]}`;
            //function call to updateTask() binding
            createTask.addEventListener("click", function() {
                addOrEditTask.close();
                createTask.value = "Create New Task";
                currentTaskIndex = null;
                currentTaskNumber = null;
            });
            closeTask.addEventListener("click", function() { 
                addOrEditTask.close();
                createTask.value = "Create New Task";
                currentTaskIndex = null;
                currentTaskNumber = null;
            })
        })
    }
}
//after updating/creating an element, clears the modal values
function clearEdits() { 
    taskName.value = "";
    taskDate.value = "";
    taskDesc.value = "";
}
//event selector for theme
theme.addEventListener("change", function(e) { 
    let xcircle = document.querySelectorAll('a[class="delete"]')
    switch(e.target.value) { 
        case "bw": 
            document.querySelector('div[class="container"]').style.backgroundColor = "black";
            document.querySelector('body').style.backgroundColor = "darkgrey";
            for (let item in xcircle) { 
                xcircle[item].innerHTML = `<svg style="color: red" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" fill="red"></path> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="red"></path> </svg>`
            }
            break;
        case "default": 
            document.querySelector('div[class="container"]').style.backgroundColor = "red";
            document.querySelector('body').style.backgroundColor = "white";
            for (let item in xcircle) { 
                xcircle[item].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>`;
            }
            break;
    }
})
