// Store supervisor ID globally
let supervisorId = "";

// Handle supervisor form submission
document.getElementById("supervisor-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const input = document.getElementById("supervisor-id");
    supervisorId = input.value.trim();
    if (supervisorId) {
        document.getElementById("task-inputs").classList.remove("hidden");
        document.getElementById("supervisor-form").classList.add("hidden");
    }
});

// Handle the task form submission
document.getElementById("task-form").addEventListener("submit", function(e) {
    e.preventDefault();

    // Get values from the input fields
    var department = document.getElementById("department").value.trim();
    var workLine = document.getElementById("work-line").value.trim();
    var shift = document.getElementById("shift").value.trim();
    var workOrder = document.getElementById("work-order").value.trim();
    var hours = document.getElementById("time-hours").value;
    var minutes = document.getElementById("time-minutes").value;
    var teamMembers = document.getElementById("team-members").value;
    var feedbackDiv = document.getElementById("feedback") || document.createElement("div");
    feedbackDiv.id = "feedback";
    if (!document.getElementById("feedback")) {
        document.getElementById("task-form").appendChild(feedbackDiv);
    }

    feedbackDiv.textContent = "";
    feedbackDiv.className = "";

    // Input validation
    if (!department || !workLine || !shift || !workOrder || hours === "" || minutes === "" || !teamMembers) {
        feedbackDiv.textContent = "Please fill in all fields.";
        feedbackDiv.className = "error";
        return;
    }
    if (isNaN(hours) || Number(hours) < 0) {
        feedbackDiv.textContent = "Please enter a valid number of hours (0 or more).";
        feedbackDiv.className = "error";
        return;
    }
    if (isNaN(minutes) || ![0,15,30,45].includes(Number(minutes))) {
        feedbackDiv.textContent = "Please select minutes in 15-minute increments.";
        feedbackDiv.className = "error";
        return;
    }
    if (isNaN(teamMembers) || Number(teamMembers) < 1) {
        feedbackDiv.textContent = "Please assign at least 1 team member.";
        feedbackDiv.className = "error";
        return;
    }

    // Calculate total time in minutes
    var totalMinutes = Number(hours) * 60 + Number(minutes);

    // Get the current date and time
    var currentDate = new Date();

    // Create a JSON object with the values, including supervisorId
    var taskData = {
        supervisorId: supervisorId,
        department: department,
        workLine: workLine,
        shift: shift,
        workOrder: workOrder,
        time: {
            hours: Number(hours),
            minutes: Number(minutes),
            totalMinutes: totalMinutes
        },
        teamMembers: Number(teamMembers),
        date: currentDate.toLocaleDateString(),
        timeRecorded: currentDate.toLocaleTimeString()
    };

    // Display the JSON object in a div with id "task-data"
    var taskDataDiv = document.getElementById("task-data") || document.createElement("div");
    taskDataDiv.id = "task-data";
    if (!document.getElementById("task-data")) {
        document.body.appendChild(taskDataDiv);
    }
    taskDataDiv.innerHTML = "<h3>Task Data:</h3><pre>" + JSON.stringify(taskData, null, 2) + "</pre>";

    // Clear the input fields
    document.getElementById("department").value = "";
    document.getElementById("work-line").value = "";
    document.getElementById("shift").value = "";
    document.getElementById("work-order").value = "";
    document.getElementById("time-hours").value = "";
    document.getElementById("time-minutes").value = "0";
    document.getElementById("team-members").value = "";

    // Hide the task data div after 5 seconds
    setTimeout(function() {
        taskDataDiv.innerHTML = "";
    }, 5000);

    // Show success feedback
    feedbackDiv.textContent = "Task recorded successfully!";
    feedbackDiv.className = "success";
});