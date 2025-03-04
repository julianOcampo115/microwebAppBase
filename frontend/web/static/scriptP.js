function getProducts() {
    fetch('http://192.168.80.3:5003/api/products', {
    method: 'GET',
    headers: {
       'Content-Type': 'application/json'
       },
    credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            // Handle data
            console.log(data);

            // Get table body
            var productListBody = document.querySelector('#product-list tbody');
            productListBody.innerHTML = ''; // Clear previous data

            // Loop through users and populate table rows
            data.forEach(product => {
                var row = document.createElement('tr');

                // ID del producto (Oculto si no se quiere mostrar)
                var idCell = document.createElement('td');
                idCell.textContent = product.code;  // O usa product.id si ese es el identificador
                row.appendChild(idCell);


                // Name
                var nameCell = document.createElement('td');
                nameCell.textContent = product.name;
                row.appendChild(nameCell);

                // Precio
                var costCell = document.createElement('td');
                costCell.textContent = product.cost;
                row.appendChild(costCell);

                // Cantidad
                var quantityCell = document.createElement('td');
                quantityCell.textContent = product.quantity;
                row.appendChild(quantityCell);

                var bagCell = document.createElement('td');
                bagCell.textContent = product.bag;
                row.appendChild(bagCell);


                // Input para ingresar cantidad a ordenar
                var orderQuantityCell = document.createElement('td');
                var orderInput = document.createElement('input');
                orderInput.type = 'number';
                orderInput.className = 'form-control order-quantity';
                orderInput.value = 0;  // Valor inicial en 0
                orderInput.min = 0;
                orderQuantityCell.appendChild(orderInput);
                row.appendChild(orderQuantityCell);

                // Acciones (Editar y Eliminar)
                var actionsCell = document.createElement('td');


                // Edit link
                var editLink = document.createElement('a');
                editLink.href = `/editP/${product.code}`;
                //editLink.href = `edit.html?id=${user.id}`;
                editLink.textContent = 'Edit';
                editLink.className = 'btn btn-primary mr-2';
                actionsCell.appendChild(editLink);

                // Delete link
                var deleteLink = document.createElement('a');
                deleteLink.href = '#';
                deleteLink.textContent = 'Delete';
                deleteLink.className = 'btn btn-danger';
                deleteLink.addEventListener('click', function() {
                    deleteProduct(product.code);
                });
                actionsCell.appendChild(deleteLink);

                row.appendChild(actionsCell);

                productListBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function createProduct() {
    var data = {
        name: document.getElementById('name').value,
        quantity: document.getElementById('quantity').value,
        cost: document.getElementById('cost').value,
        bag: document.getElementById('bag').value
    };

    fetch('http://192.168.80.3:5003/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle success
        console.log(data);
    })
    .catch(error => {
        // Handle error
        console.error('Error:', error);
    });
}

function updateProduct() {
    var productNum = document.getElementById('product-code').value;
    var data = {
        name: document.getElementById('name').value,
        quantity: document.getElementById('quantity').value,
        cost: document.getElementById('cost').value,
        bag: document.getElementById('bag').value
    };

    fetch(`http://192.168.80.3:5003/api/products/${productNum}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle success
        console.log(data);
        // Optionally, redirect to another page or show a success message
    })
    .catch(error => {
        // Handle error
        console.error('Error:', error);
    });
}



function deleteProduct(productNum) {
    console.log('Deleting product with Num:', productNum);
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`http://192.168.80.3:5003/api/products/${productNum}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle success
            console.log('Product deleted successfully:', data);
            // Reload the user list
            getProducts();
        })
        .catch(error => {
            // Handle error
            console.error('Error:', error);
        });
    }
}



function orderProducts() {
  // Obtener los productos seleccionados y sus cantidades
  console.log("Intentando hacer una orden...");

  const selectedProducts = [];
  const productRows = document.querySelectorAll('#product-list tbody tr');
  productRows.forEach(row => {
    const quantityInput = row.querySelector('input[type="number"]');
    const quantity = parseInt(quantityInput.value);
    if (quantity > 0) {
      //const productId = row.id.split('-')[1]; // Extraer el ID del producto del atributo id de la fila
            //
      var productId = row.querySelector('td:nth-child(1)').textContent;
      //const productId = row.id.textContent; // Extraer el ID del producto del atributo id de la fila
      selectedProducts.push({ id: productId, quantity });
    }

  });

// Si no hay productos seleccionados, mostrar un mensaje de error
  if (selectedProducts.length === 0) {
    alert('Por favor, selecciona al menos un producto para realizar la orden.');
    return;
  }
        //
  // Preparar los datos de la orden
  const orderData = {
    user: {
      name: sessionStorage.getItem('username'),
      email: sessionStorage.getItem('email')
    },
    products: selectedProducts
  };
  // Enviar los datos de la orden al endpoint
  fetch('http://192.168.80.3:5004/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
    credentials: 'include'
  })

  .then(response => response.json())
  .then(data => {
    if (data.message === 'Orden creada exitosamente') {
      console.log('Orden creada exitosamente!');
      // Mostrar un mensaje de confirmación al usuario
      alert('¡Orden creada exitosamente!');
      // Actualizar la interfaz de usuario para reflejar los cambios (opcional)
    } else {
      console.error('Error al crear la orden:', data.message);
      // Mostrar un mensaje de error al usuario
      alert('Error al crear la orden. Por favor, intenta nuevamente.');
    }

  })

  .catch(error => {
    console.error('Error:', error);
    alert('Ocurrió un error al procesar la orden. Por favor, intenta nuevamente.');
  });


  window.location.href = '/orders';
}
