let editedCard;
let isNewTask;

function clearInputs(){
  $("#inputTask").val(""); 
  $("#inputCompleted").prop("checked",false); 
}

function capitalize(str){
  const lower = str.toLowerCase();
  return str.charAt(0).toUpperCase() + lower.slice(1);
 }

function toggleModaltoCreateCard (){ 
  isNewTask = true; 
  clearInputs(); 
  $("#myModal").modal('toggle');
 }

function editCard (titleEditedParameter,completeEditedParameter){
  editedCard.find(".card-title").text(capitalize(titleEditedParameter));
  const checkboxImage = editedCard.find(".completedCheckbox");
   if (completeEditedParameter){
    checkboxImage.removeClass("btn far fa-square").addClass("btn far fa-check-square");
  } else {
    checkboxImage.removeClass("btn far fa-check-square").addClass("btn far fa-square");
  }
}
 
function toggleModalToEditCard(){
  const cardToEdit = $(this).closest(".createdCard"); 
  editedCard = cardToEdit; 
  isNewTask = false;  
  const cardToEditTitleValue = cardToEdit.find(".card-title").text();
  const cardToEditCompletedCheckbox = cardToEdit.find(".completedCheckbox").hasClass("fa-check-square");

  $("#inputTask").val(cardToEditTitleValue);
  $(".checkbox").prop('checked', cardToEditCompletedCheckbox);
  $("#myModal").modal('toggle');
 }

function createCard(titleParameter, completeParameter, idParameter) {
  const card = $(document.createElement('div'));
  card.addClass( "card createdCard mb-3");

  const cardContainer = $(document.createElement('div'));
  cardContainer.addClass("container"); 
  card.append(cardContainer);
  
  const cardRow = $(document.createElement('div'));
  cardRow.addClass("row align-items-center");
  cardContainer.append(cardRow);
  
  const cardFirstCol = $(document.createElement('div'));
  cardFirstCol.addClass("col-6");
  cardRow.append(cardFirstCol);

  const cardTitle = $(document.createElement('h5'));
  cardTitle.addClass("card-title m-0 d-flex");
  cardTitle.text(capitalize(titleParameter));
  cardFirstCol.append(cardTitle);

  const cardSecondCol = $(document.createElement('div'));
  cardSecondCol.addClass("col-2 mt-1");
  cardRow.append(cardSecondCol);

  const cardCheckboxImage = $(document.createElement('i'));
  cardCheckboxImage.addClass("completedCheckbox cardOptions");
  completeParameter ? cardCheckboxImage.addClass("btn far fa-check-square") : cardCheckboxImage.addClass("btn far fa-square");
  cardSecondCol.append(cardCheckboxImage);

  const cardThirdCol = $(document.createElement('div'));
  cardThirdCol.addClass("col-2");
  cardRow.append(cardThirdCol);
  
  const cardEditBtn = $(document.createElement('button'));
  cardEditBtn.attr("id", "editBtnId");
  cardEditBtn.attr("data-toggle","tooltip");
  cardEditBtn.attr("data-placement","bottom");
  cardEditBtn.attr("title","Edit task");
  cardEditBtn.addClass("btn cardOptions");
  const editIcon = $(document.createElement('i'));
  editIcon.addClass("btn cardOptions fas fa-edit");
  cardEditBtn.click(toggleModalToEditCard);
  cardEditBtn.append(editIcon);
  cardThirdCol.append(cardEditBtn);
  $(cardEditBtn).tooltip();

  const cardFourthCol = $(document.createElement('div'));
  cardFourthCol.addClass("col-2");
  cardRow.append(cardFourthCol);

  const cardDeleteBtn = $(document.createElement('button'));
  cardDeleteBtn.addClass("btn cardOptions");
  cardDeleteBtn.attr("data-toggle","tooltip");
  cardDeleteBtn.attr("data-placement","bottom");
  cardDeleteBtn.attr("title","Delete task");
  const deleteIcon = $(document.createElement('i'));
  deleteIcon.addClass("btn cardOptions fas fa-trash");
  cardDeleteBtn.click(deleteCard);
  cardDeleteBtn.append(deleteIcon);
  cardFourthCol.append(cardDeleteBtn);
  $(cardDeleteBtn).tooltip();

  const cardId = $(document.createElement('input'));
  cardId.addClass("card-id");
  cardId.attr("type","hidden");
  cardId.attr("value", idParameter);
  cardFourthCol.append(cardId);
  $("#placeTasks").prepend(card);
}

//REST API'S FUNCTIONS 
//GET METHOD
function getTodosRequest() {

  fetch('https://jsonplaceholder.typicode.com/todos')
    .then((response) => response.json())
    .then((todoList) => {
      todoList.forEach(function (todo) {
        createCard(todo.title, todo.completed, todo.id);
      });
    });
}
//POST METHOD
function postTodosRequest(body){
fetch('https://jsonplaceholder.typicode.com/todos', {
  method: "POST",
  body: JSON.stringify(body),
  headers: {"Content-type": "application/json; charset=UTF-8"}
})
.then(response => response.json()) 
.then(todoPost => 
  createCard(todoPost.title, todoPost.completed,todoPost.id));
}
//DELETE METHOD
function deleteTodosRequest(getCard,cardId){
  fetch(`https://jsonplaceholder.typicode.com/todos/${cardId}`,{
  method: 'DELETE'
})
  .then(response => response.json())
  .then(() => getCard.remove());
}
//PUT METHOD
function putTodosRequest(body){
 const cardId = editedCard.find(".card-id").val();
  fetch(`https://jsonplaceholder.typicode.com/todos/${cardId}`, {
    method: 'PUT', 
    body: JSON.stringify(body),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
    .then(todoUpdate => 
      editCard(todoUpdate.title, todoUpdate.completed));
}

function deleteCard(){
  const getCard = $(this).closest(".createdCard");
  const cardId = getCard.find(".card-id").val();
  deleteTodosRequest(getCard,cardId);
}

function createEditCard (event) {
  event.preventDefault();

  const taskTitle = $("#inputTask").val();
  const taskCheckbox = $("#inputCompleted").is(":checked");

  if (isNewTask) { 
    if (taskTitle.length > 0) {
      postTodosRequest({ title:taskTitle, completed:taskCheckbox }); 
    } else {
      swal.fire("Warning","Please add a task title!","warning");
    }
  } else {
    if (taskTitle.length > 0) {
      putTodosRequest({ title:taskTitle, completed:taskCheckbox });
    } else {
      swal.fire("Warning","Please add a task title!","warning");
    }
  }
  $("#myModal").modal('toggle');
}

$("#openModalButton").attr("data-toggle","tooltip");
$("#openModalButton").attr("data-placement","bottom");
$("#openModalButton").attr("title","Add new task");
$("#openModalButton").click(toggleModaltoCreateCard);
$("#openModalButton").tooltip();

$("#saveEditbtn").click(createEditCard);
$(window).on("load", getTodosRequest());
