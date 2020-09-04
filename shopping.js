const shoppingForm = document.querySelector('.shopping');
const itemList = document.querySelector('.list');

// We need an array to hold the state(data/list items)
let items = [];

// Submit handler
function handleSubmit(e) {
  e.preventDefault();
  const name = e.currentTarget.item.value;
  const item = {
    id: Date.now(),
    name,
    compleate: false,
  };

  // Push the items into state
  items.push(item);
  // console.log(`There are now ${items.length} in your list`);
  // e.currentTarget.item.value = '';
  // or
  e.target.reset();
  // dispatch custom event for renderingthe list
  itemList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

// Display items
function displayItems() {
  const html = items
    .map(
      item => `
    <li class="shopping-item">
    <input value="${item.id}" type="checkbox"
    ${item.compleate ? 'checked' : ''}
    >
    <span class="itemName">${item.name}</span>
    <button value="${item.id}">&times;</button>
    </li>
  `
    )
    .join('');
  return (itemList.innerHTML = html);
}

// Add state items to local storage
function mirrorToLocalStorage() {
  localStorage.setItem('items', JSON.stringify(items));
}

// Restore state from local storage
function restoreFromLocalStorage() {
  const lsList = JSON.parse(localStorage.getItem('items'));
  if (lsList.length) {
    items.push(...lsList);
    itemList.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

// Remove item
function removeItem(id) {
  items = items.filter(item => item.id !== id);
  itemList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

// Checked/unchecked
function checkItems(id) {
  console.log('Checked', id);
  const itemRef = items.find(item => item.id === id);
  itemRef.compleate = !itemRef.compleate;
  itemList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

shoppingForm.addEventListener('submit', handleSubmit);
itemList.addEventListener('itemsUpdated', displayItems);
itemList.addEventListener('itemsUpdated', mirrorToLocalStorage);

// Event delegation: we listen on the ul(list) and check
// for the thing that we clicked on. (so whenever the ul
// changes we dont have to update our event listners)
itemList.addEventListener('click', function(event) {
  const id = parseInt(event.target.value);
  if (event.target.matches('button')) {
    removeItem(id);
  }
  if (event.target.matches('input[type="checkbox"')) {
    checkItems(id);
  }
});

restoreFromLocalStorage();
