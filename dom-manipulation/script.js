document.addEventListener('DOMContentLoaded', function() {
    const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Replace with actual server URL
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Don't watch the clock; do what it does. Keep going.", category: "Motivation" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteFormContainer = document.getElementById('addQuoteFormContainer');
    const categoryFilter = document.getElementById('categoryFilter');
    const exportQuotesButton = document.getElementById('exportQuotes');
    const importFileInput = document.getElementById('importFile');
    const conflictNotification = document.getElementById('conflictNotification');
    const syncNotification = document.getElementById('syncNotification'); // Add a new element for sync notifications

    function populateCategories() {
        const categories = [...new Set(quotes.map(quote => quote.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        const savedCategory = localStorage.getItem('selectedCategory');
        if (savedCategory) {
            categoryFilter.value = savedCategory;
        }
    }

    function showRandomQuote() {
        const filteredQuotes = categoryFilter.value === 'all' ? quotes : quotes.filter(quote => quote.category === categoryFilter.value);
        if (filteredQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const randomQuote = filteredQuotes[randomIndex];
            quoteDisplay.innerHTML = `
                <div class="quote">${randomQuote.text}</div>
                <div class="category">- ${randomQuote.category}</div>
            `;
        } else {
            quoteDisplay.innerHTML = '<div class="quote">No quotes available for this category.</div>';
        }
    }

    function filterQuotes() {
        showRandomQuote();
        localStorage.setItem('selectedCategory', categoryFilter.value);
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
            saveQuotes();

            // Clear the input fields
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';

            // Update categories
            if (![...categoryFilter.options].some(option => option.value === newQuoteCategory)) {
                const option = document.createElement('option');
                option.value = newQuoteCategory;
                option.textContent = newQuoteCategory;
                categoryFilter.appendChild(option);
            }

            // Show the new quote
            showRandomQuote();

            // Sync with server
            syncQuotes();
        } else {
            alert('Please enter both a quote and a category.');
        }
    }

    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    function exportQuotesToJson() {
        const quotesJson = JSON.stringify(quotes, null, 2);
        const blob = new Blob([quotesJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    window.importFromJsonFile = function(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            populateCategories();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    async function fetchQuotesFromServer() {
        try {
            const response = await fetch(serverUrl);
            const serverQuotes = await response.json();
            const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

            // Simple conflict resolution: server data takes precedence
            if (JSON.stringify(serverQuotes) !== JSON.stringify(localQuotes)) {
                quotes = serverQuotes;
                saveQuotes();
                populateCategories();
                showRandomQuote();
                conflictNotification.style.display = 'block';
            } else {
                conflictNotification.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching data from server:', error);
        }
    }

    async function syncQuotes() {
        try {
            // POST local data to the server
            await fetch(serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quotes)
            });

            // Notify user of successful sync
            if (syncNotification) {
                syncNotification.textContent = 'Quotes synced with server!';
                setTimeout(() => {
                    syncNotification.textContent = '';
                }, 3000); // Clear notification after 3 seconds
            }

            // Fetch data from server periodically
            setInterval(fetchQuotesFromServer, 10000); // Fetch data every 10 seconds
        } catch (error) {
            console.error('Error syncing data with server:', error);
        }
    }

    newQuoteButton.addEventListener('click', showRandomQuote);
    exportQuotesButton.addEventListener('click', exportQuotesToJson);

    // Initial setup
    populateCategories();
    showRandomQuote();
    createAddQuoteForm();
    syncQuotes();
});
