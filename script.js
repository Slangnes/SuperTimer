//when the record task button is clicked, display a json object with the supervisor name, task name, hours, date, time, and number of employees
document.getElementById("recordTaskButton").addEventListener("click", function() {
    // Get the values from the input fields
    var supervisorName = document.getElementById("supervisor-name").value;
    var taskName = document.getElementById("task-name").value;
    var hours = document.getElementById("hours").value;
    var numberOfEmployees = document.getElementById("peopleAssigned").value;
    var feedbackDiv = document.getElementById("feedback");

    feedbackDiv.textContent = "";
    feedbackDiv.className = "";

    // Input validation
    if (!supervisorName || !taskName || !hours || !numberOfEmployees) {
        feedbackDiv.textContent = "Please fill in all fields.";
        feedbackDiv.className = "error";
        return;
    }
    if (isNaN(hours) || Number(hours) < 1) {
        feedbackDiv.textContent = "Please enter at least 1 hour of work.";
        feedbackDiv.className = "error";
        return;
    }
    if (isNaN(numberOfEmployees) || Number(numberOfEmployees) < 1) {
        feedbackDiv.textContent = "Please assign at least 1 employee.";
        feedbackDiv.className = "error";
        return;
    }

    // Get the current date and time
    var currentDate = new Date();
    // Create a JSON object with the values
    var taskData = {
        supervisorName: supervisorName,
        taskName: taskName,
        hours: hours,
        numberOfEmployees: numberOfEmployees,
        date: currentDate.toLocaleDateString(),
        time: currentDate.toLocaleTimeString()
    };

    // Display the JSON object in a div with id "task-data"
    var taskDataDiv = document.getElementById("task-data");
    taskDataDiv.innerHTML = "<h3>Task Data:</h3><pre>" + JSON.stringify(taskData, null, 2) + "</pre>";
    // Clear the input fields
    document.getElementById("supervisor-name").value = "";
    document.getElementById("task-name").value = "";
    document.getElementById("hours").value = "";
    document.getElementById("peopleAssigned").value = "";
    // Hide the task data div after 5 seconds
    setTimeout(function() {
        taskDataDiv.innerHTML = "";
    }, 5000);
    // Clear feedback on successful submission
    feedbackDiv.textContent = "Task recorded successfully!";
    feedbackDiv.className = "success";
});
// Show task inputs only after supervisor is selected
document.getElementById('supervisor-name').addEventListener('change', function() {
    const taskInputs = document.getElementById('task-inputs');
    if (this.value) {
        taskInputs.classList.remove('hidden');
    } else {
        taskInputs.classList.add('hidden');
    }
});