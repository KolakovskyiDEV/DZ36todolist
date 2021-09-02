const template = createEmptyTemplate();

document.getElementById('todoForm')
    .addEventListener('submit', function (e) {
        e.preventDefault();
        const inputs = e.target.querySelectorAll('input, textarea');
        const todoItem = {};

        for(let input of inputs) {
            if(input.value === '') return alert('Заполние форму!');
            todoItem[input.name] = input.value;
        }

        saveItem(todoItem);
        renderItem(todoItem);
        e.target.reset();
    })


window.addEventListener('load', function (e) {
    if(!localStorage.todos) return;

    const todos = JSON.parse(localStorage.getItem('todos'));

    todos.forEach(function (item) {
        renderItem(item)
    });

    // todosDemo.forEach(function (item) {
    //     renderItem({title: item.userId, description: item.title});
    // })

})


function saveItem(todoItem) {

    if(localStorage.todos) {
        let todosArray = JSON.parse(localStorage.todos);
        todosArray.push(todoItem);
        todosArray = JSON.stringify(todosArray);
        localStorage.setItem('todos', todosArray);
        return;
    }

    let todosArray = JSON.stringify([todoItem]);
    localStorage.setItem('todos', todosArray)
}


function renderItem(todoItem) {
    const localTemplate = template.cloneNode(true);
    localTemplate.querySelector('.taskHeading').innerText = todoItem.title
    localTemplate.querySelector('.taskDescription').innerText = todoItem.description;
    document.getElementById('todoItems').prepend(localTemplate);
}


function createEmptyTemplate() {
    const col = document.createElement('div');
    col.className = 'col-4';

    const taskWrapper = document.createElement('div');
    taskWrapper.className = 'taskWrapper';
    col.append(taskWrapper);

    const taskHeading = document.createElement('div');
    taskHeading.className = 'taskHeading';

    const taskDescription = document.createElement('div');
    taskDescription.className = 'taskDescription';

    taskWrapper.append(taskHeading);
    taskWrapper.append(taskDescription);

    return col;
}