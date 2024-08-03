document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todo-input");
    const todoList = document.querySelector(".todo-list");
    const allFilter = document.getElementById('all');
    const activeFilter = document.getElementById('active');
    const completedFilter = document.getElementById('completed');
    const clearComplete = document.querySelector('.clear-complete');
    const darkModeToggle = document.getElementById('darkmode');

    // Function to add a new todo item
    function addTodoItem(todoText) {
        const todoItem = document.createElement("div");
        todoItem.className = "todo-item";
        todoItem.draggable = true; // Make the todo item draggable
        todoItem.innerHTML = `
            <input type="checkbox" class="todo-checkbox">
            <span class="todo-text">${todoText}</span>
        `;

        todoList.insertBefore(todoItem, document.getElementById("todo-status"));
        updateTodoCount();
        addDragAndDropHandlers(todoItem); // Add drag-and-drop handlers
    }

    // Update the todo count
    function updateTodoCount() {
        const todoCount = todoList.querySelectorAll(".todo-item:not(.completed)").length;
        document.querySelector("#todo-status p").innerText = `${todoCount} items left`;
    }

    // Function to filter todos
    function filterTodos(filter) {
        const todos = todoList.querySelectorAll('.todo-item');
        todos.forEach(todo => {
            switch (filter) {
                case 'all':
                    todo.style.display = 'flex';
                    break;
                case 'active':
                    if (todo.classList.contains('completed')) {
                        todo.style.display = 'none';
                    } else {
                        todo.style.display = 'flex';
                    }
                    break;
                case 'completed':
                    if (todo.classList.contains('completed')) {
                        todo.style.display = 'flex';
                    } else {
                        todo.style.display = 'none';
                    }
                    break;
            }
        });
    }

    // Function to set active filter styling
    function setActiveFilter(activeElement) {
        const filters = document.querySelectorAll('.states p');
        filters.forEach(filter => filter.classList.remove('active'));
        activeElement.classList.add('active');
    }

    // Event listener for the Enter key
    todoInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter" && todoInput.value.trim() !== "") {
            addTodoItem(todoInput.value.trim());
            todoInput.value = "";
        }
    });

    // Event listener for checkbox clicks
    todoList.addEventListener("click", (event) => {
        if (event.target.classList.contains("todo-checkbox")) {
            const todoItem = event.target.parentElement;
            todoItem.classList.toggle("completed");
            updateTodoCount();
        } else if (event.target.classList.contains("todo-delete")) {
            event.target.parentElement.remove();
            updateTodoCount();
        }
    });

    // Event listeners for filters
    allFilter.addEventListener('click', function() {
        filterTodos('all');
        setActiveFilter(this);
    });
    activeFilter.addEventListener('click', function() {
        filterTodos('active');
        setActiveFilter(this);
    });
    completedFilter.addEventListener('click', function() {
        filterTodos('completed');
        setActiveFilter(this);
    });

    clearComplete.addEventListener('click', () => {
        const completedTodos = todoList.querySelectorAll('.todo-item.completed');
        completedTodos.forEach(todo => todo.remove());
        updateTodoCount();
    });

    // Drag and Drop Handlers
    function addDragAndDropHandlers(todoItem) {
        todoItem.addEventListener('dragstart', handleDragStart);
        todoItem.addEventListener('dragover', handleDragOver);
        todoItem.addEventListener('drop', handleDrop);
        todoItem.addEventListener('dragend', handleDragEnd);
    }

    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
        setTimeout(() => {
            event.target.classList.add('dragging');
        }, 0);
    }

    function handleDragOver(event) {
        event.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const elements = [...todoList.querySelectorAll('.todo-item:not(.dragging)')];
        const afterElement = elements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = event.clientY - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;

        if (afterElement == null) {
            todoList.insertBefore(draggingItem, document.getElementById("todo-status"));
        } else {
            todoList.insertBefore(draggingItem, afterElement);
        }
    }

    function handleDrop(event) {
        event.target.classList.remove('dragging');
    }

    function handleDragEnd(event) {
        event.target.classList.remove('dragging');
        // Reorder the DOM based on the new positions to ensure smooth animation
        const todoItems = [...todoList.querySelectorAll('.todo-item')];
        todoItems.forEach((item, index) => {
            item.style.order = index;
        });
    }

    // Add existing items to have drag and drop functionality
    document.querySelectorAll('.todo-item').forEach(addDragAndDropHandlers);

    // Toggle light and dark mode
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.src = './images/icon-sun.svg';
            document.getElementById('banner').src = '../images/bg-desktop-dark.jpg';
        } else {
            darkModeToggle.src = './images/icon-moon.svg';
            document.getElementById('banner').src = '../images/bg-desktop-light.jpg';
        }
    });
});
