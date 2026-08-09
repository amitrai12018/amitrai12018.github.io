document.addEventListener("DOMContentLoaded", function () {
  const quizData = [
    {
      id: "q1",
      question:
        "An agent takes an action now and that action changes the state from which its next decision will be made. Why can judging the action only by its immediate reward be misleading?",
      options: {
        A: "The reward can never be observed immediately",
        B: "The action can change future opportunities and therefore future rewards",
        C: "The policy cannot choose another action later",
        D: "The environment must be deterministic"
      },
      correct: "B",
      explanation:
        "RL is a sequential decision-making problem. An action affects the next state, which affects later decisions and rewards. Therefore, an action with a small immediate reward can still be better if it leads to a more valuable future.",
      section: "3. Sequential Decision Making"
    },

    {
      id: "q2",
      question:
        "In the lecture's distinction between history, observation, and state, which one represents the complete sequence of information available up to the current time?",
      options: {
        A: "Observation",
        B: "State",
        C: "History",
        D: "Reward"
      },
      correct: "C",
      explanation:
        "History contains the complete sequence of information available up to time t, including previous actions, observations, and rewards. An observation is only what the agent currently receives, while the state is the representation used to describe the current situation.",
      section: "4. History, Observation, and State"
    },

    {
      id: "q3",
      question:
        "Suppose two different histories produce exactly the same current state representation. If the distribution of the next state is still different for those two histories after taking the same action, what has failed?",
      options: {
        A: "The reward model",
        B: "The Markov property of the state representation",
        C: "The policy normalization condition",
        D: "The discounting assumption"
      },
      correct: "B",
      explanation:
        "If history still provides information about the next state after conditioning on the current state and action, then the current state is not a sufficient statistic of the history. The state representation is therefore not Markov.",
      section: "5. The Markov Property"
    },

    {
      id: "q4",
      question:
        "An autonomous car's state is defined only by its position. Two cars are both 100 meters from an intersection, but one is moving at 80 km/h and the other at 20 km/h. Why is the position-only representation insufficient?",
      options: {
        A: "Position cannot be represented numerically",
        B: "Velocity contains information that affects the future",
        C: "The transition model must be deterministic",
        D: "Rewards cannot depend on position"
      },
      correct: "B",
      explanation:
        "The two cars have the same position but different velocities, and therefore potentially different futures. Velocity is relevant information that has been discarded by the position-only state representation.",
      section: "6. A Real-World Example Where the State Is Not Markov"
    },

    {
      id: "q5",
      question:
        "For the autonomous-car example, what is the most direct way to make the state representation richer so that it can capture the missing information?",
      options: {
        A: "Use only the previous reward",
        B: "Add velocity to the state",
        C: "Remove position from the state",
        D: "Make the policy deterministic"
      },
      correct: "B",
      explanation:
        "The lecture fixes the example by representing the state using both position and velocity. The important lesson is that Markov-ness depends on the information included in the state representation.",
      section: "7. How Can We Fix a Non-Markov State?"
    },

    {
      id: "q6",
      question:
        "Two customers both search for 'running shoes'. Customer A has searched repeatedly, viewed products, added products to the cart, and compared prices; Customer B has no previous interaction. Why can the query alone fail as the state?",
      options: {
        A: "A query cannot be an observation",
        B: "The two customers have identical future rewards by definition",
        C: "Their histories may change the probability of future behavior even though the query is identical",
        D: "Search queries cannot be represented in an MDP"
      },
      correct: "C",
      explanation:
        "If prior interactions affect future purchasing behavior, then the current query does not contain enough information to predict the future. A richer state would need to include relevant interaction history or a suitable summary of it.",
      section: "8. Another Example: Customer Search"
    },

    {
      id: "q7",
      question:
        "What is the practical benefit of the Markov assumption when modeling an RL problem?",
      options: {
        A: "It eliminates all randomness from the environment",
        B: "It lets us replace an arbitrarily long history with a sufficient current state",
        C: "It guarantees that every policy is optimal",
        D: "It removes the need for rewards"
      },
      correct: "B",
      explanation:
        "Without the Markov property, we may need to reason about an increasingly long history. With a Markov state, the future can be modeled using the current state and action without carrying the entire history.",
      section: "9. Why the Markov Property Matters"
    },

    {
      id: "q8",
      question:
        "Which additional ingredient distinguishes a Markov Reward Process from a Markov Process?",
      options: {
        A: "Actions",
        B: "Rewards and a discount factor",
        C: "A stochastic policy",
        D: "An optimal value function"
      },
      correct: "B",
      explanation:
        "The lecture builds the framework incrementally: a Markov Process has states and transitions; an MRP adds rewards and the discount factor; an MDP then additionally introduces actions.",
      section: "10. Markov Process / 11. Markov Reward Process"
    },

    {
      id: "q9",
      question:
        "A problem is specified using states, actions, transition probabilities, rewards, and a discount factor. What formal framework does this describe?",
      options: {
        A: "Markov Process",
        B: "Markov Reward Process",
        C: "Markov Decision Process",
        D: "Supervised learning problem"
      },
      correct: "C",
      explanation:
        "An MDP is the framework containing S, A, P, R, and gamma. It adds actions to the Markov Reward Process and forms the mathematical foundation used throughout the lecture.",
      section: "12. Markov Decision Process"
    },

    {
      id: "q10",
      question:
        "For a robot with states s0 through s4, where s4 is the charging station, what does the transition model answer when the robot is at s3 and chooses Right?",
      options: {
        A: "Which action the policy should prefer",
        B: "How good the robot's current state is",
        C: "What next states can occur and with what probabilities",
        D: "How much the entire trajectory is worth"
      },
      correct: "C",
      explanation:
        "The transition model describes the environment dynamics. In the lecture's example, moving Right from s3 can reach s4 with probability 0.8 and s2 with probability 0.2.",
      section: "13. State / 15. Transition Model"
    },

    {
      id: "q11",
      question:
        "In the robot example, moving Right from s3 reaches s4 with probability 0.8 and s2 with probability 0.2. What probability would remain for any other next state if these are the only possible outcomes?",
      options: {
        A: "0",
        B: "0.2",
        C: "0.8",
        D: "1.0"
      },
      correct: "A",
      explanation:
        "The transition probabilities for a fixed state-action pair must sum to 1. Since 0.8 + 0.2 = 1, no probability remains for another next state.",
      section: "15. Transition Model"
    },

    {
      id: "q12",
      question:
        "A robot moves normally and receives 0, reaches a charging station and receives +10, and falls into an obstacle and receives -10. What does this information describe?",
      options: {
        A: "Transition dynamics",
        B: "The reward model",
        C: "The policy distribution",
        D: "The state space"
      },
      correct: "B",
      explanation:
        "The reward model describes how good or bad an outcome is. It can depend on the current state, action, and next state, and is distinct from the transition model, which describes where the agent goes.",
      section: "16. Reward Model"
    },

    {
      id: "q13",
      question:
        "What is the most useful mental distinction between the transition model and the reward model?",
      options: {
        A: "Transition says 'how good?' and reward says 'where next?'",
        B: "Transition says 'where do I go?' and reward says 'how good or bad was what happened?'",
        C: "Both describe the policy",
        D: "Both are different names for the return"
      },
      correct: "B",
      explanation:
        "The lecture emphasizes: the transition model describes the next-state dynamics, while the reward model evaluates the outcome of the transition.",
      section: "17. Model = Transition + Reward"
    },

    {
      id: "q14",
      question:
        "A policy chooses Right with probability 0.8 and Left with probability 0.2 in state s0. If the agent is in s0, what does a single action sample from this policy represent?",
      options: {
        A: "The probability that the environment reaches each next state",
        B: "A random draw of an action according to the policy's action probabilities",
        C: "The expected return from s0",
        D: "The reward distribution"
      },
      correct: "B",
      explanation:
        "A stochastic policy specifies a probability distribution over actions for each state. Sampling an action means drawing one action from that distribution.",
      section: "18. Policy"
    },

    {
      id: "q15",
      question:
        "A policy chooses Left with probability 0.3 and Right with probability 0.7. If these are the only available actions, what must be true?",
      options: {
        A: "The transition probabilities must also be 0.3 and 0.7",
        B: "The two action probabilities must sum to 1",
        C: "The policy must be optimal",
        D: "The environment must be deterministic"
      },
      correct: "B",
      explanation:
        "A stochastic policy is a probability distribution over actions for each state, so the action probabilities must sum to 1. Policy probabilities and transition probabilities are different distributions.",
      section: "18. Policy"
    },

    {
      id: "q16",
      question:
        "Starting from state st, an agent samples an action from its policy, samples a next state from the environment, and receives a reward. What is the resulting sequence of interactions called?",
      options: {
        A: "A value function",
        B: "A trajectory",
        C: "A transition model",
        D: "A Bellman optimum"
      },
      correct: "B",
      explanation:
        "Repeated interaction with the environment generates a trajectory containing states, actions, and rewards. The lecture describes this as the sequence generated by following a policy.",
      section: "19. Policy Generates a Trajectory"
    },

    {
      id: "q17",
      question:
        "An episode produces rewards 1, 2, and 3 at successive future time steps, with discount factor 0.5. Starting before the first reward, what is the discounted return?",
      options: {
        A: "2.75",
        B: "3.25",
        C: "3.50",
        D: "6.00"
      },
      correct: "A",
      explanation:
        "The return is 1 + 0.5(2) + 0.5^2(3) = 1 + 1 + 0.75 = 2.75.",
      section: "20. Return"
    },

    {
      id: "q18",
      question:
        "In the lecture's numerical example, the first reward is 0, the second reward is 10, and the discount factor is 0.9. What is the return at the starting time?",
      options: {
        A: "0.9",
        B: "9",
        C: "10",
        D: "90"
      },
      correct: "B",
      explanation:
        "The first reward contributes 0. The reward of 10 arrives one step later, so it is discounted once: 0 + 0.9 × 10 = 9.",
      section: "21. Numerical Example of Return"
    },

    {
      id: "q19",
      question:
        "Two strategies eventually both produce a reward of 10. Strategy A receives it immediately; Strategy B receives it several steps later. What does increasing the discount factor toward 1 do to their relative treatment?",
      options: {
        A: "It makes the delayed reward matter less",
        B: "It makes the delayed reward matter more",
        C: "It removes the immediate reward",
        D: "It makes both rewards negative"
      },
      correct: "B",
      explanation:
        "A discount factor closer to 1 gives future rewards more weight. With a smaller discount factor, the agent places greater relative emphasis on rewards received sooner.",
      section: "22. Why Discounting Exists"
    },

    {
      id: "q20",
      question:
        "A stochastic environment can produce several different trajectories from the same starting state under the same policy. Which quantity summarizes the expected return from that starting state?",
      options: {
        A: "The transition probability",
        B: "The state-value function",
        C: "The immediate reward",
        D: "The action probability alone"
      },
      correct: "B",
      explanation:
        "A particular trajectory has a particular return, while the state-value function averages the return over possible future trajectories when starting from the state and following the policy.",
      section: "23. Value Function Vπ(s)"
    },

    {
      id: "q21",
      question:
        "You are in state A and can choose Left or Right. You want to compare the expected long-term consequence of taking Left now versus taking Right now, before continuing with the policy. Which quantity should you compare?",
      options: {
        A: "Vπ(A) only",
        B: "Qπ(A, Left) and Qπ(A, Right)",
        C: "The transition probabilities alone",
        D: "The immediate reward only"
      },
      correct: "B",
      explanation:
        "Qπ(s,a) evaluates a particular action from a particular state, assuming that action is taken now and the policy is followed afterward. This makes it the natural quantity for comparing actions.",
      section: "24. Q-Value Qπ(s,a)"
    },

    {
      id: "q22",
      question:
        "At state A, a policy chooses Left with probability 0.25 and Right with probability 0.75. Suppose Qπ(A, Left) = 4 and Qπ(A, Right) = 8. What is Vπ(A)?",
      options: {
        A: "5",
        B: "6",
        C: "7",
        D: "8"
      },
      correct: "C",
      explanation:
        "The state value is the policy-weighted average of the action values: 0.25 × 4 + 0.75 × 8 = 1 + 6 = 7.",
      section: "25. Relationship Between Vπ and Qπ"
    },

    {
      id: "q23",
      question:
        "Suppose a deterministic policy always chooses Right in state A. What relationship should hold between the state's value and the Q-value of Right?",
      options: {
        A: "The state value must be zero",
        B: "The state value equals the Q-value of Right",
        C: "The state value equals the Q-value of Left",
        D: "The two quantities cannot be related"
      },
      correct: "B",
      explanation:
        "Under a deterministic policy, all policy probability mass is placed on the chosen action. Therefore the policy-weighted average reduces to the Q-value of that action.",
      section: "25. Relationship Between Vπ and Qπ"
    },

    {
      id: "q24",
      question:
        "The return from time t is rewritten by separating the first reward from everything that happens afterward. What key recursive relationship does this reveal?",
      options: {
        A: "The current return is the immediate reward plus discounted return from the next time step",
        B: "The current return depends only on the first reward",
        C: "The next state is independent of the current action",
        D: "The policy must always be deterministic"
      },
      correct: "A",
      explanation:
        "The lecture derives the Bellman idea by splitting the return into the first reward and the remaining discounted rewards. The remaining expression is exactly the return beginning at the next time step.",
      section: "27. Bellman Equation"
    },

    {
      id: "q25",
      question:
        "In an MRP, suppose a state gives immediate reward 2 and then transitions to s1 with probability 0.4 and s2 with probability 0.6. If γ = 0.9, V(s1) = 5, and V(s2) = 10, what is V(s)?",
      options: {
        A: "7.4",
        B: "9.2",
        C: "10.0",
        D: "11.0"
      },
      correct: "B",
      explanation:
        "Expected next-state value = 0.4 × 5 + 0.6 × 10 = 8. The discounted future contribution is 0.9 × 8 = 7.2. Adding the immediate reward gives V(s) = 2 + 7.2 = 9.2.",
      section: "28. Bellman Equation for an MRP"
    },

    {
      id: "q26",
      question:
        "In the MDP Bellman expectation equation, why are there two layers of averaging: one over actions and one over next states?",
      options: {
        A: "The first represents policy uncertainty and the second represents environment transition uncertainty",
        B: "Both represent different rewards",
        C: "The first averages rewards and the second averages policies",
        D: "Both are needed only when the environment is deterministic"
      },
      correct: "A",
      explanation:
        "The policy determines a distribution over actions, while the transition model determines a distribution over next states for a chosen state-action pair. The Bellman expectation equation averages over both sources of uncertainty.",
      section: "29. Bellman Equation for an MDP Under Policy π"
    },

    {
      id: "q27",
      question:
        "If Qπ(s,a) already tells you the expected return after taking action a in state s and then following π, how can Vπ(s) be obtained when π is stochastic?",
      options: {
        A: "Take the largest Q-value",
        B: "Take the smallest Q-value",
        C: "Average the Q-values using the policy's action probabilities",
        D: "Ignore the Q-values and use only the reward"
      },
      correct: "C",
      explanation:
        "The policy determines how likely each action is. Therefore the state's expected value is the policy-weighted average of the corresponding action values.",
      section: "30. Bellman Equation in Terms of Qπ"
    },

    {
      id: "q28",
      question:
        "You are handed a fixed policy and asked to compute Vπ for all states. You are not allowed to modify the policy. Which problem are you solving?",
      options: {
        A: "Control",
        B: "Policy evaluation",
        C: "Exploration",
        D: "Reward design"
      },
      correct: "B",
      explanation:
        "Policy evaluation takes a policy as given and determines how good it is by calculating its value function. Changing the policy to improve performance is the control problem.",
      section: "31. Policy Evaluation"
    },

    {
      id: "q29",
      question:
        "Consider a state with two actions. Their expected optimal one-step-plus-future returns are 6 and 10. If you are constructing the optimal value of the state, which quantity should determine the choice?",
      options: {
        A: "The average of 6 and 10",
        B: "The smaller value, 6",
        C: "The larger value, 10",
        D: "The probability of the previous action"
      },
      correct: "C",
      explanation:
        "The Bellman optimality equation differs from policy evaluation because it chooses the best available action rather than averaging actions according to a fixed policy.",
      section: "32. Control / 33. Bellman Optimality Equation"
    },

    {
      id: "q30",
      question:
        "An RL system has learned an explicit model of how actions change states and what rewards result. It uses that model to predict consequences and plan before choosing an action. Which description fits it?",
      options: {
        A: "Model-free RL",
        B: "Model-based RL",
        C: "Supervised learning",
        D: "Pure policy evaluation"
      },
      correct: "B",
      explanation:
        "Model-based RL explicitly uses or learns the environment model, such as transition dynamics and rewards, and can use that model for prediction and planning. Model-free RL instead learns value or policy information without explicitly maintaining that environment model.",
      section: "35. Model-Based vs Model-Free RL"
    },

    {
      id: "q31",
      question:
        "An agent chooses action A and observes its outcome, but it does not simultaneously observe what would have happened if it had chosen action B. What distinctive RL issue does this illustrate?",
      options: {
        A: "The Markov property",
        B: "The counterfactual nature of exploration",
        C: "The definition of a state",
        D: "The normalization of transition probabilities"
      },
      correct: "B",
      explanation:
        "In RL, the agent's actions influence which data it observes. Choosing A reveals the outcome of A, but not the unobserved outcome of B. This creates the exploration and counterfactual aspect emphasized in the lecture.",
      section: "36.2 Exploration"
    },

    {
      id: "q32",
      question:
        "An AI tutor receives +1 whenever a student answers correctly. It discovers that asking only extremely easy questions maximizes its reward, even though the students are not learning much. What lesson does this example illustrate?",
      options: {
        A: "The reward function always perfectly represents the intended goal",
        B: "The agent optimizes the specified reward, which may differ from the intended objective",
        C: "The Markov property has been violated",
        D: "Discounting automatically fixes reward misspecification"
      },
      correct: "B",
      explanation:
        "The lecture uses this example to show why reward design matters. Maximizing the specified reward is not necessarily equivalent to achieving the human-intended objective.",
      section: "37. Reward Design Matters"
    },

    {
      id: "q33",
      question:
        "You are given a new real-world problem and want to formulate it as an RL problem before selecting an algorithm. Which sequence best matches the lecture's checklist?",
      options: {
        A: "Choose a neural network → choose an optimizer → collect labels → define the state",
        B: "Define state → actions → transition model → reward → policy → return → value → Q-value",
        C: "Define reward → choose optimal policy → define state afterward",
        D: "Choose an algorithm → tune gamma → infer the state from the learned model"
      },
      correct: "B",
      explanation:
        "The lecture's practical checklist starts by defining the decision-making problem itself: what the state represents, what actions are available, how the environment evolves, what rewards mean, and then the policy, return, value, and Q-value.",
      section: "38. A Practical Way to Formulate an RL Problem"
    },

    {
      id: "q34",
      question:
        "A student remembers that Vπ(s) and Qπ(s,a) are both expected returns but keeps confusing them. Which distinction should they use to separate the two?",
      options: {
        A: "V evaluates a state under the policy; Q evaluates a particular action taken from that state before continuing with the policy",
        B: "V is always deterministic; Q is always stochastic",
        C: "V uses rewards; Q uses transitions only",
        D: "V is for control; Q is only for supervised learning"
      },
      correct: "A",
      explanation:
        "Vπ(s) asks how good it is to be in state s while following π. Qπ(s,a) asks how good it is to take a particular action a in state s and then follow π.",
      section: "23. Value Function / 24. Q-Value"
    },

    {
      id: "q35",
      question:
        "Which pair correctly contrasts the Bellman expectation equation with the Bellman optimality equation?",
      options: {
        A: "Expectation averages actions according to π; optimality selects the best action",
        B: "Expectation selects the best action; optimality averages all actions",
        C: "Both always use the same action selection rule",
        D: "Expectation ignores transitions; optimality ignores rewards"
      },
      correct: "A",
      explanation:
        "This is one of the central conceptual distinctions of the lecture. Policy evaluation follows the specified policy and averages over its action probabilities. Optimality instead considers the action that gives the highest expected long-term return.",
      section: "33. Bellman Optimality Equation"
    }
  ];

  const container = document.getElementById("rl-quiz");
  if (!container) return;

  const root = document.createElement("div");

  root.style.cssText =
    "margin-top: 1rem; padding: 1.25rem; border: 1px solid var(--sidebar-border-color, #ddd); border-radius: 14px;";

  const heading = document.createElement("h2");
  heading.textContent = "Quiz Yourself";

  const intro = document.createElement("p");
  intro.textContent =
    "Try to answer from memory before checking the explanation. Each question tests a concept, relationship, or calculation from the lecture.";

  const scoreEl = document.createElement("div");

  scoreEl.id = "quiz-score";

  scoreEl.style.cssText =
    "margin: 1rem 0; font-size: 1.05rem; font-weight: 600;";

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
    const score = scoreState.filter((v) => v === true).length;
    scoreEl.textContent = `Score: ${score} / ${quizData.length}`;
  }

  quizData.forEach((q, index) => {
    const card = document.createElement("div");

    card.style.cssText =
      "padding: 1rem 0; border-top: 1px solid #e5e7eb;";

    const optionsHtml = Object.entries(q.options)
      .map(
        ([key, value]) => `
          <label style="display:block; margin: 0.35rem 0; cursor:pointer;">
            <input
              type="radio"
              name="${q.id}"
              value="${key}"
              style="margin-right: 0.5rem;"
            >
            ${key}. ${value}
          </label>
        `
      )
      .join("");

    card.innerHTML = `
      <p style="margin: 0 0 0.5rem 0;">
        <strong>Q${index + 1}.</strong> ${q.question}
      </p>

      <div class="quiz-options">
        ${optionsHtml}
      </div>

      <div
        id="${q.id}-feedback"
        style="
          margin-top: 0.75rem;
          padding: 0.75rem;
          border-radius: 10px;
          display: none;
        ">
      </div>

      <div
        id="${q.id}-reference"
        style="
          margin-top: 0.6rem;
          font-size: 0.9rem;
          opacity: 0.8;
          display: none;
        ">
        <em>Reference: ${q.section}</em>
      </div>
    `;

    quizContainer.appendChild(card);

    const inputs = card.querySelectorAll(
      `input[name="${q.id}"]`
    );

    const feedback = card.querySelector(
      `#${q.id}-feedback`
    );

    const reference = card.querySelector(
      `#${q.id}-reference`
    );

    inputs.forEach((input) => {
      input.addEventListener("change", function () {
        const selectedInput = card.querySelector(
          `input[name="${q.id}"]:checked`
        );

        if (!selectedInput) return;

        const selected = selectedInput.value;

        const isCorrect = selected === q.correct;

        scoreState[index] = isCorrect;

        const correctAnswerText =
          `${q.correct}. ${q.options[q.correct]}`;

        const chosenText =
          `${selected}. ${q.options[selected]}`;

        feedback.style.display = "block";

        feedback.style.border = isCorrect
          ? "1px solid #22c55e"
          : "1px solid #ef4444";

        feedback.style.background = isCorrect
          ? "rgba(34,197,94,0.08)"
          : "rgba(239,68,68,0.08)";

        feedback.innerHTML = `
          <strong>${isCorrect ? "Correct" : "Incorrect"}</strong><br>
          Your answer: ${chosenText}<br>
          Correct answer: ${correctAnswerText}<br><br>
          ${q.explanation}
        `;

        reference.style.display = "block";

        updateScore();
      });
    });
  });

  updateScore();
});
