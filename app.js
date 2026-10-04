const STORAGE_KEY = 'mizan-journal-v1';

const dailyQuiz = [
  {
    question: 'Combien de piliers de l\'Islam ?',
    answers: ['3', '4', '5', '6'],
    correct: 2,
    explanation: 'Les 5 piliers sont : Shahada, Salah, Zakat, Sawm, Hajj.'
  },
  {
    question: 'Quelle est la première parole du Coran ?',
    answers: ['Bismillah', 'Alhamdulillah', 'Aamantu', 'SubhanAllah'],
    correct: 0,
    explanation: 'La première parole est : « Bismillahir Rahmanir Rahim ».'
  },
  {
    question: 'Qui est le Prophète de l\'Islam ?',
    answers: ['Isa', 'Musa', 'Muhammad', 'Ibrahim'],
    correct: 2,
    explanation: 'Le Prophète est Muhammad ﷺ.'
  },
  {
    question: 'Combien de fois se récite la basmala dans le hadith mentionné ?',
    answers: ['2 fois', '3 fois', '5 fois', '7 fois'],
    correct: 1,
    explanation: 'La basmala est souvent récitée 3 fois dans diverses adhkar.'
  },
  {
    question: 'Quelle action est recommandée chaque matin ?',
    answers: ['Manger beaucoup', 'Faire adhkar', 'Jouer aux jeux', 'Dormir encore'],
    correct: 1,
    explanation: 'Le dhikr matin et soir est recommandé et très bénéfique.'
  }
];

const defaultState = {
  title: '',
  entry: '',
  mood: 7,
  energy: 7,
  sleep: 7.5,
  prayers: {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false
  },
  quranRead: false,
  quranReflection: '',
  dhikr: false,
  goodDeed: false,
  fasting: false,
  intention: '',
  tawbah: '',
  streak: 0,
  points: 0,
  lastQuizDate: '',
  badge: 'Novice'
};

let state = loadState();

