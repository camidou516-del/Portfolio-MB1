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

  // 3. LIGHTBOX / AGRANDISSEMENT DES IMAGES DE LA GALERIE
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const closeModalBtn = document.getElementById('modal-close');

  if (modal && modalImg && closeModalBtn) {
    // Ouvrir la modale
    const openModal = (src) => {
      modalImg.src = src;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Bloque le défilement de la page
    };

    // Fermer la modale
    const closeModal = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = 'auto'; // Rétablit le défilement
      setTimeout(() => {
        modalImg.src = '';
      }, 300);
    };

    // Écouteur global pour intercepter le clic sur n'importe quelle image de galerie
    document.addEventListener('click', (e) => {
      if (
        e.target.tagName === 'IMG' &&
        (e.target.closest('.gallery, #gallery, .coulisses-grid, .portfolio-card, [data-gallery]') ||
          e.target.classList.contains('gallery-img'))
      ) {
        openModal(e.target.src);
      }
    });

    // Fermeture via la croix
    closeModalBtn.addEventListener('click', closeModal);

    // Fermeture lors d'un clic en dehors de l'image
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Fermeture avec la touche Échap (Escape)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }
});


// 4. GESTION DU FORMULAIRE DE CONTACT (WEB3FORMS)
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

  // GESTION DU ZOOM DES IMAGES (Compatible avec les images dynamiques projectsData)
document.addEventListener('click', (e) => {
  // Détecte le clic sur n'importe quelle balise <img> de la page (sauf celle de la modale elle-même)
  if (e.target.tagName === 'IMG' && !e.target.closest('#image-modal')) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');

    if (modal && modalImg) {
      e.stopPropagation(); // Évite les conflits si l'image est dans une carte cliquable
      modalImg.src = e.target.src;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Bloque le défilement de la page
    }
  }
});

// Fermeture au clic sur la croix ou en dehors de l'image
document.addEventListener('click', (e) => {
  const modal = document.getElementById('image-modal');
  if (!modal || !modal.classList.contains('active')) return;

  if (e.target.id === 'modal-close' || e.target === modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Rétablit le défilement
  }
});

// Fermeture avec la touche Échap
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('image-modal');
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});
}