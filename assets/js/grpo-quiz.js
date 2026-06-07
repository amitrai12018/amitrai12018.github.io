<section id="grpo-quiz" style="margin-top: 2rem; paddinge: 1.25rem; border: 1px solid var(--sidebar-border-color, #ddd); border-radius: 14px;">
  <h2>Quiz Yourself</h2>
  <p>Answer each question to get instant feedback, the correct answer, an explanation, and your updated score.</p>

  <div id="quiz-score" style="margin: 1rem 0; font-size: 1.05rem; font-weight: 600;">
    Score: 0 / 15
  </div>

  <div id="quiz-container"></div>
</section>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const quizData = [
    {
      id: "q1",
      question: "GRPO uses three policies. Which one is updated during training?",
      options: {
        A: "πref",
        B: "πold",
        C: "πθ",
        D: "All three"
      },
      correct: "C",
      explanation: "πθ is the trainable policy. πref stays frozen for KL regularization, and πold is the frozen snapshot used during the optimization round.",
      section: "The Three Policies in GRPO"
    },
    {
      id: "q2",
      question: "Why does GRPO keep πold fixed during an optimization round?",
      options: {
        A: "To compute the reward model output",
        B: "To provide a stable baseline for measuring how much the policy changes",
        C: "To replace the reference model",
        D: "To generate the advantage directly"
      },
      correct: "B",
      explanation: "πold is the behavior policy used to collect the samples. Keeping it fixed lets PPO measure how much the trainable policy changes relative to the sampled batch.",
      section: "The Three Policies in GRPO"
    },
    {
      id: "q3",
      question: "Why does GRPO sample multiple responses for the same prompt?",
      options: {
        A: "To reduce inference latency",
        B: "To compare responses and compute group-relative advantages",
        C: "To train the reward model directly",
        D: "To avoid using KL divergence"
      },
      correct: "B",
      explanation: "GRPO compares multiple responses generated for the same prompt so it can rank them relative to one another and compute advantages.",
      section: "Why GRPO Generates Multiple Responses"
    },
    {
      id: "q4",
      question: "A response gets a strongly positive advantage. What is the intended effect?",
      options: {
        A: "Make it less likely in the future",
        B: "Keep its probability unchanged",
        C: "Increase its probability in future generations",
        D: "Remove it from training"
      },
      correct: "C",
      explanation: "Positive advantages tell the optimizer to reinforce responses that performed better than the group average.",
      section: "Computing the GRPO Advantage"
    },
    {
      id: "q5",
      question: "What does the GRPO advantage measure?",
      options: {
        A: "How far the response is from the reference model",
        B: "How much a response differs from the group average reward",
        C: "The policy change between πold and πθ",
        D: "The KL divergence penalty"
      },
      correct: "B",
      explanation: "The advantage is computed from the reward relative to the group mean and standard deviation, so it measures how the response compares to the other sampled responses.",
      section: "Computing the GRPO Advantage"
    },
    {
      id: "q6",
      question: "What does the PPO ratio compare?",
      options: {
        A: "Reward vs advantage",
        B: "Current policy vs reference policy",
        C: "Current policy vs old snapshot policy",
        D: "Reward model vs policy model"
      },
      correct: "C",
      explanation: "The PPO ratio is πθ / πold. It measures how much the current policy has changed relative to the snapshot that generated the sampled responses.",
      section: "Computing the PPO Policy Ratio"
    },
    {
      id: "q7",
      question: "Why is PPO clipping used?",
      options: {
        A: "To compute rewards faster",
        B: "To prevent excessively large policy updates",
        C: "To replace the KL penalty",
        D: "To update πref"
      },
      correct: "B",
      explanation: "Clipping keeps the policy update within a safe range so the model does not move too aggressively in one step.",
      section: "Computing the PPO Policy Ratio"
    },
    {
      id: "q8",
      question: "If ε = 0.2, what is the PPO clipping range?",
      options: {
        A: "[0.2, 1.2]",
        B: "[0.8, 1.2]",
        C: "[0.8, 1.8]",
        D: "[1.0, 1.2]"
      },
      correct: "B",
      explanation: "PPO clipping uses [1 - ε, 1 + ε]. With ε = 0.2, the range becomes [0.8, 1.2].",
      section: "Computing the PPO Policy Ratio"
    },
    {
      id: "q9",
      question: "Why does GRPO add KL divergence to the objective?",
      options: {
        A: "To generate more responses",
        B: "To keep the policy close to the reference model",
        C: "To compute the reward model output",
        D: "To replace the advantage term"
      },
      correct: "B",
      explanation: "KL regularization discourages the model from drifting too far from the reference policy while still allowing learning.",
      section: "Why GRPO Adds KL Divergence"
    },
    {
      id: "q10",
      question: "Which statement about the KL estimator is correct?",
      options: {
        A: "It can be negative for every sample",
        B: "It is always non-negative",
        C: "It directly gives the reward",
        D: "It is the same as the advantage"
      },
      correct: "B",
      explanation: "The KL estimator used here, r - log(r) - 1, is always non-negative and becomes zero when the policies match.",
      section: "Why GRPO Adds KL Divergence"
    },
    {
      id: "q11",
      question: "What does β do in the GRPO objective?",
      options: {
        A: "It controls the strength of the KL penalty",
        B: "It controls the reward model size",
        C: "It changes the prompt",
        D: "It computes the advantage"
      },
      correct: "A",
      explanation: "β is the weight on the KL term. A larger β means stronger pressure to stay close to the reference policy.",
      section: "Why GRPO Adds KL Divergence"
    },
    {
      id: "q12",
      question: "What is the role of the objective J_GRPO?",
      options: {
        A: "It is the final answer shown to the user",
        B: "It is used to compute gradients for updating the model",
        C: "It replaces the reward model",
        D: "It is the same thing as the advantage"
      },
      correct: "B",
      explanation: "The objective is not the end goal itself. It is used to compute gradients that guide the parameter update.",
      section: "What Happens After J_GRPO Is Computed?"
    },
    {
      id: "q13",
      question: "After computing J_GRPO, what happens next?",
      options: {
        A: "The reward model is retrained immediately",
        B: "The gradients are computed and the model weights are updated",
        C: "πref is updated",
        D: "The batch is discarded"
      },
      correct: "B",
      explanation: "The optimizer computes gradients from the objective and updates the trainable parameters θ.",
      section: "What Happens After J_GRPO Is Computed?"
    },
    {
      id: "q14",
      question: "At the end of a training iteration, what happens to πold?",
      options: {
        A: "It becomes the reference policy",
        B: "It is recreated from the updated πθ for the next iteration",
        C: "It is used to compute rewards",
        D: "It is updated together with πref"
      },
      correct: "B",
      explanation: "After optimization, the new policy is copied to become the next iteration's snapshot policy.",
      section: "Training Flow"
    },
    {
      id: "q15",
      question: "Which statement best describes GRPO overall?",
      options: {
        A: "It maximizes reward without any stability control",
        B: "It improves responses while keeping policy updates stable and controlled",
        C: "It removes the need for rewards",
        D: "It only trains the reference model"
      },
      correct: "B",
      explanation: "GRPO combines reward improvement with PPO clipping and KL regularization so the policy learns without drifting too far.",
      section: "Putting Everything Together"
    }
  ];

  const container = document.getElementById("quiz-container");
  const scoreEl = document.getElementById("quiz-score");
  let scoreState = new Array(quizData.length).fill(null);

  function updateScore() {
    const score = scoreState.filter(v => v === true).length;
    scoreEl.textContent = `Score: ${score} / ${quizData.length}`;
  }

  function renderQuiz() {
    container.innerHTML = "";

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

      container.appendChild(card);

      const inputs = card.querySelectorAll(`input[name="${q.id}"]`);
      const feedback = card.querySelector(`#${q.id}-feedback`);

      inputs.forEach(input => {
        input.addEventListener("change", function () {
          const selected = card.querySelector(`input[name="${q.id}"]:checked`).value;
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
  }

  renderQuiz();
  updateScore();
});
  
</script>
