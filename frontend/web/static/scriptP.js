function getProducts() {
    fetch('http://192.168.80.3:5002/api/products')
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

                // Name
                var nameCell = document.createElement('td');
                nameCell.textContent = product.name;
                row.appendChild(nameCell);

                // Email
                var quantityCell = document.createElement('td');
                quantityCell.textContent = product.quantity;
                row.appendChild(quantityCell);

                // Username
                var costCell = document.createElement('td');
                costCell.textContent = product.cost;
                row.appendChild(costCell);

                var bagCell = document.createElement('td');
                bagCell.textContent = product.bag;
                row.appendChild(bagCell);

                // Actions
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

    fetch('http://192.168.80.3:5002/api/products', {
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

    fetch(`http://192.168.80.3:5002/api/products/${productNum}`, {
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
        fetch(`http://192.168.80.3:5002/api/products/${productNum}`, {
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