const refs = {
  title: document.getElementById('title'),
  entry: document.getElementById('entry'),
  mood: document.getElementById('mood'),
  energy: document.getElementById('energy'),
  sleep: document.getElementById('sleep'),
  moodValue: document.getElementById('moodValue'),
  energyValue: document.getElementById('energyValue'),
  sleepValue: document.getElementById('sleepValue'),
  quranRead: document.getElementById('quranRead'),
  quranReflection: document.getElementById('quranReflection'),
  dhikr: document.getElementById('dhikr'),
  goodDeed: document.getElementById('goodDeed'),
  fasting: document.getElementById('fasting'),
  intention: document.getElementById('intention'),
  tawbah: document.getElementById('tawbah'),
  streakValue: document.getElementById('streakValue'),
  pointsValue: document.getElementById('pointsValue'),
  badgeValue: document.getElementById('badgeValue'),
  quizBtn: document.getElementById('quizBtn'),
  quizModal: document.getElementById('quizModal'),
  quizQuestion: document.getElementById('quizQuestion'),
  quizAnswers: document.getElementById('quizAnswers'),
  quizFeedback: document.getElementById('quizFeedback')
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY || 'mizan-journal'));
    return { ...defaultState, ...(saved || {}) };
  } catch (error) {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function syncUI() {
  refs.title.value = state.title;
  refs.entry.value = state.entry;
  refs.mood.value = state.mood;
  refs.energy.value = state.energy;
  refs.sleep.value = state.sleep;
  refs.quranRead.checked = state.quranRead;
  refs.quranReflection.value = state.quranReflection;
  refs.dhikr.checked = state.dhikr;
  refs.goodDeed.checked = state.goodDeed;
  refs.fasting.checked = state.fasting;
  refs.intention.value = state.intention;
  refs.tawbah.value = state.tawbah;

  refs.moodValue.textContent = `${state.mood}/10`;
  refs.energyValue.textContent = `${state.energy}/10`;
  refs.sleepValue.textContent = `${state.sleep}h`;

  document.querySelectorAll('[data-prayer]').forEach((box) => {
    const prayer = box.dataset.prayer;
    box.checked = !!state.prayers[prayer];
  });

  refs.streakValue.textContent = state.streak;
  refs.pointsValue.textContent = state.points;
  refs.badgeValue.textContent = state.badge;
}

function updateState(next) {
  state = { ...state, ...next };
  saveState();
  syncUI();
}

function computeBadge() {
  if (state.points >= 120) return 'Hafiz';
  if (state.points >= 60) return 'Guide';
  if (state.points >= 20) return 'Apprenti';
  return 'Novice';
}

function updateBadge() {
  state.badge = computeBadge();
  refs.badgeValue.textContent = state.badge;
}

function getTodayQuiz() {
  const day = new Date().getDate();
  return dailyQuiz[(day - 1) % dailyQuiz.length];
}

function openQuiz() {
  const today = new Date().toISOString().slice(0, 10);
  const quiz = getTodayQuiz();

  if (state.lastQuizDate === today) {
    refs.quizFeedback.textContent = 'Quiz déjà répondu aujourd\'hui. Revenez demain.';
    refs.quizFeedback.style.color = '#ffca45';
    return renderQuiz(quiz, true);
  }

  renderQuiz(quiz, false);
  refs.quizModal.classList.remove('hidden');
}

function renderQuiz(quiz, alreadyAnswered = false) {
  refs.quizQuestion.textContent = quiz.question;
  refs.quizAnswers.innerHTML = '';
  refs.quizFeedback.textContent = '';

  quiz.answers.forEach((answer, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = answer;
    btn.addEventListener('click', () => handleAnswer(idx, quiz, alreadyAnswered));
    refs.quizAnswers.appendChild(btn);
  });
}

function handleAnswer(selectedIndex, quiz, alreadyAnswered) {
  if (alreadyAnswered) return;

  const correct = selectedIndex === quiz.correct;
  const today = new Date().toISOString().slice(0, 10);

  if (correct) {
    state.points += 15;
    state.streak += 1;
    refs.quizFeedback.textContent = `✅ Correct ! ${quiz.explanation} (+15 pts)`;
    refs.quizFeedback.style.color = '#4edea3';
  } else {
    state.streak = 0;
    refs.quizFeedback.textContent = `❌ Presque. ${quiz.explanation}`;
    refs.quizFeedback.style.color = '#ff7a7a';
  }

  state.lastQuizDate = today;
  state.badge = computeBadge();
  saveState();
  syncUI();

  setTimeout(() => {
    refs.quizModal.classList.add('hidden');
  }, 1800);
}

refs.mood.addEventListener('input', () => {
  state.mood = Number(refs.mood.value);
  saveState();
  syncUI();
});

refs.energy.addEventListener('input', () => {
  state.energy = Number(refs.energy.value);
  saveState();
  syncUI();
});

refs.sleep.addEventListener('input', () => {
  state.sleep = Number(refs.sleep.value);
  saveState();
  syncUI();
});

refs.title.addEventListener('input', () => {
  state.title = refs.title.value;
  saveState();
});

refs.entry.addEventListener('input', () => {
  state.entry = refs.entry.value;
  saveState();
});

refs.quranReflection.addEventListener('input', () => {
  state.quranReflection = refs.quranReflection.value;
  saveState();
});

refs.intention.addEventListener('input', () => {
  state.intention = refs.intention.value;
  saveState();
});

refs.tawbah.addEventListener('input', () => {
  state.tawbah = refs.tawbah.value;
  saveState();
});

refs.quranRead.addEventListener('change', () => {
  state.quranRead = refs.quranRead.checked;
  saveState();
});

refs.dhikr.addEventListener('change', () => {
  state.dhikr = refs.dhikr.checked;
  saveState();
});

refs.goodDeed.addEventListener('change', () => {
  state.goodDeed = refs.goodDeed.checked;
  saveState();
});

refs.fasting.addEventListener('change', () => {
  state.fasting = refs.fasting.checked;
  saveState();
});

document.querySelectorAll('[data-prayer]').forEach((box) => {
  box.addEventListener('change', () => {
    const prayer = box.dataset.prayer;
    state.prayers[prayer] = box.checked;
    saveState();
    syncUI();
  });
});

refs.quizBtn.addEventListener('click', openQuiz);

refs.quizModal.addEventListener('click', (event) => {
  if (event.target === refs.quizModal) {
    refs.quizModal.classList.add('hidden');
  }
});

syncUI();
updateBadge();
