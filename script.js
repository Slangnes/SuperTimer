// Mock data for supervisors and task orders
const mockSupervisors = [
    { id: "S001", name: "Alice Smith" },
    { id: "S002", name: "Bob Johnson" },
    { id: "S003", name: "Charlie Lee" }
];

const mockTaskOrders = [
    { order: "WO1001", description: "Assemble Widget A", supervisorId: "S001" },
    { order: "WO1002", description: "Inspect Widget B", supervisorId: "S002" },
    { order: "WO1003", description: "Package Widget C", supervisorId: "S001" }
];

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

//home button will reset the form and supervisorId
document.getElementById("home-btn").addEventListener("click", function() {
    // Reset supervisorId
    supervisorId = "";

    // Show supervisor form, hide task inputs
    document.getElementById("supervisor-form").classList.remove("hidden");
    document.getElementById("task-inputs").classList.add("hidden");

    // Clear supervisor input
    document.getElementById("supervisor-id").value = "";

    // Clear feedback and task data
    var feedbackDiv = document.getElementById("feedback");
    if (feedbackDiv) feedbackDiv.textContent = "";

    var taskDataDiv = document.getElementById("task-data");
    if (taskDataDiv) taskDataDiv.innerHTML = "";

    // Optionally clear task form fields
    document.getElementById("department").value = "";
    document.getElementById("work-line").value = "";
    document.getElementById("shift").value = "";
    document.getElementById("work-order").value = "";
    document.getElementById("time-hours").value = "";
    document.getElementById("time-minutes").value = "0";
    document.getElementById("team-members").value = "";
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

    // Hide the task data and input form div after 5 seconds
    setTimeout(function() {
        taskDataDiv.innerHTML = "";
        document.getElementById("task-inputs").classList.add("hidden");
    }, 5000);

    // Show success feedback
    feedbackDiv.textContent = "Task recorded successfully!";
    feedbackDiv.className = "success";
});

// Show supervisors
document.getElementById("show-supervisors-btn").addEventListener("click", function() {
    let list = mockSupervisors.map(s => `${s.id}: ${s.name}`).join("<br>");
    showModal("Supervisors", list);
});

// Show task orders
document.getElementById("show-tasks-btn").addEventListener("click", function() {
    let list = mockTaskOrders.map(t => `${t.order}: ${t.description} (Supervisor: ${t.supervisorId})`).join("<br>");
    showModal("Task Orders", list);
});

// Simple modal function (add a div with id="modal" to your HTML)
function showModal(title, content) {
    let overlay = document.getElementById("modal-overlay");
    let modal = document.getElementById("modal");

    // Create overlay if it doesn't exist
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "modal-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.background = "rgba(0,0,0,0.3)";
        overlay.style.zIndex = "999";
        document.body.appendChild(overlay);
    }
    overlay.style.display = "block";

    // Create modal if it doesn't exist
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "modal";
        modal.style.position = "fixed";
        modal.style.top = "20%";
        modal.style.left = "50%";
        modal.style.transform = "translate(-50%, 0)";
        modal.style.background = "#fff";
        modal.style.padding = "24px";
        modal.style.border = "2px solid #333";
        modal.style.zIndex = "1000";
        modal.style.boxShadow = "0 2px 16px rgba(0,0,0,0.2)";
        document.body.appendChild(modal);
    }
    modal.innerHTML = `<h3>${title}</h3><div>${content}</div><button onclick="closeModal()">Close</button>`;
    modal.style.display = "block";

    // Close modal when clicking outside of it
    overlay.onclick = function(e) {
        if (e.target === overlay) closeModal();
    };
}

// Helper to close modal and overlay
function closeModal() {
    let modal = document.getElementById("modal");
    let overlay = document.getElementById("modal-overlay");
    if (modal) modal.style.display = "none";
    if (overlay) overlay.style.display = "none";
}

//theme selector
document.getElementById("theme-selector").addEventListener("change", function() {
    document.documentElement.setAttribute("data-theme", this.value);
});