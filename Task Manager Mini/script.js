document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const taskFormContainer = document.getElementById('task-form-container');
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const closeBtn = document.querySelector('.close-btn');
    const filterStatus = document.getElementById('filter-status');
    const sortBy = document.getElementById('sort-by');
    
    // Task data
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Initialize the app
    renderTasks();
    
    // Event listeners
    addTaskBtn.addEventListener('click', () => openTaskForm());
    closeBtn.addEventListener('click', () => closeTaskForm());
    taskForm.addEventListener('submit', handleTaskSubmit);
    filterStatus.addEventListener('change', renderTasks);
    sortBy.addEventListener('change', renderTasks);
    
    // Open task form for adding a new task
    function openTaskForm(task = null) {
        const formTitle = document.getElementById('form-title');
        const taskId = document.getElementById('task-id');
        const taskTitle = document.getElementById('task-title');
        const taskDescription = document.getElementById('task-description');
        const taskStatus = document.getElementById('task-status');
        const taskDueDate = document.getElementById('task-due-date');
        
        if (task) {
            // Edit mode
            formTitle.textContent = 'Edit Task';
            taskId.value = task.id;
            taskTitle.value = task.title;
            taskDescription.value = task.description;
            taskStatus.value = task.status;
            taskDueDate.value = task.dueDate ? task.dueDate.split('T')[0] : '';
        } else {
            // Add mode
            formTitle.textContent = 'Add New Task';
            taskId.value = '';
            taskForm.reset();
            // Set default due date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            taskDueDate.value = tomorrow.toISOString().split('T')[0];
        }
        
        taskFormContainer.style.display = 'block';
    }
    
    // Close task form
    function closeTaskForm() {
        taskFormContainer.style.display = 'none';
    }
    
    // Handle form submission
    function handleTaskSubmit(e) {
        e.preventDefault();
        
        const taskId = document.getElementById('task-id').value;
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-description').value.trim();
        const status = document.getElementById('task-status').value;
        const dueDate = document.getElementById('task-due-date').value;
        
        if (taskId) {
            // Update existing task
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex] = {
                    ...tasks[taskIndex],
                    title,
                    description,
                    status,
                    dueDate: dueDate ? new Date(dueDate).toISOString() : null
                };
            }
        } else {
            // Add new task
            const newTask = {
                id: Date.now().toString(),
                title,
                description,
                status,
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
                createdAt: new Date().toISOString()
            };
            tasks.push(newTask);
        }
        
        saveTasks();
        renderTasks();
        closeTaskForm();
    }
    
    // Render tasks based on filters and sorting
    function renderTasks() {
        // Get filter and sort values
        const statusFilter = filterStatus.value;
        const sortOption = sortBy.value;
        
        // Filter tasks
        let filteredTasks = [...tasks];
        if (statusFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
        }
        
        // Add isOverdue property to each task
        const now = new Date();
        filteredTasks = filteredTasks.map(task => {
            const isOverdue = task.dueDate && 
                            new Date(task.dueDate) < now && 
                            task.status !== 'completed';
            return { ...task, isOverdue };
        });
        
        // Sort tasks
        filteredTasks.sort((a, b) => {
            switch (sortOption) {
                case 'created-desc':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'created-asc':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'due-date-asc':
                    return (a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000)) - 
                           (b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000));
                case 'due-date-desc':
                    return (b.dueDate ? new Date(b.dueDate) : new Date(0)) - 
                           (a.dueDate ? new Date(a.dueDate) : new Date(0));
                default:
                    return 0;
            }
        });
        
        // Clear task list
        taskList.innerHTML = '';
        
        // Render each task
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p>No tasks found. Add a new task to get started!</p>';
            return;
        }
        
        filteredTasks.forEach(task => {
            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            const formattedDueDate = dueDate ? 
                dueDate.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                }) : 'No due date';
            
            const isOverdue = task.isOverdue;
            
            const taskElement = document.createElement('div');
            taskElement.className = `task-card ${task.status}`;
            if (task.status === 'completed') {
                taskElement.classList.add('completed');
            }
            if (isOverdue) {
                taskElement.classList.add('overdue');
            }
            
            taskElement.innerHTML = `
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <span class="task-status status-${task.status}">${task.status}</span>
                </div>
                <p class="task-description">${task.description || 'No description'}</p>
                <p class="task-due-date ${isOverdue ? 'overdue' : ''}">
                    <strong>Due:</strong> ${formattedDueDate}
                    ${isOverdue ? ' (Overdue!)' : ''}
                </p>
                <div class="task-actions">
                    <button class="btn edit-btn" data-id="${task.id}">Edit</button>
                    <button class="btn delete-btn" data-id="${task.id}">Delete</button>
                    <button class="btn toggle-status-btn" data-id="${task.id}">
                        ${task.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
                    </button>
                </div>
            `;
            
            taskList.appendChild(taskElement);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.getAttribute('data-id');
                const task = tasks.find(t => t.id === taskId);
                if (task) openTaskForm(task);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this task?')) {
                    deleteTask(taskId);
                }
            });
        });
        
        document.querySelectorAll('.toggle-status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.getAttribute('data-id');
                toggleTaskStatus(taskId);
            });
        });
    }
    
    // Delete a task
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }
    
    // Toggle task status between pending and completed
    function toggleTaskStatus(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    status: task.status === 'pending' ? 'completed' : 'pending'
                };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === taskFormContainer) {
            closeTaskForm();
        }
    });
});