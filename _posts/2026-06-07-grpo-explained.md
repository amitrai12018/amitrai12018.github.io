---
title: "Understanding GRPO Through a Complete Numerical Example"
date: 2026-06-07 09:00:00 +0530

categories:
  - Reinforcement Learning
  - RL for LLMs

tags:
  - grpo
  - rlhf
  - llms
  - kl-divergence

math: true
toc: true
mermaid: true
---

When reading papers about **GRPO (Group Relative Policy Optimization)**, it is easy to get lost in equations and implementation details.

The best way to understand GRPO is to see how **reward**, **advantage**, **PPO clipping**, **KL divergence**, and the **training loop** fit together in one complete update.

In this article, we'll walk through a complete numerical example step by step.

> GRPO is a reinforcement learning algorithm designed for LLM post-training that removes the need for a separate value model while still providing a strong learning signal.
{: .prompt-info }

## The Three Policies in GRPO

Before we look at the math, it helps to understand the three policies involved in a GRPO update.

| Policy | Role | Updated? |
|--------|------|----------|
| $\pi_{ref}$ | Reference model used for KL regularization | No |
| $\pi_{old}$ | Frozen behavior policy that generated the sampled responses | No |
| $\pi_{\theta}$ | Current trainable policy being optimized | Yes |

At the start of a training iteration:

$$
\pi_{old} = \pi_{\theta}
$$

Then the model samples responses using $\pi_{old}$, computes rewards, and updates $\pi_{\theta}$ while keeping $\pi_{old}$ fixed during that optimization round.

---

## 1. Why GRPO Generates Multiple Responses

Consider the prompt:

> Write a polite customer support reply.

Instead of generating a single response, GRPO samples multiple responses:

- $o_1$
- $o_2$
- $o_3$

Each response is evaluated by a reward model.

Suppose the rewards are:

$$
R_1 = 0.9,\quad R_2 = 0.6,\quad R_3 = 0.2
$$

At this point we know which response performed better, but we still need a signal that tells the model how much better one response was compared to the others.

That signal is called the **advantage**.

---

## 2. Computing the GRPO Advantage

GRPO computes advantages relative to other responses generated for the same prompt.

First compute the group mean reward:

$$
\mu = \frac{0.9 + 0.6 + 0.2}{3} = 0.5667
$$

Next compute the standard deviation:

$$
\sigma \approx 0.2867
$$

The GRPO advantage is:

$$
A_i = \frac{R_i - \mu}{\sigma}
$$

Applying the formula:

$$
A_1 \approx 1.16,\quad A_2 \approx 0.12,\quad A_3 \approx -1.28
$$

### Interpretation

| Response | Reward | Advantage |
|----------|--------|-----------|
| $o_1$ | 0.90 | +1.16 |
| $o_2$ | 0.60 | +0.12 |
| $o_3$ | 0.20 | -1.28 |

This tells the model:

- $o_1$ is significantly better than average
- $o_2$ is slightly better than average
- $o_3$ is worse than average

> Positive advantages increase probability. Negative advantages decrease probability.
{: .prompt-tip }

---

## 3. Computing the PPO Policy Ratio

Now we compare the current policy with the policy that generated the samples.

At the moment the batch was collected, the snapshot policy was:

$$
\pi_{old}(o_1|q)=0.20,\quad \pi_{old}(o_2|q)=0.30,\quad \pi_{old}(o_3|q)=0.10
$$

Suppose after one optimization step, the current policy becomes:

$$
\pi_{\theta}(o_1|q)=0.25,\quad \pi_{\theta}(o_2|q)=0.25,\quad \pi_{\theta}(o_3|q)=0.05
$$

The PPO ratio is:

$$
\rho_i = \frac{\pi_\theta(o_i|q)}{\pi_{old}(o_i|q)}
$$

Therefore:

$$
\rho_1 = 1.25,\quad \rho_2 = 0.83,\quad \rho_3 = 0.50
$$

PPO optimizes:

$$
\min\Big(\rho A,\text{clip}(\rho,1-\epsilon,1+\epsilon)A\Big)
$$

The clipping term prevents excessively large policy updates.

For example, if we use:

