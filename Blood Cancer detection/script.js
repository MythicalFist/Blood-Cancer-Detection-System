document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // --- Form Submission & Analysis Simulation ---
    const analysisForm = document.getElementById('analysis-form');
    const resultContainer = document.getElementById('result-container');
    const resultBox = document.getElementById('result-box');
    const statusMsg = document.getElementById('status-msg');

    if (analysisForm) {
        analysisForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation check (browser handles most via 'required' and 'type=number')
            // Here you would typically gather data:
            // const formData = new FormData(analysisForm);

            analysisForm.classList.add('hidden'); // Hide form
            resultContainer.classList.remove('hidden'); // Show result container
            statusMsg.innerText = 'Processing blood parameters...';
            statusMsg.style.display = 'block';
            resultBox.classList.add('hidden');

            // Collect data
            const formData = {
                Gender: document.getElementById('gender').value,
                WBC: document.getElementById('wbc').value,
                Hgb: document.getElementById('hgb').value,
                Platelet: document.getElementById('platelet').value,
                RBC: document.getElementById('rbc').value,
                HCT: document.getElementById('hct').value,
                MCV: document.getElementById('mcv').value,
                Neutrophil: document.getElementById('neutrophil').value,
                Lymphocyte: document.getElementById('lymphocyte').value
            };

            // Call API
            fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then(response => response.json())
                .then(data => {
                    statusMsg.style.display = 'none';
                    resultBox.classList.remove('hidden');

                    // Update Badge and Text based on prediction
                    const badge = resultBox.querySelector('.badge');
                    const resultText = resultBox.querySelector('p');
                    const resultTitle = resultBox.querySelector('h4');

                    if (data.risk_prediction) {
                        badge.className = 'badge ' + (data.risk_prediction === 'Low Risk' ? 'success' : 'warning');
                        badge.innerText = data.risk_prediction;

                        if (data.risk_prediction === 'Low Risk') {
                            badge.style.backgroundColor = '#c6f6d5';
                            badge.style.color = '#22543d';
                            resultText.innerText = "The entered blood parameters appear to be within normal ranges. Low risk detected.";
                        } else {
                            badge.style.backgroundColor = '#fed7d7';
                            badge.style.color = '#822727';
                            resultText.innerText = `Potential indicators found. The system has flagged this as ${data.risk_prediction}. Please consult a specialist.`;
                        }
                    } else if (data.error) {
                        badge.className = 'badge warning';
                        badge.innerText = "Error";
                        resultText.innerText = "Error processing data: " + data.error;
                    }

                    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                })
                .catch((error) => {
                    console.error('Error:', error);
                    statusMsg.style.display = 'none';
                    resultBox.classList.remove('hidden');

                    // Fallback for demo if API is offline
                    const badge = resultBox.querySelector('.badge');
                    badge.className = 'badge warning';
                    badge.innerText = "API Unavailable";
                    const resultText = resultBox.querySelector('p');
                    resultText.innerHTML = "Could not connect to the analysis server. <br>Please ensure the Jupyter Notebook is running and the API is active.<br><small style='color:#999'>(Showing demo simulation result: Low Risk)</small>";
                });
        });
    }

    // Restore form visibility when "Analyze Another" is clicked (handled inline in HTML, 
    // but we can add listener here if we want cleaner HTML)
    // The inline onclick handles: form.reset() and hiding result-container.
    // We also need to make sure the form is visible again.
    const analyzeAnotherBtn = document.querySelector('.action-buttons button');
    if (analyzeAnotherBtn) {
        analyzeAnotherBtn.addEventListener('click', () => {
            analysisForm.classList.remove('hidden');
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
