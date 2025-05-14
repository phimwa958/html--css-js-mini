        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        function init() {
            updateTotals();
            renderTransactions();
        }

        function addTransaction(e) {
            e.preventDefault();

            const transaction = {
                id: Date.now(),
                type: document.getElementById('type').value,
                amount: parseFloat(document.getElementById('amount').value),
                text: document.getElementById('description').value
            };

            transactions.push(transaction);
            saveToLocalStorage();
            updateTotals();
            renderTransactions();
            document.getElementById('transactionForm').reset();
        }

        function deleteTransaction(id) {
            transactions = transactions.filter(t => t.id !== id);
            saveToLocalStorage();
            updateTotals();
            renderTransactions();
        }

        function updateTotals() {
            const income = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const expense = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            const total = income - expense;

            document.getElementById('totalAmount').textContent = `${total.toFixed(2)} ฿`;
            document.getElementById('incomeAmount').textContent = `${income.toFixed(2)} ฿`;
            document.getElementById('expenseAmount').textContent = `${expense.toFixed(2)} ฿`;
        }

        function renderTransactions() {
            const list = document.getElementById('transactionList');
            list.innerHTML = transactions
                .map(transaction => `
                    <div class="transaction-item">
                        <div>
                            <span style="color: ${transaction.type === 'income' ? '#2ecc71' : '#e74c3c'}">
                                ${transaction.text}
                            </span>
                        </div>
                        <div>
                            ${transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)} ฿
                            <span class="delete-btn" onclick="deleteTransaction(${transaction.id})">ลบ</span>
                        </div>
                    </div>
                `)
                .join('');
        }

        function saveToLocalStorage() {
            localStorage.setItem('transactions', JSON.stringify(transactions));
        }

        // Event Listeners
        document.getElementById('transactionForm').addEventListener('submit', addTransaction);

        // Initialize App
        init();