$$
\epsilon = 0.2
$$

then the allowed range is:

$$
[1-\epsilon, 1+\epsilon] = [0.8, 1.2]
$$

So for $o_1$:

$$
\text{clip}(1.25) = 1.2
$$

and the PPO term becomes:

$$
\min(1.25 \times 1.16,\; 1.2 \times 1.16)
=
\min(1.45,\; 1.392)
=
1.392
$$

---

## 4. Why GRPO Adds KL Divergence

If we optimize only for reward, the model may:

- drift away from pretrained behavior,
- learn reward-hacking strategies,
- forget useful capabilities.

To prevent this, GRPO keeps the policy close to a reference model.

Let:

$$
r = \frac{\pi_{ref}(o|q)}{\pi_{\theta}(o|q)}
$$

GRPO uses the following per-sample KL estimator:

$$
r - \log(r) - 1
$$

This estimator has several useful properties:

- always non-negative,
- equals zero when both policies are identical,
- computable from a single sampled output,
- its expectation corresponds to the KL regularization term used in the objective.

For example, if:

$$
\pi_{ref}(o_1|q)=0.30
$$

and

$$
\pi_{\theta}(o_1|q)=0.25
$$

then:

$$
r = \frac{0.30}{0.25} = 1.2
$$

The KL estimator becomes:

$$
1.2 - \log(1.2) - 1 \approx 0.0177
$$

If we choose:

$$
\beta = 0.1
$$

then the KL penalty is:

$$
0.1 \times 0.0177 = 0.00177
$$

> The KL term acts like a safety rail that prevents the policy from drifting too far away from the reference model.
{: .prompt-info }

---

## 5. Putting Everything Together

The complete GRPO objective is:

$$
J_{GRPO}
=
\mathbb{E}
\left[
\min\Big(
\rho A,
\text{clip}(\rho,1-\epsilon,1+\epsilon)A
\Big)
-
\beta
\Big(
r-\log(r)-1
\Big)
\right]
$$

This objective combines three important ideas.

### 1. Advantage

Advantage determines whether a response is better or worse than the other responses generated for the same prompt.

### 2. PPO Clipping

Clipping prevents unstable policy updates.

### 3. KL Regularization

KL divergence prevents the policy from drifting too far away from the reference model.

---

## 6. One Complete Numerical GRPO Update

Let us now compute one full example for response $o_1$.

We already have:

$$
A_1 = 1.16
$$

$$
\rho_1 = 1.25
$$

$$
\epsilon = 0.2
$$

So the clipped ratio is:

$$
\text{clip}(1.25) = 1.2
$$

The PPO part is:

$$
\min(1.25 \times 1.16,\; 1.2 \times 1.16)
=
\min(1.45,\; 1.392)
=
1.392
$$

Now the KL part is:

$$
r - \log(r) - 1 \approx 0.0177
$$

With:

$$
\beta = 0.1
$$

the KL penalty becomes:

$$
0.00177
$$

So the per-sample GRPO contribution is:

$$
J_1 = 1.392 - 0.00177 = 1.39023
$$

That is the number this sample contributes to the overall objective.

In practice, the total objective is the expectation over all sampled responses in the batch.

---

## 7. What Happens After $J_{GRPO}$ Is Computed?

This is the part that often gets skipped.

The objective value itself is not directly optimized. Instead, it is used to compute gradients that determine how the model parameters should change.

The optimizer computes:

$$
\nabla_\theta J_{GRPO}
$$

and then updates the model weights:

$$
\theta \leftarrow \theta + \alpha \nabla_\theta J_{GRPO}
$$

where $\alpha$ is the learning rate.

### Training Flow

```mermaid
flowchart TD
    A[Sample responses using π_old]
    B[Compute rewards]
    C[Compute advantages]
    D[Compute PPO objective]
    E[Compute KL penalty]
    F[Compute J_GRPO]
    G[Compute gradients ∇θJ]
    H[Update model weights θ]
    I[Create new π_old from updated π_θ]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
```

## Time for Active Recall {: #quiz-yourself}

<div id="grpo-quiz"></div>
<script src="/assets/js/grpo-quiz.js"></script>

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
