const tasksForDay = {};     // Stores tasks for each day
const calendarElement = document.getElementById('calendar');
const taskListElement = document.getElementById('task-list');
const dateTextElement = document.getElementById('date-text');
const selectedDateElement = document.getElementById('selected-date');
const addTaskBtn = document.getElementById('add-task-btn');
const newTaskInput = document.getElementById('new-task-input');
const monthYearElement = document.getElementById('month-year');
let currentYear = 2025;
let currentMonth = 0; // 0 is January
let selectedDate = null;

// Load tasks from localStorage (if any)
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    Object.assign(tasksForDay, JSON.parse(storedTasks));
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasksForDay));
}

// Generate the calendar for the given year and month
function generateCalendar(year, month) {
  const date = new Date(year, month, 1);
  const firstDay = date.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendar = [];

  for (let i = 0; i < firstDay; i++) {
    calendar.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendar.push(i);
  }

  return calendar;
}

// Display the calendar for the given year and month
function displayCalendar(year, month) {
  const calendar = generateCalendar(year, month);
  calendarElement.innerHTML = '';

  calendar.forEach((day) => {
    const dayElement = document.createElement('div');
    if (day) {
      dayElement.textContent = day;
      const dateString = `${year}-${month + 1}-${day < 10 ? '0' + day : day}`;
      dayElement.dataset.date = dateString;
      dayElement.addEventListener('click', handleDayClick);

      if (tasksForDay[dateString] && tasksForDay[dateString].length > 0 && tasksForDay[dateString].every(task => task.completed)) {
        dayElement.classList.add('completed');
      }

      if (selectedDate === dateString) {
        dayElement.classList.add('selected');
      }

      dayElement.classList.add('calendar-day');
    }
    calendarElement.appendChild(dayElement);
  });

  monthYearElement.textContent = `${getMonthName(month)} ${year}`;
}

// Get month name
function getMonthName(month) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
}

// Handle click on a day in the calendar
function handleDayClick(event) {
  selectedDate = event.target.dataset.date;
  selectedDateElement.textContent = selectedDate;
  dateTextElement.textContent = selectedDate;
  displayCalendar(currentYear, currentMonth);
  updateTaskList(selectedDate);
}

// Update task list for the selected day
function updateTaskList(date) {
  taskListElement.innerHTML = '';
  const tasks = tasksForDay[date] || [];
  tasks.forEach((task, index) => {
    const taskElement = document.createElement('li');
    taskElement.classList.add('task');
    taskElement.innerHTML = `
      <label style="flex-grow:1; cursor:pointer;">
        <input type="checkbox" class="task-checkbox" data-index="${index}" ${task.completed ? 'checked' : ''}>
        ${task.text}
      </label>
      <button class="delete-btn" data-index="${index}">✖</button>
    `;
    taskListElement.appendChild(taskElement);
  });

  // Task checkbox click event
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('click', handleTaskCompletion);
  });

  // Task delete button click event
  document.querySelectorAll('.delete-btn').forEach(deleteBtn => {
    deleteBtn.addEventListener('click', handleDeleteTask);
  });
}

// Handle task completion
function handleTaskCompletion(event) {
  const index = event.target.dataset.index;
  const date = selectedDate;
  const task = tasksForDay[date][index];
  task.completed = event.target.checked;

  saveTasks();
  updateTaskList(date);
  displayCalendar(currentYear, currentMonth);
}

// Handle task deletion
function handleDeleteTask(event) {
  const index = event.target.dataset.index;
  const date = selectedDate;
  tasksForDay[date].splice(index, 1);

  saveTasks();
  updateTaskList(date);
  displayCalendar(currentYear, currentMonth);
}

// Add a new task
addTaskBtn.addEventListener('click', () => {
  const newTaskText = newTaskInput.value.trim();
  if (!selectedDate) {
    alert("Please select a date first.");
    return;
  }
  if (newTaskText) {
    if (!tasksForDay[selectedDate]) {
      tasksForDay[selectedDate] = [];
    }
    tasksForDay[selectedDate].push({ text: newTaskText, completed: false });
    saveTasks();
    updateTaskList(selectedDate);
    newTaskInput.value = '';
    displayCalendar(currentYear, currentMonth);
  }
});

// Navigation buttons (previous/next)
document.getElementById('prev-month').addEventListener('click', () => {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  displayCalendar(currentYear, currentMonth);
});

document.getElementById('next-month').addEventListener('click', () => {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  displayCalendar(currentYear, currentMonth);
});

// Initial Load
loadTasks();
displayCalendar(currentYear, currentMonth);
