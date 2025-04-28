document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const amountEl = document.getElementById('amount');
    const fromCurrencyEl = document.getElementById('from-currency');
    const toCurrencyEl = document.getElementById('to-currency');
    const resultEl = document.getElementById('result');
    const swapBtn = document.getElementById('swap');
    const rateInfoEl = document.getElementById('rate-info');
    const updateTimeEl = document.getElementById('update-time');
    
    // Exchange rates data
    let exchangeRates = {};
    let lastUpdated = '';
    
    // Fetch exchange rates from Frankfurter.app API
    async function fetchExchangeRates() {
        try {
            const response = await fetch('https://api.frankfurter.app/latest?from=USD');
            const data = await response.json();
            
            if (data.rates) {
                exchangeRates = data.rates;
                exchangeRates.USD = 1; // เพิ่ม USD เข้าไปเพราะ API นี้ไม่รวม USD ใน rates
                lastUpdated = new Date().toLocaleString();
                updateTimeEl.textContent = lastUpdated + ' (Frankfurter.app)';
                
                populateCurrencies();
                calculate();
            }
        } catch (error) {
            console.error('Error using Frankfurter API:', error);
            // Fallback rates ถ้า API ล้มเหลว
            exchangeRates = {
                USD: 1,
                EUR: 0.93,
                THB: 36.5,
                JPY: 151.2,
                GBP: 0.80,
                AUD: 1.52
            };
            lastUpdated = new Date().toLocaleString() + ' (offline)';
            updateTimeEl.textContent = lastUpdated;
            populateCurrencies();
            calculate();
        }
    }
    
    // Populate currency dropdowns
    function populateCurrencies() {
        // Clear existing options
        fromCurrencyEl.innerHTML = '';
        toCurrencyEl.innerHTML = '';
        
        const currencies = Object.keys(exchangeRates).sort();
        
        currencies.forEach(currency => {
            const option1 = document.createElement('option');
            option1.value = currency;
            option1.textContent = currency;
            
            const option2 = document.createElement('option');
            option2.value = currency;
            option2.textContent = currency;
            
            fromCurrencyEl.appendChild(option1);
            toCurrencyEl.appendChild(option2);
        });
        
        // Set default values
        fromCurrencyEl.value = 'USD';
        toCurrencyEl.value = 'THB';
    }
    
    // Calculate conversion
    function calculate() {
        const amount = parseFloat(amountEl.value);
        const fromCurrency = fromCurrencyEl.value;
        const toCurrency = toCurrencyEl.value;
        
        // แก้ syntax error ตรงนี้
        if (isNaN(amount) || amount < 0) {
            resultEl.textContent = 'Please enter a valid amount';
            return;
        }
        
        const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
        const convertedAmount = amount * rate;
        
        resultEl.textContent = `${amount.toLocaleString()} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
        rateInfoEl.textContent = `1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
    }
    
    // Event Listeners
    amountEl.addEventListener('input', calculate);
    fromCurrencyEl.addEventListener('change', calculate);
    toCurrencyEl.addEventListener('change', calculate);
    
    // Swap currencies
    swapBtn.addEventListener('click', () => {
        const temp = fromCurrencyEl.value;
        fromCurrencyEl.value = toCurrencyEl.value;
        toCurrencyEl.value = temp;
        calculate();
    });
    
    // Initialize
    fetchExchangeRates();
});