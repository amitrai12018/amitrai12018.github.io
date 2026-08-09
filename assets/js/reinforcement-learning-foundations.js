const quizData = [
  {
    id: "q1",
    question: "What makes reinforcement learning fundamentally different from a setting where the correct answer is provided for every example?",
    options: {
      A: "The agent always operates with continuous-valued inputs",
      B: "The agent learns from the consequences of its own actions",
      C: "The environment is always deterministic",
      D: "The agent never receives numerical feedback"
    },
    correct: "B",
    explanation: "In RL, the agent learns by interacting with an environment and observing the consequences of its actions rather than being given the correct action for every situation.",
    section: "What Is Reinforcement Learning?"
  },
  {
    id: "q2",
    question: "A robot takes an action that gives it a small reward now but places it in a much better position for a large reward later. What fundamental RL idea does this illustrate?",
    options: {
      A: "Sequential decision making",
      B: "Supervised classification",
      C: "State compression",
      D: "Deterministic planning"
    },
    correct: "A",
    explanation: "An action can affect future states and therefore future rewards. This is the central challenge of sequential decision making in RL.",
    section: "Sequential Decision Making"
  },
  {
    id: "q3",
    question: "At a particular time step, what information is sufficient to describe the agent's immediate decision-making situation in an MDP?",
    options: {
      A: "The entire sequence of all previous actions and rewards",
      B: "Only the reward received at the previous step",
      C: "The current state",
      D: "Only the action taken at the previous step"
    },
    correct: "C",
    explanation: "Under the Markov assumption, the current state contains the information from history that is relevant for predicting the future and making decisions.",
    section: "History, Observation, and State"
  },
  {
    id: "q4",
    question: "A car's state representation contains only its current position, but two cars at the same position can have very different futures because they are traveling at different speeds. What is missing from the representation?",
    options: {
      A: "A reward function",
      B: "Relevant state information",
      C: "A policy",
      D: "A discount factor"
    },
    correct: "B",
    explanation: "Velocity affects future behavior, so position alone is not a sufficient state representation. Adding velocity can make the representation more informative.",
    section: "A Real-World Example Where the State Is Not Markov"
  },
  {
    id: "q5",
    question: "Why is the Markov property useful when modeling an RL problem?",
    options: {
      A: "It guarantees that every action receives a positive reward",
      B: "It allows the future to be modeled without keeping the entire history",
      C: "It removes randomness from the environment",
      D: "It guarantees that the optimal policy is known"
    },
    correct: "B",
    explanation: "The Markov property allows the current state to summarize the relevant information from history, so the future can be modeled using the current state and action rather than the complete past.",
    section: "The Markov Property"
  },
  {
    id: "q6",
    question: "Two different histories produce the same state representation, but those histories lead to different future transition distributions. What does this tell you?",
    options: {
      A: "The policy must be deterministic",
      B: "The reward is incorrectly defined",
      C: "The state representation is not Markov",
      D: "The discount factor is too small"
    },
    correct: "C",
    explanation: "If history contains information that changes the distribution of the future even after conditioning on the current state and action, then the state representation has discarded relevant information.",
    section: "The Markov Property"
  },
  {
    id: "q7",
    question: "Which change would most directly turn a non-Markov state representation into a potentially Markov one?",
    options: {
      A: "Add information from history that affects future dynamics",
      B: "Increase the number of available actions",
      C: "Increase the reward magnitude",
      D: "Set the discount factor to one"
    },
    correct: "A",
    explanation: "A state can be made more informative by incorporating relevant information that was previously omitted, such as velocity in the autonomous-car example.",
    section: "How Can We Fix a Non-Markov State?"
  },
  {
    id: "q8",
    question: "Which collection contains the components needed to specify a standard Markov Decision Process?",
    options: {
      A: "States, actions, transition model, rewards, and discount factor",
      B: "States, neural network, optimizer, loss function, and dataset",
      C: "Observations, labels, features, predictions, and accuracy",
      D: "Actions, gradients, parameters, logits, and probabilities"
    },
    correct: "A",
    explanation: "An MDP is described by the state space, action space, transition dynamics, reward specification, and discount factor.",
    section: "Markov Decision Process"
  },
  {
    id: "q9",
    question: "An agent takes an action in a state and the environment may move it to several different states with different probabilities. Which part of the MDP describes this uncertainty?",
    options: {
      A: "Policy",
      B: "Transition model",
      C: "Return",
      D: "Value function"
    },
    correct: "B",
    explanation: "The transition model describes the probability of reaching each possible next state after an action is taken.",
    section: "Transition Model"
  },
  {
    id: "q10",
    question: "Suppose an environment gives a positive signal when an agent reaches a destination and a negative signal when it hits an obstacle. What role do these signals play in the MDP?",
    options: {
      A: "They determine which states exist",
      B: "They determine which action the agent must take",
      C: "They specify the reward associated with outcomes",
      D: "They determine whether the state is Markov"
    },
    correct: "C",
    explanation: "The reward model specifies how desirable or undesirable outcomes are quantified.",
    section: "Reward Model"
  },
  {
    id: "q11",
    question: "Two agents are placed in the same state, but one chooses actions randomly while the other always chooses the same action. What differs between the two agents?",
    options: {
      A: "Their transition model",
      B: "Their policy",
      C: "Their reward model",
      D: "Their state space"
    },
    correct: "B",
    explanation: "A policy describes how an agent chooses actions given the current state. Policies can be deterministic or stochastic.",
    section: "Policy"
  },
  {
    id: "q12",
    question: "A stochastic policy assigns probabilities to several actions in the same state. What must be true about those probabilities?",
    options: {
      A: "They must all be equal",
      B: "They must all be greater than zero",
      C: "They must sum to one",
      D: "The largest probability must correspond to the optimal action"
    },
    correct: "C",
    explanation: "A stochastic policy defines a probability distribution over actions for each state, so the action probabilities must sum to one.",
    section: "Policy"
  },
  {
    id: "q13",
    question: "An agent starts in the same state twice and follows the same stochastic policy, but the two interactions produce different sequences of states and rewards. What is the resulting sequence called?",
    options: {
      A: "A trajectory",
      B: "A policy",
      C: "A state representation",
      D: "A reward model"
    },
    correct: "A",
    explanation: "A trajectory is the sequence of states, actions, and rewards generated during an interaction with the environment.",
    section: "Policy Generates a Trajectory"
  },
  {
    id: "q14",
    question: "Why might an RL agent prefer a reward received sooner over an identical reward received much later?",
    options: {
      A: "The environment always makes later rewards smaller",
      B: "Future rewards are discounted",
      C: "The policy cannot choose delayed rewards",
      D: "The Markov property removes future rewards"
    },
    correct: "B",
    explanation: "The discount factor determines how much future rewards contribute to the current return. Earlier rewards therefore generally have greater present value.",
    section: "Why Discounting Exists"
  },
  {
    id: "q15",
    question: "What does the return measure in reinforcement learning?",
    options: {
      A: "The probability that the next action is optimal",
      B: "The cumulative future reward from a particular point in time",
      C: "The probability of entering a terminal state",
      D: "The number of actions available in a state"
    },
    correct: "B",
    explanation: "The return is the cumulative discounted reward obtained from a particular time step onward.",
    section: "Return"
  },
  {
    id: "q16",
    question: "Two trajectories start from the same state but produce different rewards because the environment is stochastic. Why is the value function useful here?",
    options: {
      A: "It selects the trajectory with the largest first reward",
      B: "It describes the expected return from the state under a policy",
      C: "It removes the randomness from the trajectories",
      D: "It replaces the policy with a deterministic rule"
    },
    correct: "B",
    explanation: "The value function summarizes how good a state is under a policy by taking the expected return over possible future trajectories.",
    section: "Value Function Vπ(s)"
  },
  {
    id: "q17",
    question: "You want to compare two different actions available from the same state. Which quantity is most directly designed for this comparison?",
    options: {
      A: "State value",
      B: "Q-value",
      C: "Discount factor",
      D: "Transition probability alone"
    },
    correct: "B",
    explanation: "The Q-value measures the expected return when taking a particular action in a particular state and then following the policy afterward.",
    section: "Q-Value Qπ(s,a)"
  },
  {
    id: "q18",
    question: "A policy chooses Left 30% of the time and Right 70% of the time in a state. The two actions have different Q-values. How should the state's value relate to those Q-values?",
    options: {
      A: "It should equal the larger Q-value regardless of the policy",
      B: "It should equal the smaller Q-value",
      C: "It should reflect the policy-weighted expected Q-value",
      D: "It should depend only on the immediate reward"
    },
    correct: "C",
    explanation: "The state value under a stochastic policy is the policy-weighted average of the Q-values of the available actions.",
    section: "Relationship Between Vπ and Qπ"
  },
  {
    id: "q19",
    question: "What is the key idea behind the Bellman equation?",
    options: {
      A: "A long-term return can be decomposed into an immediate reward and the discounted value of what comes next",
      B: "Every state must have exactly one action",
      C: "The environment must be deterministic",
      D: "The reward must always be positive"
    },
    correct: "A",
    explanation: "The Bellman idea is recursive: current return consists of the immediate reward plus the discounted return from the next time step.",
    section: "Bellman Equation"
  },
  {
    id: "q20",
    question: "When evaluating a stochastic policy in an MDP, why do both the policy probabilities and transition probabilities appear in the value calculation?",
    options: {
      A: "The policy determines the action distribution and the environment determines the next-state distribution",
      B: "Both independently determine the reward scale",
      C: "The policy determines the environment dynamics",
      D: "The transition model determines which policy should be used"
    },
    correct: "A",
    explanation: "The policy determines which actions are selected, while the transition model determines what next states can result from those actions.",
    section: "Bellman Equation for an MDP Under Policy π"
  },
  {
    id: "q21",
    question: "You are given a fixed policy and asked how good it is across all states. What problem are you solving?",
    options: {
      A: "Policy improvement",
      B: "Policy evaluation",
      C: "Exploration",
      D: "Reward shaping"
    },
    correct: "B",
    explanation: "Policy evaluation means estimating the value of states or actions when the policy is held fixed.",
    section: "Policy Evaluation"
  },
  {
    id: "q22",
    question: "Suppose instead that the goal is to find the policy that achieves the highest possible expected return. What problem are you solving?",
    options: {
      A: "Policy evaluation",
      B: "State estimation",
      C: "Control",
      D: "Trajectory generation"
    },
    correct: "C",
    explanation: "Control is the problem of finding or improving behavior toward an optimal policy rather than merely evaluating a fixed one.",
    section: "Control"
  },
  {
    id: "q23",
    question: "What is the essential conceptual difference between the Bellman expectation equation and the Bellman optimality equation?",
    options: {
      A: "One deals with rewards and the other does not",
      B: "One follows a specified policy while the other chooses the best action",
      C: "One applies only to deterministic environments",
      D: "One uses states while the other uses only actions"
    },
    correct: "B",
    explanation: "The Bellman expectation equation evaluates behavior under a given policy. The optimality equation replaces policy averaging with a choice of the best available action.",
    section: "Bellman Optimality Equation"
  },
  {
    id: "q24",
    question: "An agent has learned the value of every possible action in every state under optimal future behavior. What can it use this information for?",
    options: {
      A: "Choose actions that maximize long-term return",
      B: "Recover the complete history of the environment",
      C: "Remove stochasticity from the environment",
      D: "Guarantee that every immediate reward is positive"
    },
    correct: "A",
    explanation: "Optimal action values allow the agent to choose actions that lead to the highest expected long-term return.",
    section: "Bellman Optimality and Optimal Policy"
  },
  {
    id: "q25",
    question: "An RL system explicitly models how the environment changes after actions and uses that model to reason about possible futures. What broad category does this describe?",
    options: {
      A: "Model-free reinforcement learning",
      B: "Model-based reinforcement learning",
      C: "Supervised learning",
      D: "Pure policy evaluation"
    },
    correct: "B",
    explanation: "Model-based RL uses an explicit or learned model of environment dynamics and potentially rewards to predict consequences and plan.",
    section: "Model-Based vs Model-Free RL"
  },
  {
    id: "q26",
    question: "Why can a reward function be considered a specification of the objective rather than a complete description of what the designer actually intended?",
    options: {
      A: "The agent always ignores the reward",
      B: "The agent optimizes the reward that was specified, which may differ from the intended real-world goal",
      C: "Rewards are unrelated to behavior",
      D: "The reward function determines the state representation"
    },
    correct: "B",
    explanation: "An RL agent optimizes the objective encoded by its reward. If the reward is an imperfect proxy for the intended goal, the agent may find undesirable ways to maximize it.",
    section: "Reward Design Matters"
  },
  {
    id: "q27",
    question: "Why is exploration necessary in reinforcement learning?",
    options: {
      A: "The agent must discover the consequences of actions it has not sufficiently tried",
      B: "The environment requires every action to be taken exactly once",
      C: "Exploration guarantees the optimal policy immediately",
      D: "The Markov property requires random actions"
    },
    correct: "A",
    explanation: "The agent often does not initially know which actions or states lead to good outcomes, so it must gather information by trying alternatives.",
    section: "Exploration"
  },
  {
    id: "q28",
    question: "An agent receives a reward only after a long sequence of actions. What fundamental RL challenge does this create?",
    options: {
      A: "Temporal credit assignment",
      B: "State normalization",
      C: "Feature scaling",
      D: "Label smoothing"
    },
    correct: "A",
    explanation: "When rewards are delayed, the agent must determine which earlier decisions contributed to the eventual outcome. This is the temporal credit assignment problem.",
    section: "Delayed Consequences"
  },
  {
    id: "q29",
    question: "You are given a new real-world problem and want to formulate it as an MDP. What should you identify before worrying about algorithms?",
    options: {
      A: "The neural network architecture",
      B: "The state, actions, transition dynamics, reward, and objective",
      C: "The optimizer and learning rate",
      D: "The number of training epochs"
    },
    correct: "B",
    explanation: "The first step is to formulate the decision-making problem: what constitutes the state, what actions are available, how the environment changes, and what outcomes should be rewarded.",
    section: "A Practical Way to Formulate an RL Problem"
  },
  {
    id: "q30",
    question: "Which statement best captures the relationship among an MDP, a policy, a trajectory, a return, and a value function?",
    options: {
      A: "The MDP describes the world, the policy determines behavior, interaction generates trajectories, returns measure outcomes, and value functions estimate expected outcomes",
      B: "The MDP and policy are both reward functions, while the trajectory is the optimal policy",
      C: "The policy defines the transition dynamics and the MDP defines the return",
      D: "The value function generates the environment and the trajectory defines the reward"
    },
    correct: "A",
    explanation: "These concepts form a chain: the MDP describes the environment, the policy determines how the agent acts, interaction generates trajectories, returns measure cumulative reward, and value functions estimate expected return.",
    section: "The Complete RL Picture"
  }
];
