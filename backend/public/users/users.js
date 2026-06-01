const userTable = document.querySelector(".main__table");
const addUserButtonElement = document.querySelector(".main__add-button");
const maindivElement = document.querySelector(".main");
const maintableElement = document.querySelector(".main__table");

// create a form for user creation
// const formElement =`<form class="form">
//     <fieldset class="form__fieldset">
//       <legend> Create User</legend>
//     <div class="form__div">
//         <label for="name" class="form__label">Name</label>
//         <input class="form__input" type="text" id="name" name="name" required>
//     </div>
//     <div class="form__div">
//         <label for="email" class="form__label">Email</label>
//         <input class="form__input" type="text" id="email" name="email" required>
//     </div> 
//     <button class="form__button" type="button" >
//         <i class="fa-solid fa-xmark"></i>
//     </button>
//       </fieldset>
//   <button class="form__submit" type="submit">Submit</button>
    
// </form>`
const returnForm = (data = null)=>{
  let formElement = `<form class="form">
    <fieldset class="form__fieldset">
      <legend>${data ? 'Update User' : 'Create User'}</legend>
    <div class="form__div">
        <label for="name" class="form__label">Name</label>
        <input class="form__input" type="text" id="name" name="name" value="${data?.name ??''}"  required>
    </div>
    <div class="form__div">
        <label for="email" class="form__label">Email</label>
        <input class="form__input" type="text" id="email" name="email" value="${data?.email ??''}" required>
    </div> 
    <button class="form__button" type="button" >
        <i class="fa-solid fa-xmark"></i>
    </button>
      </fieldset>
  <button class="form__submit" type="submit">Submit</button>
    
</form>`
  return formElement
}
const container = document.createElement("div");
container.innerHTML = returnForm();
const forms = container.firstElementChild;
const formRemoveButtonElement = forms.querySelector(".form__button")

// used to fetch users

async function fetchUsers(){
    
    const users = await fetch("/api/users");
    const result = await users.json();
    
    if(result.success === true && result.rows.length !== 0){
        const table = `
<table>
    <thead>
        <tr>
            ${Object.keys(result.rows[0])
                .map(key => `<th>${key}</th>`)
                .join("")}
                <th>Action</th>
        </tr>
    </thead>

    <tbody>
        ${result.rows
            .map(row => `
                <tr>
                    ${Object.values(row)
                        .map(value => `<td>${value}</td>`)
                        .join("")} 
                        <td class="table__tddelete"><button type="text" class="table__delete" data-id="${row.id}"><i class="fa-solid fa-trash-can"></i></button><button class="table__edit" data-id="${row.id}"><i class="fa-regular fa-pen-to-square fa__edit"></i></button></td>
                </tr>
            `)
            .join("")}

    </tbody>
</table>
`;
  userTable.innerHTML = table;   
}

}
fetchUsers();

// used to insert form dynamicly 
addUserButtonElement.addEventListener("click",()=>{
    if (!maindivElement.contains(forms)) {
        maindivElement.insertBefore(forms, maintableElement);
    }
});
// used to remove the form 
formRemoveButtonElement.addEventListener("click",()=>{
    if (maindivElement.contains(forms)) {
        maindivElement.removeChild(forms);
    }
})
//  used to create user
forms.addEventListener('submit',async(e)=>{
  e.preventDefault()
    const formdata = new FormData(e.target)
    const obj = Object.fromEntries(formdata);
    
    const users = await fetch('/api/createUser',{method:'POST',headers: {
    'Content-Type': 'application/json' 
  },body:JSON.stringify(obj)});
    const result = await users.json();
    if(result.success === true){
       
        if (maindivElement.contains(forms)) {
                maindivElement.removeChild(forms);
            }
        fetchUsers();
        forms.reset();
       
         showToast(`user ${result.rows[0].name} created sussessfully` );
    }else{
     
        showToast("user creation failed");
        
    }
})

// used to delete user 
userTable.addEventListener('click',async(e)=>{
    const deleteButton = e.target.closest(".table__delete");
    if (!deleteButton) return;
    
     const itemId = deleteButton.getAttribute("data-id");
      const rowElement = deleteButton.closest("tr")
      console.log('itemId',itemId)
      console.log('rowElement',rowElement)
      if (confirm("Are you sure you want to delete this user?")) {
        try {
            const response = await fetch(`/api/deleteUser/${itemId}`,{
                method:"DELETE",headers:{
    'Content-Type': 'application/json' 
  }
            })
            const result = await response.json();
            console.log('result',result)
            if(result.success === true){
                showToast("Item deleted successfully!");
            rowElement.remove();
            const remainingRows = userTable.querySelectorAll("tbody tr");
                if (remainingRows.length === 0) {
                    userTable.innerHTML = "<p>No users found.</p>";
                }
            } else {
                  
                    showToast("Failed to delete item from database.");
                }
        } catch (error) {
            console.error("Error deleting item:", error);
                showToast("A network error occurred.");
        }
      }
})
    //   edit user 
    userTable.addEventListener('click',async(e)=>{
        const editButton = e.target.closest('.table__edit')
        if(!editButton) return;
        const userId = editButton.getAttribute("data-id");
        const selectedRow = e.target.closest("tr") ;
        const rowdata = selectedRow.querySelectorAll("td");
        const data = {
            name:rowdata[1].textContent,
            email:rowdata[2].textContent,
        }
        const preFilledFormHTML = returnForm(data);
        const container = document.createElement("div");
    container.innerHTML = preFilledFormHTML;
    const editFormElement = container.firstElementChild;
     if (maindivElement.contains(forms)) {
        maindivElement.removeChild(forms);
    }

    const oldEditForm = maindivElement.querySelector(".main > .form");
    if (oldEditForm) oldEditForm.remove();

    maindivElement.insertBefore(editFormElement, maintableElement);
    editFormElement.addEventListener('submit', async (submitEvent) => {
        submitEvent.preventDefault();
    const formData = new FormData(event.target);
    const updatedUserObj = Object.fromEntries(formData);
    console.log('body',updatedUserObj)
      
      try {
            const response = await fetch(`/api/updateUser/${userId}`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUserObj)
            });
           
            const result = await response.json();
            console.log('id',userId);
            console.log('result',result)
            if (result.success === true) {
               showToast("User updated successfully!");
                editFormElement.remove();
                fetchUsers(); 
            } else {
                showToast("Failed to update user.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            showToast("A network error occurred.");
        }
    });

    const closeBtn = editFormElement.querySelector(".form__button");
    closeBtn.addEventListener("click", () => {
        editFormElement.remove();
    });
})






 


