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

const pet = document.createElement('img');
pet.alt = '';
pet.setAttribute('aria-hidden', 'true');
pet.className = 'site-walker';
document.body.appendChild(pet);

const petRunningFrames = Array.from({ length: 8 }, (_, index) =>
  `images/pet/running-right/${String(index).padStart(2, '0')}.png`
);
const petIdleFrames = Array.from({ length: 6 }, (_, index) =>
  `images/pet/idle/${String(index).padStart(2, '0')}.png`
);
const petIdleSequence = [0, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0];

const petState = {
  lane: 0,
  x: -72,
  speed: 2.2,
  mode: 'running',
  runningFrame: 0,
  runningTick: 0,
  pauseTick: 0,
  idleIndex: 0,
  idleHold: 0,
};

function petLaneY() {
  const height = window.innerHeight;
  return petState.lane === 0 ? 18 : Math.max(18, height - 65 - 28);
}

function startPetPause(minTicks = 30, maxTicks = 52) {
  petState.mode = 'paused';
  petState.pauseTick = Math.floor(Math.random() * (maxTicks - minTicks + 1)) + minTicks;
  petState.idleIndex = 0;
  petState.idleHold = 0;
  pet.src = petIdleFrames[petIdleSequence[0]];
}

function updatePetRunning() {
  petState.x += petState.speed;
  petState.runningTick += 1;
  if (petState.runningTick >= 3) {
    petState.runningTick = 0;
    petState.runningFrame = (petState.runningFrame + 1) % petRunningFrames.length;
  }
  pet.src = petRunningFrames[petState.runningFrame];

  if (petState.x > 100 && Math.random() < 0.015) {
    startPetPause(28, 46);
  } else if (petState.x >= window.innerWidth + 12) {
    petState.lane = petState.lane === 0 ? 1 : 0;
    petState.x = -72;
    startPetPause(34, 56);
  }
}

function updatePetPaused() {
  petState.pauseTick -= 1;
  petState.idleHold += 1;
  if (petState.idleHold >= 2) {
    petState.idleHold = 0;
    petState.idleIndex = (petState.idleIndex + 1) % petIdleSequence.length;
  }
  pet.src = petIdleFrames[petIdleSequence[petState.idleIndex]];

  if (petState.pauseTick <= 0) {
    petState.mode = 'running';
    petState.runningFrame = 0;
    petState.runningTick = 0;
    pet.src = petRunningFrames[0];
  }
}

function tickPet() {
  if (petState.mode === 'running') {
    updatePetRunning();
  } else {
    updatePetPaused();
  }

  pet.style.transform = `translate(${petState.x}px, ${petLaneY()}px)`;
  requestAnimationFrame(tickPet);
}

pet.src = petRunningFrames[0];
tickPet();
