
const API_URL = 'https://crudcrud.com/api/ade5c971404c4806be45c09673e39b90/products';

const productList = document.getElementById('product-list');

const totalPrice = document.getElementById('total-price');

async function getProducts() {
  try {
    const response = await axios.get(API_URL);
    const products = response.data;
    return products;
  } catch (error) {
    console.error(error);
  }
}

function displayProducts(products) {
  
  productList.innerHTML = '';

  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${product.name} - ${product.price}</span>
      <button class="delete-button" data-id="${product._id}">Delete</button>
    `;
    productList.appendChild(li);
  });

  const prices = products.map(product => parseFloat(product.price));
  const total = prices.reduce((sum, price) => sum + price, 0);
  totalPrice.textContent = total.toFixed(2);
}

async function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.elements.name.value;
  const price = form.elements.price.value;

  try {
    const response = await axios.post(API_URL, { name, price });
    const product = response.data;

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${product.name} - ${product.price}</span>
      <button class="delete-button" data-id="${product.id}">Delete</button>
    `;
    productList.appendChild(li);

    const prices = Array.from(productList.querySelectorAll('li'))
      .map(li => parseFloat(li.querySelector('span').textContent.split(' - ')[1]));
    const total = prices.reduce((sum, price) => sum + price, 0);
    totalPrice.textContent = total.toFixed(2);

    form.reset();
  } catch (error) {
    console.error(error);
  }
}

async function handleDeleteClick(event) {
  if (!event.target.matches('.delete-button')) return;

  const productId = event.target.dataset.id;

  try {
    await axios.delete(`${API_URL}/${productId}`);

    const li = event.target.parentNode;
    productList.removeChild(li);

    const prices = Array.from(productList.querySelectorAll('li'))
      .map(li => parseFloat(li.querySelector('span').textContent.split(' - ')[1]));
    const total = prices.reduce((sum, price) => sum + price, 0);
    totalPrice.textContent = total.toFixed(2);
  } catch (error) {
    console.error(error);
  }
}

window.addEventListener('load', async () => {
  
  const products = await getProducts();
  displayProducts(products);
});

document.getElementById('product-form').addEventListener('submit', handleSubmit);

productList.addEventListener('click', handleDeleteClick);
