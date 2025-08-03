// questions.js - interactive questionnaire for marketing and SEO mapping
function initQuestions() {
  const modal = document.getElementById('question-modal');
  if (!modal) return;
  // if questions already answered, don't ask again
  if (localStorage.getItem('siteSetupComplete')) {
    modal.style.display = 'none';
    return;
  }
  // Define question sequence
  const questions = [
    {
      text: 'Is this website for a Company or Personal use?',
      options: ['Company', 'Personal'],
      key: 'siteType'
    },
    {
      text: 'What is the primary purpose of your personal site?',
      options: ['Creative works', 'Archive', 'Stream platform', 'Blog', 'Other'],
      key: 'personalPurpose',
      condition: (answers) => answers.siteType === 'Personal'
    },
    {
      text: 'What is the primary focus of your company site?',
      options: ['Service', 'Product', 'Portfolio', 'E-commerce', 'Other'],
      key: 'companyPurpose',
      condition: (answers) => answers.siteType === 'Company'
    }
  ];
  let current = 0;
  const answers = {};
  function showQuestion(index) {
    // skip questions whose condition isn't met
    while (index < questions.length) {
      const q = questions[index];
      if (!q.condition || q.condition(answers)) {
        break;
      }
      index++;
    }
    if (index >= questions.length) {
      finish();
      return;
    }
    current = index;
    const q = questions[index];
    // Clear modal content
    modal.innerHTML = '';
    const prompt = document.createElement('p');
    prompt.textContent = q.text;
    modal.appendChild(prompt);
    q.options.forEach((opt) => {
      const label = document.createElement('label');
      label.style.display = 'block';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'question-' + index;
      input.value = opt;
      input.addEventListener('change', () => {
        answers[q.key] = opt;
        showQuestion(index + 1);
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + opt));
      modal.appendChild(label);
    });
  }
  function finish() {
    // Save answers to localStorage
    localStorage.setItem('siteAnswers', JSON.stringify(answers));
    localStorage.setItem('siteSetupComplete', 'true');
    modal.style.display = 'none';
  }
  // Show the first question
  modal.style.display = 'block';
  showQuestion(0);
}

document.addEventListener('DOMContentLoaded', initQuestions);
