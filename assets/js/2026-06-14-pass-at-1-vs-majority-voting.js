document.addEventListener("DOMContentLoaded", function () {
  const quizData = [
    {
      id: "q1",
      question: "What does pass@1 measure?",
      options: {
        A: "Whether at least one answer among many samples is correct",
        B: "The accuracy of a single sampled response",
        C: "The most common answer among multiple samples",
        D: "The number of reasoning steps used by the model"
      },
      correct: "B",
      explanation: "pass@1 measures single-sample accuracy. It answers: if the model gives one response, how likely is that response to be correct?",
      section: "Pass@1"
    },
    {
      id: "q2",
      question: "In pass@1, what does p_i = 1 mean?",
      options: {
        A: "The model used one chain of thought",
        B: "The response was incorrect",
        C: "The response was correct",
        D: "The answer appeared once"
      },
      correct: "C",
      explanation: "p_i is an indicator variable. It equals 1 when response i is correct and 0 when response i is incorrect.",
      section: "Pass@1 Formula"
    },
    {
      id: "q3",
      question: "If a model gives 10 responses and 7 are correct, what is pass@1?",
      options: {
        A: "30%",
        B: "50%",
        C: "70%",
        D: "100%"
      },
      correct: "C",
      explanation: "pass@1 is the average correctness. If 7 out of 10 responses are correct, pass@1 = 7 / 10 = 70%.",
      section: "Pass@1 Example"
    },
    {
      id: "q4",
      question: "What is majority voting, also called cons@k?",
      options: {
        A: "Choosing the longest answer",
        B: "Choosing a random answer from k samples",
        C: "Choosing the most frequent answer among k samples",
        D: "Choosing the first correct answer"
      },
      correct: "C",
      explanation: "Majority voting samples the model k times, extracts the final answer from each sample, and chooses the answer that appears most often.",
      section: "Majority Voting / cons@k"
    },
    {
      id: "q5",
      question: "Why can majority voting improve accuracy for math problems?",
      options: {
        A: "Math problems usually have many possible correct answers",
        B: "Correct reasoning often converges to the same final answer",
        C: "It ignores the final answer and grades the explanation",
        D: "It makes the model deterministic"
      },
      correct: "B",
      explanation: "For exact-answer math problems, correct reasoning paths often lead to the same answer, while mistakes may scatter across many different wrong answers.",
      section: "Why Majority Voting Helps"
    },
    {
      id: "q6",
      question: "In the AIME 2024 example, pass@1 was 71.0% and cons@64 was 86.7%. What does this show?",
      options: {
        A: "Majority voting made performance worse",
        B: "Sampling multiple answers and taking the most common one improved accuracy",
        C: "The model got every answer correct",
        D: "pass@1 and cons@64 measure exactly the same thing"
      },
      correct: "B",
      explanation: "The comparison is on the same benchmark: AIME 2024. pass@1 is the single-answer baseline at 71.0%, while cons@64 uses 64 samples and reaches 86.7%, an improvement of 15.7 percentage points.",
      section: "AIME 2024 Example"
    },
    {
      id: "q7",
      question: "What does pass@k measure?",
      options: {
        A: "Whether the most common answer among k samples is correct",
        B: "Whether the first answer is correct",
        C: "The probability that at least one of k attempts is correct",
        D: "The number of wrong answers produced by the model"
      },
      correct: "C",
      explanation: "pass@k asks whether at least one of k sampled attempts is correct. It is a success-within-k-tries metric.",
      section: "Pass@k"
    },
    {
      id: "q8",
      question: "Why is pass@k especially useful for code generation?",
      options: {
        A: "Code has no objective correctness",
        B: "You can often run tests to identify a correct solution",
        C: "Code generation only allows one attempt",
        D: "Majority voting never works for code"
      },
      correct: "B",
      explanation: "With code, you can often generate multiple candidate solutions and run tests. If any one attempt passes the tests, the overall attempt can succeed. Choice D is too strong: majority voting can sometimes help, but it is not the main reason pass@k is useful.",
      section: "Pass@k for Code Generation"
    },
    {
      id: "q9",
      question: "In the pass@k formula, what does n represent?",
      options: {
        A: "Number of correct samples",
        B: "Number of incorrect samples",
        C: "Total number of samples generated",
        D: "Number of benchmark problems"
      },
      correct: "C",
      explanation: "n is the total number of generated samples. For example, if the model generates 10 candidate answers, then n = 10.",
      section: "Pass@k Formula Variables"
    },
    {
      id: "q10",
      question: "In the pass@k formula, what does c represent?",
      options: {
        A: "Number of correct samples",
        B: "Number of attempts allowed",
        C: "Number of models tested",
        D: "Number of majority votes"
      },
      correct: "A",
      explanation: "c is the number of correct samples among the n total generated samples.",
      section: "Pass@k Formula Variables"
    },
    {
      id: "q11",
      question: "In pass@k, what does C(n - c, k) / C(n, k) represent?",
      options: {
        A: "The probability that all k chosen samples are correct",
        B: "The probability that all k chosen samples are wrong",
        C: "The probability that the majority answer is correct",
        D: "The probability that exactly one sample is correct"
      },
      correct: "B",
      explanation: "n - c is the number of incorrect samples. So C(n - c, k) / C(n, k) is the probability that the k selected samples all come from the incorrect samples.",
      section: "Pass@k Formula Intuition"
    },
    {
      id: "q12",
      question: "Why do we subtract from 1 in the pass@k formula?",
      options: {
        A: "To calculate the probability that at least one sample is correct",
        B: "To calculate the average response length",
        C: "To remove duplicate answers",
        D: "To convert pass@k into pass@1"
      },
      correct: "A",
      explanation: "The fraction calculates the probability that all selected samples are wrong. Subtracting from 1 gives the opposite event: at least one selected sample is correct.",
      section: "Pass@k Formula Intuition"
    },
    {
      id: "q13",
      question: "Suppose n = 10, c = 3, and k = 5. What does this mean?",
      options: {
        A: "There are 10 total samples, 3 correct samples, and we are allowed 5 attempts",
        B: "There are 10 correct samples, 3 wrong samples, and 5 models",
        C: "There are 10 problems, 3 models, and 5 answers",
        D: "There are 10 attempts allowed, 3 samples, and 5 correct answers"
      },
      correct: "A",
      explanation: "n = 10 means 10 total generated samples, c = 3 means 3 of them are correct, and k = 5 means we are measuring success within 5 attempts.",
      section: "Pass@k Example"
    },
    {
      id: "q14",
      question: "Which metric is most appropriate for normal single-response model comparison?",
      options: {
        A: "pass@1",
        B: "cons@64",
        C: "pass@k only",
        D: "factorial accuracy"
      },
      correct: "A",
      explanation: "pass@1 is the standard metric when you want to know how reliable one ordinary sampled response is.",
      section: "When to Use Each Metric"
    },
    {
      id: "q15",
      question: "Which metric is most appropriate when you can afford many samples and the final answer is unambiguous?",
      options: {
        A: "Majority voting / cons@k",
        B: "pass@1 only",
        C: "BLEU score",
        D: "Number of tokens generated"
      },
      correct: "A",
      explanation: "Majority voting works well when there is a single clear final answer, such as in many math problems.",
      section: "When to Use Majority Voting"
    },
    {
      id: "q16",
      question: "Which metric is most optimistic because it only requires one correct solution among multiple attempts?",
      options: {
        A: "pass@1",
        B: "pass@k",
        C: "cons@k",
        D: "majority error rate"
      },
      correct: "B",
      explanation: "pass@k can count the problem as successful even if only one of the k attempts is correct, assuming you have a way to identify that correct attempt.",
      section: "Pass@k vs Other Metrics"
    },
    {
      id: "q17",
      question: "What is a key difference between majority voting and pass@k?",
      options: {
        A: "Majority voting chooses the most frequent answer; pass@k checks whether at least one answer is correct",
        B: "Majority voting only works for code; pass@k only works for math",
        C: "Majority voting requires no samples; pass@k requires one sample",
        D: "They are mathematically identical"
      },
      correct: "A",
      explanation: "Majority voting succeeds when the most frequent answer is correct. pass@k succeeds when at least one of the selected attempts is correct.",
      section: "Majority Voting vs Pass@k"
    },
    {
      id: "q18",
      question: "If the correct answer appears once, but a wrong answer appears many times, what happens?",
      options: {
        A: "pass@k may succeed, but majority voting may fail",
        B: "majority voting must succeed",
        C: "pass@1 must be 100%",
        D: "pass@k must fail"
      },
      correct: "A",
      explanation: "pass@k can succeed because at least one attempt was correct. Majority voting can fail because the most frequent answer is the wrong one.",
      section: "Majority Voting vs Pass@k"
    },
    {
      id: "q19",
      question: "Why is the iterative product used for pass@k computation?",
      options: {
        A: "To make the model reason longer",
        B: "To avoid computing huge factorials directly",
        C: "To convert code answers into math answers",
        D: "To force all answers to be unique"
      },
      correct: "B",
      explanation: "The combinatorics formula can involve very large factorials. The iterative product computes the same ratio more efficiently and stably.",
      section: "Efficient Pass@k Computation"
    },
    {
      id: "q20",
      question: "What does AIME 2024 measure in this context?",
      options: {
        A: "The model's ability to write code",
        B: "The model's ability to solve difficult math problems with exact numerical answers",
        C: "The model's ability to summarize text",
        D: "The model's ability to chat naturally"
      },
      correct: "B",
      explanation: "AIME 2024 is used as a math-reasoning benchmark. It contains difficult math problems with exact final numerical answers, making it useful for evaluating reasoning models.",
      section: "AIME 2024"
    }
  ];

  const container = document.getElementById("reasoning-metrics-quiz");
  if (!container) return;

  const root = document.createElement("div");
  root.style.cssText = "margin-top: 1rem; padding: 1.25rem; border: 1px solid var(--sidebar-border-color, #ddd); border-radius: 14px;";

  const heading = document.createElement("h2");
  heading.textContent = "Quiz Yourself";

  const intro = document.createElement("p");
  intro.textContent = "Answer each question to get instant feedback, the correct answer, an explanation, and your updated score.";

  const scoreEl = document.createElement("div");
  scoreEl.id = "quiz-score";
  scoreEl.style.cssText = "margin: 1rem 0; font-size: 1.05rem; font-weight: 600;";
  scoreEl.textContent = `Score: 0 / ${quizData.length}`;

  const quizContainer = document.createElement("div");
  quizContainer.id = "quiz-container";

  root.appendChild(heading);
  root.appendChild(intro);
  root.appendChild(scoreEl);
  root.appendChild(quizContainer);
  container.appendChild(root);

  const scoreState = new Array(quizData.length).fill(null);

  function updateScore() {
    const score = scoreState.filter(v => v === true).length;
    scoreEl.textContent = `Score: ${score} / ${quizData.length}`;
  }

  quizData.forEach((q, index) => {
    const card = document.createElement("div");
    card.style.cssText = "padding: 1rem 0; border-top: 1px solid #e5e7eb;";

    const optionsHtml = Object.entries(q.options).map(([key, value]) => `
      <label style="display:block; margin: 0.35rem 0; cursor:pointer;">
        <input type="radio" name="${q.id}" value="${key}" style="margin-right: 0.5rem;">
        ${key}. ${value}
      </label>
    `).join("");

    card.innerHTML = `
      <p style="margin: 0 0 0.5rem 0;"><strong>Q${index + 1}.</strong> ${q.question}</p>
      <div class="quiz-options">${optionsHtml}</div>
      <div id="${q.id}-feedback" style="margin-top: 0.75rem; padding: 0.75rem; border-radius: 10px; display:none;"></div>
      <div style="margin-top: 0.6rem; font-size: 0.9rem; opacity: 0.8;"><em>Reference: ${q.section}</em></div>
    `;

    quizContainer.appendChild(card);

    const inputs = card.querySelectorAll(`input[name="${q.id}"]`);
    const feedback = card.querySelector(`#${q.id}-feedback`);

    inputs.forEach(input => {
      input.addEventListener("change", function () {
        const selectedInput = card.querySelector(`input[name="${q.id}"]:checked`);
        if (!selectedInput) return;

        const selected = selectedInput.value;
        const isCorrect = selected === q.correct;
        scoreState[index] = isCorrect;

        const correctAnswerText = `${q.correct}. ${q.options[q.correct]}`;
        const chosenText = `${selected}. ${q.options[selected]}`;

        feedback.style.display = "block";
        feedback.style.border = isCorrect ? "1px solid #22c55e" : "1px solid #ef4444";
        feedback.style.background = isCorrect ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)";
        feedback.innerHTML = `
          <strong>${isCorrect ? "Correct" : "Incorrect"}</strong><br>
          Your answer: ${chosenText}<br>
          Correct answer: ${correctAnswerText}<br><br>
          ${q.explanation}
        `;

        updateScore();
      });
    });
  });

  updateScore();
});
