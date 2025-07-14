// @ts-nocheck

/******************************************************************************
                                Constants
******************************************************************************/

const DateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const formatDate = (date) => DateFormatter.format(new Date(date));

let users = [];
let chats = [];

/******************************************************************************
                                  Run
******************************************************************************/

// Start
displayUsers();

/******************************************************************************
                              Functions
******************************************************************************/

/**
 * Call api
 */
function displayUsers(id = -1) {
  Http
    .get('/api/v1/users/all')
    .then(resp => resp.json())
    .then(resp => {
      var allUsersTemplate = document.getElementById('all-users-template'),
        allUsersTemplateHtml = allUsersTemplate.innerHTML,
        template = Handlebars.compile(allUsersTemplateHtml);
      var allUsersAnchor = document.getElementById('all-users-anchor');
      allUsersAnchor.innerHTML = template({
        users: getUsers(resp, id),
        currentUser: resp.users.find(user => user.id == id)
      });
    });
}

function getUsers(resp, id) {
  users = resp.users.map(user => ({
    ...user,
    createdFormatted: formatDate(user.created),
    current: user.id == id ? true : false
  }));

  return users;
}

// Setup event listener for button click
document.addEventListener('click', event => {
  event.preventDefault();
  var ele = event.target;
  if (ele.matches('#add-user-btn')) {
    addUser();
  } else if (ele.matches('.edit-user-btn')) {
    showEditView(ele.parentNode.parentNode);
  } else if (ele.matches('.cancel-edit-btn')) {
    cancelEdit(ele.parentNode.parentNode);
  } else if (ele.matches('.submit-edit-btn')) {
    submitEdit(ele);
  } else if (ele.matches('.delete-user-btn')) {
    deleteUser(ele);
  } else if (ele.matches('.current-user-btn')) {
    makeCurrentUser(ele);
  } else if (ele.matches('.chat-user-btn')) {
    openChatSystem(ele);
  }
}, false);

/**
 * Add a new user.
 */
function addUser() {
  var nameInput = document.getElementById('name-input');
  var emailInput = document.getElementById('email-input');
  var data = {
    user: {
      id: -1,
      name: nameInput.value,
      email: emailInput.value,
      created: new Date(),
    },
  };
  // Call api
  Http
    .post('/api/v1/users/add', data)
    .then(() => {
      nameInput.value = '';
      emailInput.value = '';
      displayUsers();
    });
}

/**
 * Show edit view.
 */
function showEditView(userEle) {
  var normalView = userEle.getElementsByClassName('normal-view')[0];
  var editView = userEle.getElementsByClassName('edit-view')[0];
  normalView.style.display = 'none';
  editView.style.display = 'block';
}

/**
 * Cancel edit.
 */
function cancelEdit(userEle) {
  var normalView = userEle.getElementsByClassName('normal-view')[0];
  var editView = userEle.getElementsByClassName('edit-view')[0];
  normalView.style.display = 'block';
  editView.style.display = 'none';
}

/**
 * Submit edit.
 */
function submitEdit(ele) {
  var userEle = ele.parentNode.parentNode;
  var nameInput = userEle.getElementsByClassName('name-edit-input')[0];
  var emailInput = userEle.getElementsByClassName('email-edit-input')[0];
  var id = ele.getAttribute('data-user-id');
  var created = ele.getAttribute('data-user-created');

  var data = {
    user: {
      id: Number(id),
      name: nameInput.value,
      email: emailInput.value,
      created: new Date(created),
    },
  };
  Http
    .put('/api/v1/users/update', data)
    .then(() => displayUsers());
}

/**
 * Delete a user
 */
function deleteUser(ele) {
  var id = ele.getAttribute('data-user-id');
  Http
    .delete('/api/v1/users/delete/' + id)
    .then(() => displayUsers());
}

/**
 * Make Current user
 */
function makeCurrentUser(ele) {
  var id = ele.getAttribute('data-user-id');
  displayUsers(id);
}

/**
 * Open Chat System
 */
function openChatSystem(ele) {
  var toId = ele.getAttribute('data-to-user-id');
  var toName = ele.getAttribute('data-to-user-name');
  const currentUser = users.find(user => user.current == true);

  var anchor = document.createElement('a');
  anchor.href = `http://localhost:3000/api/v1/users/chat?to=${toId}:${toName}&from=${currentUser.id}:${currentUser.name}`;
  anchor.target = "_blank";
  anchor.click();
}