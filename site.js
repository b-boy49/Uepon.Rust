const nav = document.querySelector('.site-nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

if (nav && navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 720) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function waveifyText(node, counter) {
  Array.from(node.childNodes).forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      for (const ch of child.textContent) {
        if (ch === ' ') {
          frag.appendChild(document.createTextNode(' '));
          continue;
        }
        const span = document.createElement('span');
        span.className = 'wave-char';
        span.textContent = ch;
        span.style.animationDelay = `${counter.i * 0.06}s`;
        counter.i += 1;
        frag.appendChild(span);
      }
      node.replaceChild(frag, child);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      waveifyText(child, counter);
    }
  });
}

document.querySelectorAll('.event-name, .wave-text').forEach((el) => {
  el.setAttribute('aria-label', el.textContent.trim());
  waveifyText(el, { i: 0 });
  el.querySelectorAll('.wave-char').forEach((span) => span.setAttribute('aria-hidden', 'true'));
});

const walker = document.createElement('img');
walker.src = 'images/IMG_0641.jpg';
walker.alt = '';
walker.setAttribute('aria-hidden', 'true');
walker.className = 'site-walker';
document.body.appendChild(walker);
