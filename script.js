// Mock data for supervisors and task orders
const mockSupervisors = [
    {
        id: "S001",
        name: "Alice Smith",
        department: "Assembly",
        workLine: "Line 1",
        shift: "Morning",
        tasks: [
            {
                workOrder: "WO1001",
                description: "Assemble Widget A",
                time: { hours: 2, minutes: 30 }
            }
        ]
    },
    {
        id: "S002",
        name: "Bob Johnson",
        department: "Inspection",
        workLine: "Line 2",
        shift: "Evening",
        tasks: [
            {
                workOrder: "WO1002",
                description: "Inspect Widget B",
                time: { hours: 1, minutes: 45 }
            }
        ]
    }
];

// Store supervisor ID globally
let supervisorId = "";

// Populate dropdowns based on supervisor
function populateDropdowns(supervisor) {
    // Department
    const departmentSelect = document.getElementById("department");
    departmentSelect.innerHTML = `<option value="${supervisor.department}">${supervisor.department}</option>`;

    // Work Line
    const workLineSelect = document.getElementById("work-line");
    workLineSelect.innerHTML = `<option value="${supervisor.workLine}">${supervisor.workLine}</option>`;

    // Shift
    const shiftSelect = document.getElementById("shift");
    shiftSelect.innerHTML = `<option value="${supervisor.shift}">${supervisor.shift}</option>`;

    // Time Hours
    const timeHoursSelect = document.getElementById("time-hours");
    timeHoursSelect.innerHTML = Array.from({length: 13}, (_, i) => `<option value="${i}">${i}</option>`).join("");

    // Team Members (add if missing)
let teamMembersSelect = document.getElementById("team-members");
if (!teamMembersSelect) {
    teamMembersSelect = document.createElement("select");
    teamMembersSelect.id = "team-members";
    teamMembersSelect.style.marginBottom = "16px";
    // Add options 1-20
    for (let i = 1; i <= 20; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        teamMembersSelect.appendChild(option);
    }
    // Add label for accessibility
    const label = document.createElement("label");
    label.htmlFor = "team-members";
    label.textContent = "Team Members:";
    label.style.display = "block";
    label.style.marginTop = "8px";
    // Insert before task-form-buttons div
    const taskForm = document.getElementById("task-form");
    const taskFormButtons = document.getElementById("task-form-buttons");
    if (taskFormButtons && taskFormButtons.parentNode) {
        taskFormButtons.parentNode.insertBefore(label, taskFormButtons);
        taskFormButtons.parentNode.insertBefore(teamMembersSelect, taskFormButtons);
    } else {
        console.error("task-form-buttons div not found in DOM or has no parent.");
    }
}
teamMembersSelect.value = "1";
}

// Handle supervisor form submission
document.getElementById("supervisor-form").addEventListener("submit", function(e) {
    e.preventDefault();
    console.log("Supervisor ID submission received")
    const input = document.getElementById("supervisor-id");
    supervisorId = input.value.trim();

    // Check if supervisorId exists in mockSupervisors
    const supervisor = mockSupervisors.find(s => s.id.toLowerCase() === supervisorId.toLowerCase());

    // Feedback div for supervisor form
    let feedbackDiv = document.getElementById("supervisor-feedback");
    if (!feedbackDiv) {
        feedbackDiv = document.createElement("div");
        feedbackDiv.id = "supervisor-feedback";
        input.parentNode.appendChild(feedbackDiv);
    }
    feedbackDiv.textContent = "";
    feedbackDiv.className = "";

    if (!supervisorId) {
        feedbackDiv.textContent = "Please enter a supervisor ID.";
        feedbackDiv.className = "error";
        return;
    }
    if (!supervisor) {
        feedbackDiv.textContent = "Supervisor ID not found. Please check and try again.";
        feedbackDiv.className = "error";
        return;
    }

    // Populate dropdowns
    populateDropdowns(supervisor);

    document.getElementById("task-inputs").classList.remove("hidden");
    document.getElementById("supervisor-form").classList.add("hidden");
});

// Handle the task form submission
function handleTaskSubmission(closeAfter) {
    var department = document.getElementById("department").value.trim();
    var workLine = document.getElementById("work-line").value.trim();
    var shift = document.getElementById("shift").value.trim();
    var workOrder = document.getElementById("work-order").value.trim();
    var hours = document.getElementById("time-hours").value;
    var minutes = document.getElementById("time-minutes").value;
    var teamMembers = document.getElementById("team-members").value;
    var feedbackDiv = document.getElementById("feedback");

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

    // Show success feedback
    feedbackDiv.textContent = "Task recorded successfully!";
    feedbackDiv.className = "success";

    // Display the JSON object below feedback
    var taskDataDiv = document.getElementById("task-data");
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
        feedbackDiv.textContent = "";
        taskDataDiv.innerHTML = "";
        if (closeAfter) {
            document.getElementById("task-inputs").classList.add("hidden");
            document.getElementById("supervisor-form").classList.remove("hidden");
        }
    }, 5000);
}
// Handle task form submission
document.getElementById("submit-add-another").addEventListener("click", function() {
    handleTaskSubmission(false);
});
document.getElementById("submit-close").addEventListener("click", function() {
    handleTaskSubmission(true);
});

// Show supervisors
document.getElementById("show-supervisors-btn").addEventListener("click", function() {
    let list = mockSupervisors.map(s => `${s.id}: ${s.name}`).join("<br>");
    showModal("Supervisors", list);
});

// Simple modal function
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

