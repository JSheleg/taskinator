var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var tasks =[];

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var taskFormHandler = function(event){
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name = 'task-type']").value;
    
    //check if inputs are empty(validate)
    if(!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!");
        return false;
    }
        
    var isEdit = formEl.hasAttribute("data-task-id");
    
    //has data attribute, so get task id and call function to complete edit process
    if(isEdit){
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    //no data attribute, so create object as normal and pass CreateTaskEl function
    else{
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status:"to do"
    };

    createTaskEl(taskDataObj);
    }
    formEl.reset();    
};

var createTaskEl = function(taskDataObj){
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    //create task actions(buttons and select) for task
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    tasksToDoEl.appendChild(listItemEl);

    console.log(taskDataObj);
    console.log(taskDataObj.status);
    //console.log(JSON.stringify(taskDataObj) + " task data obj");
    switch(taskDataObj.status){
        
        case "to do":
            taskActionsEl.querySelector("select[name = 'status-Change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);             
            break;
        case "in progress":
            taskActionsEl.querySelector("select[name='status-Change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
            break;
        case "completed":
            taskActionsEl.querySelector("select[name='status-Change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
            break; 
        default:
            console.log("Something went wrong!");    
    }

    //save task as an object with name, type, status and id properites then push it into tasks array
    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    //save tasks to local Storage
    saveTasks()
    console.log(taskDataObj);

    //increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function(taskId){
    //create container to hold elements
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id",taskId);
    actionContainerEl.appendChild(deleteButtonEl);
    
    //create change status dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name","status-Change");
    statusSelectEl.setAttribute("data-task-id",taskId);
    actionContainerEl.appendChild(statusSelectEl);

    //create status options
    var statusChoices = ["To Do", "In Progress", "Completed" ];

    for(var i = 0; i < statusChoices.length; i++){
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value",statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

var completeEditTask = function(taskName, taskType, taskId){
    console.log(taskName,taskType, taskId);

    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    for(var i = 0; i<tasks.length; i++){
        if(tasks[i].id ===parseInt(taskId)){
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };
    
    alert("Task Updated!");

    //remove data attribute from form
    formEl.removeAttribute("data-task-id");
    //update formEl button to go back to saving "Add Task" instead of "Edit Task"
    document.querySelector("#save-task").textContent = "Add Task";
    //save tasks to localStorage
    saveTasks()
};


var taskButtonHandler = function(event){
    //get target element from event
    var targetEl = event.target;

    //edit button was clicked
    if(targetEl.matches(".edit-btn")){
        console.log("edit", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    //delete button was clicked
    else if(targetEl.matches(".delete-btn")){
        console.log("delete",targetEl)
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var editTask = function(taskId){
    console.log("editing task #" + taskId);
    
    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

    //write values of taskName and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    
    //update form's button to reflect editing a task rather than create a new one
    document.querySelector("#save-task").textContent = "Save Task";
    
    //set data attribute to the form with a value of the task's id so it knows which one is being edited
    formEl.setAttribute("data-task-id", taskId);
};

var deleteTask = function(taskId){
    console.log(taskId);
    //find task list element with taskId value and remove it
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    //create new array to hold updated list of tasks
    var updatedTaskArr = [];

    //loop through current tasks
    for(var i = 0; i<tasks.length; i++){
        //if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if(tasks[i].id !== parseInt(taskId)){
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks()
};

var taskStatusChangeHandler = function(event){
    //get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    //get the currently selected option's value and conver to lowercase
    var statusValue = event.target.value.toLowerCase();

    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // convert to lower case
    var statusValue = event.target.value.toLowerCase();

    if(statusValue === "to do"){
        tasksToDoEl.appendChild(taskSelected);
    }
    else if(statusValue === "in progress"){
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if(statusValue === "completed"){
        tasksCompletedEl.appendChild(taskSelected);
    }

    //update task's in tasks array
    for(var i = 0; i<tasks.length; i++){
        if(tasks[i].id === parseInt(taskId)){
            tasks[i].status = statusValue;
        }
    }
    //save to localStorage
    saveTasks()
};

var saveTasks = function(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function(){
    // Gets task items from localStorage.
    var savedTasks = localStorage.getItem("tasks");
    console.log(savedTasks);
    
    //if there are no tasks, set tasks to an empty array and return out of the function
    if(!savedTasks){
        return false;
    }
    console.log("Saved Tasks found!");
    
    //else, load up saved tasks

    //parse into array of objects
    savedTasks = JSON.parse(savedTasks);
    
    console.log(savedTasks);

    //loop through savedTasks array
    for(var i = 0; i < savedTasks.length; i++){
        //pass each task object into the createTaskEl() function
        createTaskEl(savedTasks[i]);     
    }
};
    /*for(var i = 0; i<tasks.length; i++){
        //console.log(tasks[i]);
        taskIdCounter = tasks[i].id  
        //console.log(tasks[i])
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", tasks[i].id);
        

        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML =  "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);
        //console.log(listItemEl);

        //tasks.push(tasks[i]);
        //saveTasks()

        var taskActionsEl = createTaskActions(tasks[i].id);
        listItemEl.appendChild(taskActionsEl);
        //console.log(listItemEl);
        console.log(tasks[i])
        console.log(tasks[i].status)
        //debugger;
        if(tasks[i].status === "to do"){
            //debugger;
            console.log(tasks[i].status)
            listItemEl.querySelector("select[name = 'status-Change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);             
        }
        else if(tasks[i].status === "in progress"){
            //debugger;
            console.log(tasks[i].status)
            listItemEl.querySelector("select[name='status-Change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
        }
        else if(tasks[i].status === "completed"){
            //debugger;
            console.log(tasks[i].status);
            console.log(listItemEl);
            
            listItemEl.querySelector("select[name='status-Change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
        }

        taskIdCounter++;
        console.log(listItemEl);

    }*/

//}

//creat a new task
formEl.addEventListener("submit", taskFormHandler);

//for edit and delet buttons
pageContentEl.addEventListener("click", taskButtonHandler);

//for changing the status
pageContentEl.addEventListener("change",taskStatusChangeHandler);

loadTasks()