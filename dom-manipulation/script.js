document.addEventListener('DOMContentLoaded', function() {
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Don't watch the clock; do what it does. Keep going.", category: "Motivation" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteFormContainer = document.getElementById('addQuoteFormContainer');

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `
            <div class="quote">${randomQuote.text}</div>
            <div class="category">- ${randomQuote.category}</div>
        `;
    }

    function createAddQuoteForm() {
        const newQuoteTextInput = document.createElement('input');
        newQuoteTextInput.id = 'newQuoteText';
        newQuoteTextInput.type = 'text';
        newQuoteTextInput.placeholder = 'Enter a new quote';

        const newQuoteCategoryInput = document.createElement('input');
        newQuoteCategoryInput.id = 'newQuoteCategory';
        newQuoteCategoryInput.type = 'text';
        newQuoteCategoryInput.placeholder = 'Enter quote category';

        const addQuoteButton = document.createElement('button');
        addQuoteButton.textContent = 'Add Quote';
        addQuoteButton.addEventListener('click', addQuote);

        addQuoteFormContainer.appendChild(newQuoteTextInput);
        addQuoteFormContainer.appendChild(newQuoteCategoryInput);
        addQuoteFormContainer.appendChild(addQuoteButton);
    }

    function addQuote() {
        const newQuoteText = document.getElementById('newQuoteText').value;
        const newQuoteCategory = document.getElementById('newQuoteCategory').value;

        if (newQuoteText && newQuoteCategory) {
            const newQuote = { text: newQuoteText, category: newQuoteCategory };
            quotes.push(newQuote);

            // Clear the input fields
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';

            // Show the new quote
            quoteDisplay.innerHTML = `
                <div class="quote">${newQuote.text}</div>
                <div class="category">- ${newQuote.category}</div>
            `;
        } else {
            alert('Please enter both a quote and a category.');
        }
    }

    newQuoteButton.addEventListener('click', showRandomQuote);

    // Display an initial quote when the page loads
    showRandomQuote();

    // Create the form to add new quotes when the page loads
    createAddQuoteForm();
});
