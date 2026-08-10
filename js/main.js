document.addEventListener('DOMContentLoaded', () => {
  // 1. GESTION DU MENU BURGER MOBILE
  const menuToggle = document.getElementById('mobile-menu');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-item');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Fermer le menu lors du clic sur un lien
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // 2. FILTRES DU PORTFOLIO
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});


const form = document.getElementById('contact-form');
const result = document.getElementById('form-result');
const submitBtn = document.getElementById('btn-submit');

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Modification du texte du bouton pendant l'envoi
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
            result.style.display = "block";
            result.style.backgroundColor = "rgba(40, 167, 69, 0.2)";
            result.style.color = "#28a745";
            result.style.border = "1px solid #28a745";
            result.innerHTML = "Message envoyé avec succès ! Merci.";
            form.reset();
        } else {
            result.style.display = "block";
            result.style.backgroundColor = "rgba(220, 53, 69, 0.2)";
            result.style.color = "#dc3545";
            result.style.border = "1px solid #dc3545";
            result.innerHTML = json.message || "Une erreur est survenue.";
        }
    })
    .catch(error => {
        result.style.display = "block";
        result.style.backgroundColor = "rgba(220, 53, 69, 0.2)";
        result.style.color = "#dc3545";
        result.style.border = "1px solid #dc3545";
        result.innerHTML = "Une erreur s'est produite. Veuillez réessayer.";
    })
    .then(function() {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        setTimeout(() => {
            result.style.display = "none";
        }, 5000); // Le message disparaît après 5 secondes
    });
  });
}