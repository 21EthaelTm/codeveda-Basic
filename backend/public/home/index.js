async function fetchresult(){
    const userTotal = document.querySelector(".main__total--users")
    const productTotal = document.querySelector(".main__total--products")
    const response = await fetch("/api/users");
    const products = await fetch("/api/products");
     const result = await response.json();
     const result2 = await products.json();
     if(result.success === true && result.rows.length !== 0){
     userTotal.textContent= result.rows.length
     } else {
        userTotal.textContent= 0
     }
      if(result2.success === true && result2.rows.length !== 0){
     productTotal.textContent= result2.rows.length
     } else {
        productTotal.textContent= 0
     }
    console.log(result.rows.length)
}
fetchresult();