document.addEventListener("DOMContentLoaded", function () {
  const quizData = [
    {
      id: "q1",
      question: "What is the fundamental problem that reinforcement learning is trying to solve?",
      options: {
        A: "Predicting a label for each independent input",
        B: "Learning how to make decisions that maximize long-term reward",
        C: "Finding the shortest sequence of actions regardless of reward",
        D: "Reproducing the behavior of a fixed dataset"
      },
      correct: "B",
      explanation: "Reinforcement learning is fundamentally about sequential decision making. The agent must choose actions whose consequences lead to high long-term reward.",
      section: "What Is Reinforcement Learning?"
    },

    {
      id: "q2",
      question: "A robot receives a small reward for taking an action, but that action places it in a state from which it can later receive a much larger reward. What does this situation highlight?",
      options: {
        A: "The importance of sequential decision making",
        B: "The need for supervised labels",
        C: "The fact that rewards must be immediate",
        D: "The fact that states cannot change"
      },
      correct: "A",
      explanation: "An action can affect both the immediate reward and the future state. This makes RL a sequential decision-making problem.",
      section: "Sequential Decision Making"
    },

    {
      id: "q3",
      question: "What information should a state capture in an MDP?",
      options: {
        A: "Every detail from the complete history",
        B: "Only the most recent reward",
        C: "The information needed to determine the relevant future dynamics",
        D: "Only the action taken previously"
      },
      correct: "C",
      explanation: "A Markov state contains the information from the history that is relevant for predicting the future. Once that information is captured, the complete history is unnecessary.",
      section: "History, Observation, and State"
    },

    {
      id: "q4",
      question: "A car's state contains only its current position. Two cars at the same position can have different future trajectories because one is moving quickly and the other is stationary. What is the problem?",
      options: {
        A: "The reward function is stochastic",
        B: "The state representation has omitted relevant information",
        C: "The action space is too large",
        D: "The policy must be deterministic"
      },
      correct: "B",
      explanation: "Velocity affects how the system evolves. If velocity is omitted, two situations with different futures can look identical to the agent.",
      section: "A Real-World Example Where the State Is Not Markov"
    },

    {
      id: "q5",
      question: "What does it mean for a state representation to satisfy the Markov property?",
      options: {
        A: "The current state contains enough information about the past to predict the relevant future",
        B: "The environment must always be deterministic",
        C: "The agent must always choose the same action",
        D: "The reward must be independent of the state"
      },
      correct: "A",
      explanation: "The Markov property means that, given the current state and action, additional information about the earlier history is not needed to describe the future.",
      section: "The Markov Property"
    },

    {
      id: "q6",
      question: "Two different histories lead to the same state representation, but the probability distribution of the next state differs between those histories. What does this imply?",
      options: {
        A: "The policy is optimal",
        B: "The reward is necessarily incorrect",
        C: "The state representation is not Markov",
        D: "The discount factor must be zero"
      },
      correct: "C",
      explanation: "If the future still depends on information contained in the history after conditioning on the current state and action, the state representation has discarded relevant information.",
      section: "The Markov Property"
    },

    {
      id: "q7",
      question: "What is a common way to fix a state representation that is not Markov?",
      options: {
        A: "Remove information from the state",
        B: "Add relevant information from the history",
        C: "Increase the number of actions",
        D: "Change the reward scale"
      },
      correct: "B",
      explanation: "If omitted historical information affects the future, incorporating that information into the state can produce a more complete representation.",
      section: "How Can We Fix a Non-Markov State?"
    },

    {
      id: "q8",
      question: "Which of the following best describes an MDP?",
      options: {
        A: "A framework for representing sequential decision making under the Markov assumption",
        B: "A neural network used to approximate a policy",
        C: "A method for computing gradients",
        D: "A supervised learning dataset"
      },
      correct: "A",
      explanation: "An MDP provides the mathematical framework for describing states, actions, transition dynamics, rewards, and discounting in a Markov decision-making problem.",
      section: "Markov Decision Process"
    },

    {
      id: "q9",
      question: "An agent takes the same action from the same state multiple times, but different next states can occur. Which part of the MDP captures this behavior?",
      options: {
        A: "The policy",
        B: "The transition model",
        C: "The return",
        D: "The value function"
      },
      correct: "B",
      explanation: "The transition model describes how the environment responds to a state-action pair, including uncertainty over possible next states.",
      section: "Transition Model"
    },

    {
      id: "q10",
      question: "Two agents operate in exactly the same environment but choose different actions in the same state. What is different between them?",
      options: {
        A: "Their transition model",
        B: "Their reward function",
        C: "Their policy",
        D: "Their state space"
      },
      correct: "C",
      explanation: "The policy determines how an agent selects actions given the current state. Different policies can produce different behavior in the same MDP.",
      section: "Policy"
    },

    {
      id: "q11",
      question: "A policy chooses Left with probability 0.3 and Right with probability 0.7 in a particular state. What kind of policy is this?",
      options: {
        A: "Deterministic",
        B: "Stochastic",
        C: "Optimal by definition",
        D: "Model-based"
      },
      correct: "B",
      explanation: "A stochastic policy assigns probabilities to multiple possible actions rather than always selecting one fixed action.",
      section: "Policy"
    },

    {
      id: "q12",
      question: "What is produced when an agent repeatedly interacts with an environment by following a policy?",
      options: {
        A: "A trajectory",
        B: "A reward function",
        C: "A Markov assumption",
        D: "A value function"
      },
      correct: "A",
      explanation: "The sequence of states, actions, and rewards generated through interaction is called a trajectory.",
      section: "Policy Generates a Trajectory"
    },

    {
      id: "q13",
      question: "Why does reinforcement learning use a return rather than considering only the immediate reward?",
      options: {
        A: "Because actions can affect future states and therefore future rewards",
        B: "Because immediate rewards are always zero",
        C: "Because the environment cannot produce rewards",
        D: "Because policies cannot depend on states"
      },
      correct: "A",
      explanation: "An action can have consequences far into the future. The return captures the cumulative reward resulting from those consequences.",
      section: "Return"
    },

    {
      id: "q14",
      question: "What is the purpose of the discount factor in a return?",
      options: {
        A: "To determine which actions are legal",
        B: "To control how strongly future rewards contribute relative to earlier rewards",
        C: "To make the environment deterministic",
        D: "To determine the number of states"
      },
      correct: "B",
      explanation: "Discounting controls how much future rewards contribute to the current return and therefore how strongly the agent values delayed outcomes.",
      section: "Why Discounting Exists"
    },

    {
      id: "q15",
      question: "Two trajectories begin from the same state and produce different future rewards. What does the state value represent in this situation?",
      options: {
        A: "The largest reward observed in either trajectory",
        B: "The expected long-term return from that state under a policy",
        C: "The probability of the first action",
        D: "The immediate reward only"
      },
      correct: "B",
      explanation: "The state value summarizes how good a state is under a particular policy by considering expected return over possible future trajectories.",
      section: "Value Function Vπ(s)"
    },

    {
      id: "q16",
      question: "You are in a state with several available actions and want to compare how good those actions are. Which quantity is most directly useful?",
      options: {
        A: "State value",
        B: "Q-value",
        C: "Reward scale",
        D: "Discount factor"
      },
      correct: "B",
      explanation: "The Q-value evaluates a specific state-action pair by considering the expected return after taking that action and subsequently following the policy.",
      section: "Q-Value Qπ(s,a)"
    },

    {
      id: "q17",
      question: "A stochastic policy assigns different probabilities to the available actions in a state. How should the state's value relate to the action values?",
      options: {
        A: "It should always equal the largest action value",
        B: "It should always equal the smallest action value",
        C: "It should reflect the policy's probability-weighted action values",
        D: "It should depend only on the first reward"
      },
      correct: "C",
      explanation: "Under a stochastic policy, the state value is the policy-weighted average of the available action values.",
      section: "Relationship Between Vπ and Qπ"
    },

    {
      id: "q18",
      question: "What is the key idea behind the Bellman equation?",
      options: {
        A: "A long-term return can be broken into an immediate part and a future part",
        B: "Every state has exactly one possible action",
        C: "All environments must be deterministic",
        D: "The reward must be positive"
      },
      correct: "A",
      explanation: "The Bellman equation expresses a recursive relationship: current return consists of immediate reward plus appropriately discounted future return.",
      section: "Bellman Equation"
    },

    {
      id: "q19",
      question: "When evaluating a policy in an MDP, why do both the policy and the transition model matter?",
      options: {
        A: "The policy determines the action distribution and the transition model determines what can happen afterward",
        B: "Both determine the reward magnitude",
        C: "The transition model determines which policy is optimal",
        D: "The policy determines the environment dynamics"
      },
      correct: "A",
      explanation: "The policy determines which actions are selected, while the transition model determines the possible next states and their probabilities after those actions.",
      section: "Bellman Equation for an MDP Under Policy π"
    },

    {
      id: "q20",
      question: "You are given a fixed policy and want to determine how good it is. What problem are you solving?",
      options: {
        A: "Policy evaluation",
        B: "Policy control",
        C: "Exploration",
        D: "Reward shaping"
      },
      correct: "A",
      explanation: "Policy evaluation means determining the value of states or state-action pairs under a fixed policy.",
      section: "Policy Evaluation"
    },

    {
      id: "q21",
      question: "You have estimated how good different actions are and now want to choose behavior that produces the highest long-term return. What problem are you solving?",
      options: {
        A: "Policy evaluation",
        B: "Control",
        C: "State estimation",
        D: "Trajectory recording"
      },
      correct: "B",
      explanation: "Control is concerned with finding or improving a policy so that the resulting behavior approaches optimal performance.",
      section: "Control"
    },

    {
      id: "q22",
      question: "What is the conceptual difference between evaluating a policy and finding an optimal policy?",
      options: {
        A: "Evaluation asks how good a given policy is, while control asks how to improve behavior toward the best policy",
        B: "Evaluation always uses deterministic environments, while control uses stochastic environments",
        C: "Evaluation uses rewards, while control does not",
        D: "There is no conceptual difference"
      },
      correct: "A",
      explanation: "Policy evaluation takes the policy as given and measures its performance. Control goes further by searching for better behavior.",
      section: "Evaluation vs Control"
    },

    {
      id: "q23",
      question: "What is the central idea behind the Bellman optimality equation?",
      options: {
        A: "Follow the current policy exactly",
        B: "Consider the best available action when determining optimal value",
        C: "Ignore future rewards",
        D: "Average all possible actions equally"
      },
      correct: "B",
      explanation: "The Bellman optimality equation characterizes optimal behavior by considering the action that leads to the highest expected long-term return.",
      section: "Bellman Optimality Equation"
    },

    {
      id: "q24",
      question: "Suppose you know the optimal value of every state-action pair. What can you use that information to do?",
      options: {
        A: "Choose actions that maximize expected long-term return",
        B: "Recover the complete history of the environment",
        C: "Guarantee that every immediate reward is positive",
        D: "Remove all randomness from the environment"
      },
      correct: "A",
      explanation: "Optimal action values tell the agent which available actions lead to the best expected future return, allowing an optimal policy to be constructed.",
      section: "Optimal Policy"
    },

    {
      id: "q25",
      question: "An environment's dynamics are unknown, so an agent learns from sampled interactions rather than explicitly using a model of how the environment works. What broad category does this describe?",
      options: {
        A: "Model-based reinforcement learning",
        B: "Model-free reinforcement learning",
        C: "Supervised learning",
        D: "Policy evaluation only"
      },
      correct: "B",
      explanation: "Model-free RL learns useful behavior or value information directly from interaction without requiring an explicit model of the environment dynamics.",
      section: "Model-Based vs Model-Free RL"
    },

    {
      id: "q26",
      question: "An agent repeatedly chooses the action it currently believes is best but rarely tries alternatives. What important RL problem can this create?",
      options: {
        A: "It may fail to discover actions that are actually better",
        B: "It will necessarily violate the Markov property",
        C: "It will make the environment deterministic",
        D: "It will eliminate the need for a policy"
      },
      correct: "A",
      explanation: "This is the exploration problem. Without trying alternatives, the agent may never discover actions or states that could lead to better long-term rewards.",
      section: "Exploration vs Exploitation"
    },

    {
      id: "q27",
      question: "An agent receives a reward only after a long sequence of decisions. What challenge does this create?",
      options: {
        A: "Temporal credit assignment",
        B: "State normalization",
        C: "Feature scaling",
        D: "Action elimination"
      },
      correct: "A",
      explanation: "When rewards are delayed, the agent must determine which earlier decisions contributed to the eventual outcome. This is the temporal credit assignment problem.",
      section: "Delayed Rewards and Credit Assignment"
    },

    {
      id: "q28",
      question: "When formulating a real-world problem as an MDP, what should be decided before choosing an RL algorithm?",
      options: {
        A: "Which neural network architecture to use",
        B: "What the states, actions, dynamics, and rewards should represent",
        C: "Which optimizer will be used",
        D: "How many epochs the model will train"
      },
      correct: "B",
      explanation: "The decision-making problem itself should be formulated first: what represents the state, what actions are available, how the environment evolves, and what outcomes are rewarded.",
      section: "A Practical Way to Formulate an RL Problem"
    },

    {
      id: "q29",
      question: "Which statement best captures the relationship between an MDP and a policy?",
      options: {
        A: "The MDP describes the decision-making world, while the policy describes how the agent behaves in that world",
        B: "The policy defines the transition dynamics of the environment",
        C: "The MDP chooses actions while the policy defines rewards",
        D: "They are two names for the same object"
      },
      correct: "A",
      explanation: "The MDP specifies the states, actions, dynamics, and rewards. The policy specifies how the agent selects actions given those states.",
      section: "The Complete RL Picture"
    },

    {
      id: "q30",
      question: "Which statement best captures the overall relationship among an MDP, policy, trajectory, return, and value function?",
      options: {
        A: "The MDP describes the environment, the policy determines behavior, interaction produces trajectories, returns measure outcomes, and value functions estimate expected outcomes",
        B: "The policy defines the environment dynamics and the MDP defines the reward",
        C: "The trajectory determines the policy and the value function determines the state",
        D: "The return determines which states exist in the MDP"
      },
      correct: "A",
      explanation: "These concepts form the core RL chain: the MDP defines the decision-making problem, the policy determines actions, interaction produces trajectories, the return measures cumulative reward, and value functions estimate expected return.",
      section: "The Complete RL Picture"
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
    "Answer each question to get instant feedback, the correct answer, an explanation, and your updated score.";

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
    const score = scoreState.filter(v => v === true).length;
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
        <input type="radio" name="${q.id}" value="${key}" style="margin-right: 0.5rem;">
        ${key}. ${value}
      </label>
    `
      )
      .join("");

    card.innerHTML = `
      <p style="margin: 0 0 0.5rem 0;"><strong>Q${index + 1}.</strong> ${q.question}</p>
      <div class="quiz-options">${optionsHtml}</div>

      <div
        id="${q.id}-feedback"
        style="margin-top: 0.75rem; padding: 0.75rem; border-radius: 10px; display:none;">
      </div>

      <div
        id="${q.id}-reference"
        style="margin-top: 0.6rem; font-size: 0.9rem; opacity: 0.8; display:none;">
        <em>Reference: ${q.section}</em>
      </div>
    `;

    quizContainer.appendChild(card);

    const inputs = card.querySelectorAll(`input[name="${q.id}"]`);
    const feedback = card.querySelector(`#${q.id}-feedback`);
    const reference = card.querySelector(`#${q.id}-reference`);

    inputs.forEach(input => {
      input.addEventListener("change", function () {
        const selected = card.querySelector(
          `input[name="${q.id}"]:checked`
        ).value;

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
