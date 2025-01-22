//comment made on 1/21/2025 2:05 pm
//comment made on 1/21/2025 2:08 pm

//DOM initialization
const addTask = document.getElementById("add-task");
const tasks = document.getElementById("tasks");
const taskSort = document.getElementById("task-sorting");
const taskEdit = document.getElementById("edit-task");
const theme = document.getElementById("theme");

const editTaskName = document.getElementById('edit-task-name');
const editTaskDate = document.getElementById('edit-task-date');
const editTaskDesc = document.getElementById('edit-task-desc');
const editTaskDone = document.getElementById('edit-task-done');
const editTaskDiscard = document.getElementById('edit-task-discard');

const newTaskWindow = document.getElementById("create-new-task");
const createTask = document.getElementById("create-task");
const discardTask = document.getElementById("discard-task");
const closeTask = document.getElementById("close-task");
const taskName = document.getElementById("task-name");
const taskDate = document.getElementById("task-date");
const taskDesc = document.getElementById("task-desc");

//storage for sort algorithms and localStorage
let taskList = [];
let tempTask = {};

//localStorage getItems
window.onload = () => {
    for (let n = 0; n < localStorage.length; n++) { 
        taskList.push(JSON.parse(localStorage.getItem(n)));
    }
    renderTasks(taskList);
}

//displays modal add task window
addTask.addEventListener('click', function() {
    newTaskWindow.showModal()
    unpacking();
});

discardTask.addEventListener('click', function() { 
    tempTask = {id: `task-${taskList.length}-${taskDate.value}`, date: taskDate.value, name: taskName.value, description: taskDesc.value};
    newTaskWindow.close();
})

closeTask.addEventListener('click', function() { 
    tempTask = {};
    newTaskWindow.close();
})

function loadVals() { 
    if (tempTask["name"]) { 
        taskName.value = tempTask["name"];
    } 
    if (tempTask["date"]) { 
        taskDate.value = tempTask["date"];
    }
    if (tempTask["description"]) { 
        taskDesc.value = tempTask["description"];
    }
}
//does custom DOM elem creation && info storage in array 
createTask.addEventListener('click', () => {
    if (taskName.value !== "" && taskDate.value !== "") { 
        const newTask = {id: `task-${taskList.length}-${taskDate.value}`, date: taskDate.value, name: taskName.value, description: taskDesc.value};
        taskList.unshift(newTask);
        clearEditor();
        renderTasks(taskList);
        tempTask = {};
        newTaskWindow.close();
    } else { 
        alert('You must write out a task and its due date before displaying it');
    }
})

//transfer an array across a different object, removing its original copy
tasks.addEventListener("change", (e) => { 
    // completedTaskList.push(taskList.filter((a) => e.target.parentElement.id == `${a.id}`));
    console.log("id", e.target.parentElement.id);
    const taskIndex = taskList.findIndex((task) => task.id == e.target.parentElement.id);
    console.log("taskIndex: ", taskIndex);
    taskList.splice(taskIndex, 1);
    renderTasks(taskList);
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
        default: 
    }
})
//lays out properties from objects within array
function renderTasks(list) { 
    tasks.innerHTML = "";
    for (const {id, date, name, description} of list) {
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
    renderTasks(taskList);
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
    renderTasks(taskList);
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
    renderTasks(taskList);
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
    renderTasks(taskList);
}
//displays completed tasks
// function sortCompleted() { 
//     renderTasks(completedTaskList);
// }
//displays deleted tasks
// function sortDeleted() { 
//     renderTasks(deletedTaskList);
// };

function deleteOrEditSelector() { 
    const deletes = document.querySelectorAll(`a[class="delete"]`);
    for (let i of deletes) { 
        i.addEventListener("click", function() { 
            let index = taskList.findIndex((a) => a.id == i.parentElement.id);
            // deletedTaskList.push(taskList[index]);
            taskList.splice(index, 1);
            renderTasks(taskList);
        })
    }
    const edits = document.querySelectorAll(`a[class="edit"]`);
    for (let g of edits) { 
        g.addEventListener("click", function() { 
            taskEdit.showModal();
            let index = taskList.findIndex((a) => a.id == g.parentElement.id);
            let taskNumber = g.parentElement.id.split("-")[1];
            editTaskName.value = `${taskList[index]["name"]}`;
            editTaskDate.value = `${taskList[index]["date"]}`;
            editTaskDesc.value = `${taskList[index]["description"]}`;
            editTaskDone.addEventListener("click", function() {
                taskList[index] = {id: `task-${taskNumber}-${editTaskDate.value}`, date: editTaskDate.value, name: editTaskName.value, description: editTaskDesc.value};
                renderTasks(taskList);
                // clearEditor();
                taskEdit.close();
            });
            editTaskDiscard.addEventListener("click", function() { 
                taskEdit.close();
            })
        })
    }
}
//after updating/creating an element, clears the modal values
function clearEditor() { 
    taskName.value = "";
    taskDate.value = "";
    taskDesc.value = "";
}
//event selector for theme
theme.addEventListener("change", function(e) { 
    let xcircle = document.querySelectorAll('a[class="delete"]')
    console.log(xcircle);
    switch(e.target.value) { 
        case "bw": 
            document.querySelector('div[class="container"]').style.backgroundColor = "black";
            document.querySelector('body').style.backgroundColor = "darkgrey";
            for (let item in xcircle) { 
                console.log(xcircle[item]);
                xcircle[item].innerHTML = `<svg style="color: red" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" fill="red"></path> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="red"></path> </svg>`
            }
            break;
        case "default": 
            document.querySelector('div[class="container"]').style.backgroundColor = "red";
            document.querySelector('body').style.backgroundColor = "white";
            for (let item in xcircle) { 
                console.log(xcircle[item]);
                xcircle[item].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/> </svg>`;
            }
            break;
    }
})
//learning how to GIT
// updateHovers();
// function updateHovers() { 
//     const hovers = document.querySelectorAll('div[class="deletable"]');
//     for (let i in hovers) { 
//         hovers[i].addEventListener('hover', function(e) { 
//             console.log(e.target.id);
//             e.target.style.backgroundColor = "pink";
//         })
//         hovers[i].addEventListener('hover', function(e) { 
//             console.log(e.target.id);
//             e.target.style.backgroundColor = "none";
//         })
//     }
// }