const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteForm = document.getElementById('addQuoteForm');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const saveQuoteButton = document.getElementById('saveQuote');
const cancelAddButton = document.getElementById('cancelAdd');

let quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  // ... more quotes
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.textContent = `${randomQuote.text} - ${randomQuote.author}`;
}

function createAddQuoteForm() {
  addQuoteForm.style.display = 'block';
}

function cancelAddQuote() {
  addQuoteForm.style.display = 'none';
  newQuoteText.value = '';
  newQuoteCategory.value = '';
}

function addQuote() {
  const newQuote = {
    text: newQuoteText.value,
    category: newQuoteCategory.value
  };
  quotes.push(newQuote);
  newQuoteText.value = '';
  newQuoteCategory.value = '';
  addQuoteForm.style.display = 'none';
  showRandomQuote(); // Show a random quote after adding
}

newQuoteButton.addEventListener('click', showRandomQuote);
addQuoteButton.addEventListener('click', createAddQuoteForm);
saveQuoteButton.addEventListener('click', addQuote);
cancelAddButton.addEventListener('click', cancelAddQuote);
