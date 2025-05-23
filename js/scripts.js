    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('[data-scroll]').forEach(wrapper => {
        const row = wrapper.querySelector('.scroll-row');
        const btnLeft = wrapper.querySelector('.scroll-left');
        const btnRight = wrapper.querySelector('.scroll-right');

        let isDown = false;
        let startX;
        let scrollLeft;

        row.addEventListener('mousedown', (e) => {
          isDown = true;
          row.classList.add('active');
          startX = e.pageX - row.offsetLeft;
          scrollLeft = row.scrollLeft;
        });
        row.addEventListener('mouseleave', () => {
          isDown = false;
          row.classList.remove('active');
        });
        row.addEventListener('mouseup', () => {
          isDown = false;
          row.classList.remove('active');
        });
        row.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - row.offsetLeft;
          const walk = (x - startX) * 2;
          row.scrollLeft = scrollLeft - walk;
        });

        const cardsPerPage = 1;
        let currentSlide = 0;

        function updateSlide() {
          const card = row.querySelector('.product-card');
          if (!card) return;
          const cardWidth = card.offsetWidth + 20; // inclui gap
          const offset = currentSlide * cardWidth * cardsPerPage;
          row.style.transform = `translateX(-${offset}px)`;
        }

        btnRight?.addEventListener('click', () => {
          const totalCards = row.querySelectorAll('.product-card').length;
          const card = row.querySelector('.product-card');
          if (!card) return;
          const cardWidth = card.offsetWidth + 20;
          const visibleWidth = wrapper.offsetWidth;
          const totalWidth = totalCards * cardWidth;

          const maxSlide = Math.ceil((totalWidth - visibleWidth) / (cardWidth * cardsPerPage));

          if (currentSlide < maxSlide) {
            currentSlide++;
            updateSlide();
          }
        });

        btnLeft?.addEventListener('click', () => {
          if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
          }
        });

        //Revela da esquerda para a direita quando ScrollDown a tela
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('show');
            }
          });
        }, {
          threshold: 0.25
        });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    });

    //Flip    
    document.querySelectorAll('.card').forEach(card => {      
      card.addEventListener('click', () => {        
        card.classList.toggle('flip');      
      });    
    });

  let flashcards = [];
  let currentCardIndex = 0;

  function renderCard(data) {
    const container = document.getElementById('card-area');
    container.innerHTML = `
      <div class="card">
        <div class="card-inner">
          <div class="card-content card-front">
            <div class="question">${data.pergunta}</div>
          </div>
          <div class="card-content card-back">
            <div class="question">${data.pergunta}</div>
            <div class="answer">${data.resposta}</div>
          </div>
        </div>
      </div>
    `;

    // Flip ao clicar
    const card = container.querySelector('.card');
    if (card) {
      card.addEventListener('click', () => card.classList.toggle('flip'));
    }
  }

  function showEndScreen() {
  const container = document.getElementById('card-area');
  container.innerHTML = `
    <div class="card">
      <div class="card-inner">
        <div class="card-content card-front">
          <div class="end-screen">
            <h2>Quer conferir mais flashcards?</h2>
            <hr />
            <a href="flashcards.html" class="cta-btn">Ver todos os pacotes</a>
            <button id="restart-btn" class="restart-btn">Recomeçar do início</button>
          </div>
        </div>
        <div class="card-content card-back"></div>
      </div>
    </div>
  `;

    // opcional: remover controles abaixo
    document.querySelector('.card-controls')?.classList.add('hidden');

    // evento do botão reiniciar
    document.getElementById('restart-btn')?.addEventListener('click', () => {
      currentCardIndex = 0;
      renderCard(flashcards[0]);
      document.querySelector('.card-controls')?.classList.remove('hidden');
    });
  }

  // Fetch do JSON
  fetch('js/flashcards.json')
    .then(res => res.json())
    .then(data => {
      flashcards = data;
      if (flashcards.length > 0) renderCard(flashcards[0]);
    });

  // Próximo card
  document.querySelectorAll('.btn-rating').forEach(button => {
    button.addEventListener('click', () => {
      if (flashcards.length === 0) return;

      const nivel = button.dataset.nivel; // Ex: 'facil', 'medio', 'dificil'
      console.log('Nível marcado:', nivel); // Para uso futuro: salvar estatísticas, etc.

      currentCardIndex++;

      if (currentCardIndex >= flashcards.length) {
        showEndScreen(); // nova função que cria a tela final
      } else {
        renderCard(flashcards[currentCardIndex]);
      }

    });
  });

  // Rola tela suave
  document.querySelector('.scroll-down-icon')?.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector('#vitrine1');
    if (target) {
      const offset = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  });

  // Clique FAQ
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      item.classList.toggle('active');
    });
  });

  // Mostra sticky CTA depois de 400px
  const stickyBtn = document.querySelector('.sticky-cta-mobile');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      stickyBtn.classList.remove('hidden');
    } else {
      stickyBtn.classList.add('hidden');
    }
  });
});