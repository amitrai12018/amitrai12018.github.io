document.addEventListener("DOMContentLoaded", function () {
  const quizData = [
    {
      id: "q1",
      question: "What is the central shift described in the article?",
      options: {
        A: "From proofs to computation",
        B: "From searching for formulas to recognizing mathematical structure",
        C: "From real numbers to complex numbers",
        D: "From pure mathematics to programming"
      },
      correct: "B",
      explanation: "The article argues that mathematical maturity involves moving beyond formula hunting and asking what structure is present and worth preserving.",
      section: "Introduction"
    },
    {
      id: "q2",
      question: "Which collection gives the basic ingredients of a mathematical structure as presented in the article?",
      options: {
        A: "Objects, operations, relations, and laws",
        B: "Numbers, equations, proofs, and answers",
        C: "Data, code, charts, and predictions",
        D: "Variables, constants, derivatives, and integrals"
      },
      correct: "A",
      explanation: "A useful first approximation is that a mathematical structure consists of objects together with operations, relations, and the laws they satisfy.",
      section: "The Building Blocks of a Mathematical Structure"
    },
    {
      id: "q3",
      question: "Why can the symbol &lt; mean proper inclusion when ordering Dedekind cuts?",
      options: {
        A: "Because every subset is automatically a real number",
        B: "Because mathematical symbols always retain their ordinary numerical meaning",
        C: "Because the defined relation satisfies the required order axioms",
        D: "Because proper inclusion and subtraction are the same operation"
      },
      correct: "C",
      explanation: "The symbol receives its meaning from the relation being defined. Proper inclusion can serve as the strict order because it satisfies the required order properties on Dedekind cuts.",
      section: "Why the Symbol < Can Mean Different Things"
    },
    {
      id: "q4",
      question: "What should be clarified before selecting the mathematical objects or structure for a model?",
      options: {
        A: "The most advanced theorem available",
        B: "The question the model must explain, predict, compare, or decide",
        C: "The number of equations the final model should contain",
        D: "The programming language used to implement it"
      },
      correct: "B",
      explanation: "The purpose of the model determines which information and structural features must be retained.",
      section: "Begin With the Question"
    },
    {
      id: "q5",
      question: "Why might the same collection of cities be modeled as points, graph vertices, or states in a probabilistic system?",
      options: {
        A: "Because cities have no real properties",
        B: "Because every mathematical structure is equivalent",
        C: "Because different questions require different features of the cities to be represented",
        D: "Because one model must always contain all possible structures"
      },
      correct: "C",
      explanation: "Distance, transportation links, and population movement are different questions, so each calls for a representation that preserves different information.",
      section: "Begin With the Question"
    },
    {
      id: "q6",
      question: "Which of the following is an operation rather than a relation?",
      options: {
        A: "Adjacency between two graph vertices",
        B: "Containment of one set in another",
        C: "Composition of two transformations",
        D: "Similarity between two images"
      },
      correct: "C",
      explanation: "Composition combines two transformations to produce another transformation. The other choices describe ways in which objects are compared or connected.",
      section: "Identify the Natural Operations"
    },
    {
      id: "q7",
      question: "Why are maps or transformations important when identifying a mathematical structure?",
      options: {
        A: "They show how objects can change while possibly preserving the relevant structure",
        B: "They eliminate the need to define objects",
        C: "They guarantee that every structure is an ordered field",
        D: "They replace all relations with numerical comparisons"
      },
      correct: "A",
      explanation: "Mathematics studies not only objects but also structure-preserving maps between them, such as linear maps, continuous maps, isometries, and isomorphisms.",
      section: "Identify the Relations and Transformations"
    },
    {
      id: "q8",
      question: "An image classifier should give the same label after a small translation of the image. What does this requirement describe?",
      options: {
        A: "An invariant under translation",
        B: "A new field operation",
        C: "A total order on images",
        D: "A loss of all structure"
      },
      correct: "A",
      explanation: "The label is intended to remain unchanged under a transformation considered irrelevant, so it is an invariant for the modeling task.",
      section: "Identify Invariants and Equivalence"
    },
    {
      id: "q9",
      question: "Two graphs use different vertex names and are drawn differently, but their connection patterns are preserved exactly. In the relevant structural sense, how may they be regarded?",
      options: {
        A: "Numerically equal",
        B: "Isomorphic",
        C: "Ordered by distance",
        D: "Unrelated because their drawings differ"
      },
      correct: "B",
      explanation: "Graph isomorphism captures structural sameness by preserving adjacency even when labels or drawings change.",
      section: "Identify Invariants and Equivalence"
    },
    {
      id: "q10",
      question: "What does the principle of choosing the simplest adequate structure recommend?",
      options: {
        A: "Always choose the least detailed model, even if it cannot answer the question",
        B: "Always choose the richest mathematical structure available",
        C: "Choose the simplest structure that preserves enough information for the intended purpose",
        D: "Avoid combining structures under all circumstances"
      },
      correct: "C",
      explanation: "Additional structure is useful only when it helps represent or solve the target problem. Unnecessary structure adds complexity without improving the answer.",
      section: "Choose the Simplest Adequate Structure"
    },
    {
      id: "q11",
      question: "What does the sequence set → vector space → normed vector space → Banach space illustrate?",
      options: {
        A: "Each structure discards everything defined before it",
        B: "Mathematical structures can be layered by adding new properties to a base structure",
        C: "Every set is automatically a Banach space",
        D: "Only one structure can be used in a model"
      },
      correct: "B",
      explanation: "Each stage retains the earlier structure and adds more information, such as vector operations, a norm, and then completeness.",
      section: "Mathematical Structures Are Often Layered"
    },
    {
      id: "q12",
      question: "Which structure is the natural starting point for finding the fastest route on one-way roads when every road has a travel time?",
      options: {
        A: "An unweighted undirected graph",
        B: "A directed weighted graph",
        C: "A field with no graph structure",
        D: "A topological space with no notion of connection"
      },
      correct: "B",
      explanation: "Direction represents one-way roads, while edge weights represent travel times.",
      section: "Worked Example: Modeling Traffic"
    },
    {
      id: "q13",
      question: "Why does the image-recognition example combine vector spaces, transformation groups, metrics, probability, and optimization?",
      options: {
        A: "Because no individual structure describes every relevant aspect of the task",
        B: "Because all images must be arranged in a total order",
        C: "Because probabilities cannot be used with vectors",
        D: "Because the model should preserve every pixel exactly"
      },
      correct: "A",
      explanation: "Different structures describe representation, similarity, transformations, uncertainty, and learning. A realistic task often needs several layers of mathematics.",
      section: "Worked Example: Image Recognition"
    },
    {
      id: "q14",
      question: "A road network model keeps connectivity but ignores weather and road width. How should this be evaluated?",
      options: {
        A: "It is automatically invalid because it omits real-world details",
        B: "It is useful if the omitted details are unnecessary for the question being answered",
        C: "It is complete because graphs represent every property of roads",
        D: "It must be replaced by the richest possible model"
      },
      correct: "B",
      explanation: "Every model preserves some features and discards others. The key test is whether the discarded information is needed for the intended purpose.",
      section: "What Does the Model Preserve and Discard?"
    },
    {
      id: "q15",
      question: "What is usually the first response when no familiar mathematical structure fits a problem perfectly?",
      options: {
        A: "Abandon mathematical modeling",
        B: "Assign arbitrary symbols and call them a new structure",
        C: "Combine or extend existing structures, then define a new one only when necessary",
        D: "Force the problem into the real numbers alone"
      },
      correct: "C",
      explanation: "Mathematics often grows by layering or combining existing structures. A genuinely new structure should be defined precisely through its objects, operations, relations, axioms, maps, and intended invariants.",
      section: "What If No Existing Structure Fits?"
    },
    {
      id: "q16",
      question: "After a model produces predictions or explanations, what comes next in the modeling loop?",
      options: {
        A: "Treat the model as permanently correct",
        B: "Compare its conclusions with theory and data, then refine it if necessary",
        C: "Remove all invariants",
        D: "Replace every object with a number"
      },
      correct: "B",
      explanation: "Modeling is iterative. Conclusions are checked against theoretical constraints and observations, and the representation is revised when the fit is inadequate.",
      section: "The Complete Modeling Loop"
    },
    {
      id: "q17",
      question: "Which sequence best summarizes the compact modeling algorithm?",
      options: {
        A: "Choose a formula → collect objects → invent a question",
        B: "Define the purpose → identify structure → choose the simplest adequate model → validate and refine",
        C: "Choose the richest model → ignore invariants → avoid testing",
        D: "Convert everything into an ordered field → solve numerically"
      },
      correct: "B",
      explanation: "The article begins with purpose, then identifies objects, operations, relations, transformations, invariants, and equivalence before selecting, validating, and refining the structure.",
      section: "A Compact Algorithm"
    }
  ];

  const container = document.getElementById("mathematical-structures-quiz");
  if (!container) return;

  const root = document.createElement("div");
  root.style.cssText = "margin-top: 1rem; padding: 1.25rem; border: 1px solid var(--sidebar-border-color, #ddd); border-radius: 14px;";

  const heading = document.createElement("h2");
  heading.textContent = "Quiz Yourself";

  const intro = document.createElement("p");
  intro.textContent = "Answer each question from memory to get instant feedback, the correct answer, an explanation, and your updated score.";

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

  updateScore();
});
