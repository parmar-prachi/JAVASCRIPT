
let tasks = [];

class Task {
    constructor(title, description, category, dueDate) {
        this.id = Date.now();
        this.title = title;
        this.description = description;
        this.category = category;
        this.dueDate = dueDate;
        this.status = 'pending';
    }

    isOverdue() {
        const today = new Date().toISOString().split('T')[0];
        return this.status === 'pending' && this.dueDate < today;
    }

    toggleComplete() {
        this.status = this.status === 'pending' ? 'completed' : 'pending';
    }
}

function addTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const dueDate = document.getElementById('dueDate').value;

    if (!title || !dueDate) {
        alert('Please enter at least title and due date.');
        return;
    }

    const newTask = new Task(title, description, category, dueDate);
    tasks.push(newTask);

    clearForm();
    renderTasks();
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
    document.getElementById('dueDate').value = '';
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    task.toggleComplete();
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    const search = document.getElementById('search').value.toLowerCase();
    const filter = document.getElementById('filter').value;

    const filtered = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search) || t.category.toLowerCase().includes(search);
        const overdue = t.isOverdue();

        if (filter === 'completed' && t.status !== 'completed') return false;
        if (filter === 'pending' && t.status !== 'pending') return false;
        if (filter === 'overdue' && !overdue) return false;

        return matchesSearch;
    });

    filtered.forEach(t => {
        const card = document.createElement('div');
        card.classList.add('task-card');
        if (t.status === 'completed') card.classList.add('completed');
        if (t.isOverdue()) card.classList.add('overdue');

        card.innerHTML = `
    <div>
        <strong>${t.title}</strong> <br>
            <small>${t.description}</small> <br>
                <small>Category: ${t.category}</small> <br>
                    <small>Due: ${t.dueDate}</small>
                </div>
                <div class="buttons">
                    <button class="complete-btn" onclick="toggleComplete(${t.id})">Completed</button>
                    <button class="delete-btn" onclick="deleteTask(${t.id})">Delete</button>
                </div>
                `;

        list.appendChild(card);
    });

    updateDashboard();
}

function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const overdue = tasks.filter(t => t.isOverdue()).length;
    const progress = total ? Math.round((completed / total) * 100) : 0;

    document.getElementById('dashboard').innerHTML = `
                <h3>Dashboard Summary</h3>
                <p>Total Tasks: ${total}</p>
                <p>Completed: ${completed}</p>
                <p>Pending: ${pending}</p>
                <p>Overdue: ${overdue}</p>
                <p>Progress: ${progress}%</p>
                `;
}
