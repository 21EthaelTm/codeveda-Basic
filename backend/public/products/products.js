const productTable = document.querySelector(".main__table");
const addProductButton = document.querySelector(".main__add-button");
const maindiv = document.querySelector(".main");

const  returnForm =(data = null) =>{
 let form = ` <form class="form" id="${data ? 'edit-product-form' : 'create-product-form'}">
  <fieldset class="form__fieldset">
    <legend>${data ? "Create Product" :"Update Product"}</legend>
    <div class="form__div">
        <label for="product_name" class="form__label">Product Name</label>
        <input class="form__input" type="text" id="product_name" name="product_name" value="${data?.product_name ?? ''}" required>
    </div>
    <div class="form__div">
        <label for="product_type" class="form__label">Product Type</label>
        <input class="form__input" type="text" id="product_type" name="product_type" value="${data?.product_type ?? ''}" required>
    </div>
    <div class="form__div">
        <label for="product_description" class="form__label">Product Description</label>
        <input class="form__input" type="text" id="product_description" name="product_description" value="${data?.product_description ?? ''}" required>
    </div>
    <div class="form__div">
        <label for="product_exp_date" class="form__label">Product Expiredate</label>
        <input class="form__input" type="text" id="product_exp_date" name="product_exp_date" value="${data?.product_exp_date ?? ''}" required>
    </div>
    <div class="form__div">
        <label for="product_manu_date" class="form__label">Product Manufactured Date</label>
        <input class="form__input" type="text" id="product_manu_date" name="product_manu_date" value="${data?.product_manu_date ?? ''}" required>
    </div>
    <div class="form__div">
        <label for="prod_price" class="form__label">Product Price</label>
        <input class="form__input" type="text" id="prod_price" name="prod_price" value="${data?.prod_price ?? ''}" required>
    </div>
    <button type="text" class="form__button">
        <i class="fa-solid fa-xmark"></i>
    </button>
    </fieldset>
  <button class="form__submit" type="submit">Submit</button>
     
</form>`;
return form
}
const temp = document.createElement("div");
temp.innerHTML = returnForm();
const formElement = temp.firstElementChild;
const formRemoveButtonElement =formElement.querySelector('.form__button')
async function fetchProducts(){
    const products = await fetch("/api/products");
    const result = await products.json();
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
                        <td class="table__tddelete"><div class="td-div"><button type="text" class="table__delete" data-id="${row.id}"><i class="fa-solid fa-trash-can icon__size"></i></button><button class="table__edit" data-id="${row.id}"><i class="fa-regular fa-pen-to-square icon__size"></i></button></div></td>
                </tr>
            `)
            .join("")}
    </tbody>
</table>
`;
  productTable.innerHTML = table;   
}

}
fetchProducts();
// 

// used to insert form dynamicly 
addProductButton.addEventListener('click',()=>{
    if(!maindiv.contains(formElement)){
 maindiv.insertBefore(formElement,productTable)
 }
})

formRemoveButtonElement.addEventListener("click",()=>{
    if(maindiv.contains(formElement)){
    maindiv.removeChild(formElement)}
})
// used to create product
formElement.addEventListener("submit",async(e)=>{
    console.log("inside form event listen")
    e.preventDefault();
    const formdata = new FormData(formElement);
    const obj = Object.fromEntries(formdata);
    
    if(maindiv.contains(formElement)){
    maindiv.removeChild(formElement)}
    const product = await fetch('/api/createProduct',{
        method:'POST',headers: {
    'Content-Type': 'application/json' 
  },body:JSON.stringify(obj)
    })
    const result = await product.json();
    if(result.success === true){
        showToast(`product ${result.rows[0].product_name} created sussessfully`);
        formElement.reset();
        fetchProducts();
    } else{
        showToast(`Product creation failed`);
    }
})

// used to delete product

productTable.addEventListener('click',async(e)=>{
    const deleteButton = e.target.closest(".table__delete");
    console.log(deleteButton)
    if (!deleteButton) return;
    console.log()
     const itemId = deleteButton.getAttribute("data-id");
      const rowElement = deleteButton.closest("tr")
      console.log('itemId',itemId)
      console.log('rowElement',rowElement)
      if (confirm("Are you sure you want to delete this Product?")) {
        try {
            const response = await fetch(`/api/deleteProduct/${itemId}`,{
                method:"DELETE",headers:{
    'Content-Type': 'application/json' 
  }
            })
            const result = await response.json();
            console.log('result',result)
            if(result.success === true){
                showToast("Item deleted successfully!");
            rowElement.remove();
            
            const remainingRows = productTable.querySelectorAll("tbody tr");
                if (remainingRows.length === 0) {
                    productTable.innerHTML = "<p>No users found.</p>";
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

// used to edit product
 productTable.addEventListener('click',async(e)=>{
    try {
        
    
   const editbutton = e.target.closest('.table__edit')
   if(!editbutton) return;
   const tableTHtr = productTable.querySelectorAll('tr');
   const tableth = [...tableTHtr[0].querySelectorAll('th')];
   const parentTr = e.target.closest('tr');
   const allvaluestd = [...parentTr.querySelectorAll('td')];
   let data ={};
   for(let i =0 ;i<tableth.length - 1;i++){
    const keyName = tableth[i].textContent.trim();
     data[keyName] = allvaluestd[i].textContent.trim() ;
   }
    
   const productid = editbutton.getAttribute('data-id');
   
    
     const conatiner = document.createElement('div');
     const form = returnForm(data);
     conatiner.innerHTML = form;
    const editform = conatiner.firstElementChild;
    const removeformbutton = editform.querySelector('.form__button')
     if(maindiv.contains(formElement)){
        formElement.remove()
     }
     const oldEditForm = document.getElementById('edit-product-form');
        if (oldEditForm) oldEditForm.remove();

         
     maindiv.insertBefore(editform,productTable)
         
    removeformbutton.addEventListener('click',()=>{
        if(maindiv.formElement){
            formElement.remove()
        }
    })
    editform.addEventListener('submit',async(e)=>{
        e.preventDefault()
        const formdata = new FormData(e.target);
        const data = Object.fromEntries(formdata);
        const responce = await fetch(`/api/editproduct/${productid}`,{method:"PATCH",headers:{'Content-Type': 'application/json'},body:JSON.stringify(data)})
        const result = await responce.json();
         if(result.success === true){
            showToast('product edition successfull')
            editform.remove()
           fetchProducts();
         } else {
            showToast('edit failed')
         }
        })
       
    } catch (error) {
        console.log('error',error)
    }
    

 })