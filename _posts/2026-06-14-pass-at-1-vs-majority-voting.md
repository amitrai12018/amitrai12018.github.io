---
title: "Understanding Pass@1, Majority Voting, and Pass@k Through AIME 2024"
date: 2026-06-14 17:30:00 +0530

categories:
  - Reinforcement Learning
  - RL for LLMs

tags:
  - reasoning-models
  - evaluation
  - pass-at-k
  - majority-voting
  - aime-2024
  - llms

math: true
toc: true
mermaid: true
---

![Pass@1 vs Majority Voting](/assets/img/posts/pass-at-1-vs-majority-voting/2026-06-14-pass-at-1-vs-majority-voting.png)
{: .shadow .rounded-10 }

When reading reasoning model papers, it is common to see numbers such as:

* Pass@1 = 71.0%
* Cons@64 = 86.7%

At first glance, this can be confusing.

How can the same model suddenly improve from 71% to 86.7% without changing the model itself?

The answer lies in understanding three closely related evaluation metrics:

* Pass@1
* Majority Voting, also called Cons@k
* Pass@k

In this article, we'll walk through these metrics using examples from AIME 2024 and build intuition for what each metric is actually measuring.

> Pass@1, Cons@64, and Pass@k are not three different models. They are three different ways of evaluating or using the same model.
> {: .prompt-info }

---

## Why Reasoning Models Need Different Metrics

Reasoning models are stochastic.

If you ask the same question multiple times, you may get:

* different chains of thought,
* different intermediate steps,
* sometimes different final answers.

Because of this variability, a single response may not fully represent a model's capability.

Evaluation metrics help answer questions such as:

* How good is a single response?
* Do multiple reasoning paths converge to the same answer?
* If I get several attempts, how likely am I to obtain a correct solution?

These questions correspond to Pass@1, Majority Voting, and Pass@k respectively.

> Evaluation metrics answer different questions about a model. Understanding those questions is often more important than memorizing the formulas.
> {: .prompt-tip }

---

## What Is AIME 2024?

AIME stands for the American Invitational Mathematics Examination.

It is a challenging mathematics competition often used to evaluate reasoning models.

Each problem:

* requires multi-step reasoning,
* has a single correct answer,
* expects an integer between 0 and 999.

This makes AIME particularly useful for evaluating reasoning systems because correctness is objective.

For example, if the correct answer is:

$$
237
$$

then the model is either correct or incorrect.

There is no partial credit.

---

## 1. Understanding Pass@1

Pass@1 answers the simplest question:

> If I ask the model once, how likely is it to give the correct answer?

Suppose we sample 10 responses and observe:

| Sample | Correct? |
| ------ | -------- |
| 1      | ✓        |
| 2      | ✓        |
| 3      | ✓        |
| 4      | ✓        |
| 5      | ✓        |
| 6      | ✓        |
| 7      | ✓        |
| 8      | ✗        |
| 9      | ✗        |
| 10     | ✗        |

Then Pass@1 is:

$$
\text{Pass@1}
=
\frac{7}{10}
=
70\%
$$

Pass@1 measures ordinary single-shot reliability.

If a user asks a question once, Pass@1 reflects the expected success rate.

> Think of Pass@1 as asking one student for the answer once.
> {: .prompt-tip }

---

## How Pass@1 Is Calculated Step by Step

Now let us connect the idea to benchmark scoring.

Pass@1 means:

> Generate one answer per problem and measure how often that one answer is correct.

### Step 1: Take one benchmark

Suppose we have a benchmark with many problems.

For example:

| Problem | Official Answer |
| ------- | --------------- |
| 1       | 237             |
| 2       | 42              |
| 3       | 918             |
| ...     | ...             |

### Step 2: Generate one response per problem

For each problem, the model gets one attempt.

| Problem | Model's Final Answer |
| ------- | -------------------- |
| 1       | 237                  |
| 2       | 41                   |
| 3       | 918                  |
| ...     | ...                  |

### Step 3: Compare each answer to the ground truth

| Problem | Official Answer | Model Answer | Correct? |
| ------- | --------------- | ------------ | -------- |
| 1       | 237             | 237          | 1        |
| 2       | 42              | 41           | 0        |
| 3       | 918             | 918          | 1        |

Each problem receives a score:

$$
p_i =
\begin{cases}
1, & \text{if the answer is correct} \\
0, & \text{if the answer is incorrect}
\end{cases}
$$

### Step 4: Average the scores

If there are \(N\) benchmark problems, then:

$$
\text{Pass@1}
=
\frac{1}{N}
\sum_{i=1}^{N} p_i
$$

For example, if the model gets 71 out of 100 problems correct:

$$
\text{Pass@1}
=
\frac{71}{100}
=
71\%
$$

So when a paper reports:

$$
\text{Pass@1} = 71.0\%
$$

it means:

> With one sampled answer per problem, the model is correct about 71% of the time.

The model receives only one opportunity per problem.

---

## 2. Understanding Majority Voting, or Cons@k

Pass@1 only looks at a single response.

But what happens if we ask the model multiple times?

Suppose the correct answer is:

$$
42
$$

and the model generates:

| Sample | Final Answer |
| ------ | ------------ |
| 1      | 42           |
| 2      | 42           |
| 3      | 41           |
| 4      | 42           |
| 5      | 39           |
| 6      | 42           |
| 7      | 41           |

The most common answer is:

$$
42
$$

Therefore majority voting returns:

$$
42
$$

which is correct.

This method is called:

$$
\text{Cons@k}
$$

where \(k\) is the number of sampled responses.

So:

$$
\text{Cons@64}
$$

means:

> Generate 64 responses and choose the most frequent final answer.

---

## Why Majority Voting Works

Correct reasoning often converges to the same final answer.

Incorrect reasoning may fail in many different ways.

For example:

| Answer              | Frequency |
| ------------------- | --------: |
| 42                  |        35 |
| 41                  |         8 |
| 39                  |         6 |
| 44                  |         5 |
| 40                  |         4 |
| Other wrong answers |         6 |

Even though many samples are wrong, the correct answer remains the most frequent.

This is why majority voting can improve performance dramatically.

The model itself did not change.

The inference strategy changed.

Instead of trusting one answer, we generate many answers and aggregate them.

---

## How Cons@64 Is Calculated Step by Step

Cons@64 uses the same benchmark as Pass@1, but the evaluation procedure is different.

Instead of generating one answer per problem, we generate 64 answers per problem.

### Step 1: Take one problem

Suppose the official answer is:

$$
237
$$

### Step 2: Sample the model 64 times

We ask the same model the same problem 64 separate times.

The model may produce 64 different reasoning paths:

| Sample | Final Answer |
| ------ | ------------ |
| 1      | 237          |
| 2      | 237          |
| 3      | 241          |
| 4      | 237          |
| 5      | 198          |
| ...    | ...          |
| 64     | ...          |

### Step 3: Extract only the final answer

The long reasoning may be different in each response.

For scoring Cons@64, we only care about the final answer.

### Step 4: Count answer frequencies

Suppose the 64 final answers look like this:

| Answer        | Count |
| ------------- | ----: |
| 237           |    31 |
| 241           |    12 |
| 198           |     8 |
| Other answers |    13 |
| **Total**     |    64 |

### Step 5: Pick the most frequent answer

The most common answer is:

$$
237
$$

So the consensus prediction is:

$$
237
$$

### Step 6: Compare the consensus answer to the official answer

The official answer is:

$$
237
$$

The consensus answer is also:

$$
237
$$

So this problem is marked correct.

### Step 7: Repeat for every benchmark problem

We repeat the same process for every problem in the benchmark.

For each problem:

1. Generate 64 responses.
2. Extract 64 final answers.
3. Count the frequency of each answer.
4. Choose the most frequent answer.
5. Compare it with the official answer.
6. Mark the problem as correct or incorrect.

### Step 8: Compute final Cons@64 accuracy

The formula is:

$$
\text{Cons@64}
=
\frac{
\text{number of problems where the majority answer is correct}
}{
\text{total number of evaluated problems}
}
$$

For example, if the consensus answer is correct for 867 out of 1000 evaluated problem cases:

$$
\text{Cons@64}
=
\frac{867}{1000}
=
86.7\%
$$

So when a paper reports:

$$
\text{Cons@64} = 86.7\%
$$

it means:

> After generating 64 answers per problem and choosing the most common answer, the final prediction is correct 86.7% of the time.

> Cons@64 does not mean the model was correct 64 times. It means we sampled 64 answers and used the majority answer as the final prediction.
> {: .prompt-warning }

---

## AIME 2024 Example

One result reported for reasoning models is:

| Metric  | Accuracy |
| ------- | -------: |
| Pass@1  |    71.0% |
| Cons@64 |    86.7% |

This does **not** mean the model became smarter between 71.0% and 86.7%.

It means the same model was evaluated in two different ways.

| Metric  | Procedure                                  | Meaning |
| ------- | ------------------------------------------ | ------- |
| Pass@1  | Generate one answer per problem             | Single-shot accuracy |
| Cons@64 | Generate 64 answers and take majority vote  | Consensus accuracy |

The improvement is:

$$
86.7\% - 71.0\% = 15.7\%
$$

So majority voting improves the final benchmark score by:

$$
15.7
$$

percentage points.

The key point is:

> The model weights are unchanged. The improvement comes from using more inference-time samples and aggregating them.

In plain language:

* One random sample is correct 71.0% of the time.
* If we generate 64 samples and trust the most common answer, accuracy rises to 86.7%.
* The model did not learn new mathematics during evaluation.
* We simply extracted a more reliable final answer from multiple reasoning attempts.

---

## 3. Understanding Pass@k

Pass@k answers a different question:

> If I get \(k\) attempts, what is the probability that at least one attempt is correct?

This metric is especially useful for code generation.

Why?

Because code can often be tested automatically.

Suppose a model generates:

| Attempt | Result  |
| ------- | ------- |
| 1       | Fail    |
| 2       | Fail    |
| 3       | Success |
| 4       | Fail    |
| 5       | Fail    |

Pass@5 succeeds because one attempt worked.

Unlike majority voting, Pass@k does not care whether the correct answer is the most common.

It only cares whether at least one solution is correct.

---

## How Pass@k Is Calculated Step by Step

There are two ways to understand Pass@k:

1. the practical intuition,
2. the unbiased benchmark estimator.

Let us start with the intuition.

---

### Pass@k: Practical Intuition

Pass@k means:

> Generate \(k\) attempts and check whether at least one attempt is correct.

### Step 1: Take one problem

Suppose we are solving one coding problem.

### Step 2: Generate \(k\) candidate solutions

For Pass@5, we generate 5 attempts:

| Attempt | Result  |
| ------- | ------- |
| 1       | Fail    |
| 2       | Fail    |
| 3       | Success |
| 4       | Fail    |
| 5       | Fail    |

### Step 3: Check whether at least one attempt is correct

Here, attempt 3 succeeds.

So Pass@5 counts this problem as a success.

### Step 4: Repeat for every benchmark problem

If the model succeeds within 5 attempts on 80 out of 100 problems:

$$
\text{Pass@5}
=
\frac{80}{100}
=
80\%
$$

That is the simple intuition.

---

## The Unbiased Pass@k Estimator

In many code-generation benchmarks, researchers generate more than \(k\) samples.

Then they estimate the probability that at least one of \(k\) randomly selected attempts would be correct.

Suppose for one problem:

* \(n\) = total samples generated
* \(c\) = number of correct samples among those \(n\)
* \(k\) = number of attempts allowed

The unbiased estimator is:

$$
\text{Pass@k}
=
1
-
\frac{
\binom{n-c}{k}
}{
\binom{n}{k}
}
$$

This formula looks complicated, but the idea is simple.

The denominator is:

$$
\binom{n}{k}
$$

This counts all possible ways to choose \(k\) samples from the total \(n\) samples.

The numerator is:

$$
\binom{n-c}{k}
$$

This counts the ways to choose \(k\) samples only from the incorrect samples.

So:

$$
\frac{
\binom{n-c}{k}
}{
\binom{n}{k}
}
$$

is the probability that all \(k\) selected samples are wrong.

Therefore:

$$
1
-
\frac{
\binom{n-c}{k}
}{
\binom{n}{k}
}
$$

is the probability that at least one of the \(k\) selected samples is correct.

That is Pass@k.

---

## Pass@k Worked Example

Suppose for one problem:

* \(n = 10\) total generated samples
* \(c = 3\) correct samples
* \(k = 5\) attempts allowed

That means:

| Type of sample | Count |
| -------------- | ----: |
| Correct        |     3 |
| Incorrect      |     7 |
| Total          |    10 |

We want to calculate:

$$
\text{Pass@5}
$$

Instead of directly calculating the probability of at least one correct sample, we calculate the opposite:

> What is the probability that all 5 selected samples are wrong?

There are 7 wrong samples.

So the probability of choosing 5 wrong samples from all 10 samples is:

$$
\frac{
\binom{7}{5}
}{
\binom{10}{5}
}
$$

Now calculate:

$$
\binom{7}{5} = 21
$$

and:

$$
\binom{10}{5} = 252
$$

So:

$$
\frac{
\binom{7}{5}
}{
\binom{10}{5}
}
=
\frac{21}{252}
=
0.0833
$$

That means there is an 8.33% chance that all 5 selected samples are wrong.

Therefore:

$$
\text{Pass@5}
=
1 - 0.0833
=
0.9167
$$

So:

$$
\text{Pass@5}
=
91.67\%
$$

Even though only 3 out of 10 samples are correct, if we are allowed 5 attempts, there is a high chance that at least one selected attempt is correct.

---

## Majority Voting vs Pass@k

Majority Voting and Pass@k often get confused because both involve multiple samples.

But they answer different questions.

### Majority Voting asks:

> What answer appears most often?

### Pass@k asks:

> Did at least one sample get the answer right?

Consider this example:

| Sample | Answer |
| ------ | ------ |
| 1      | 42     |
| 2      | 17     |
| 3      | 17     |
| 4      | 17     |
| 5      | 17     |

Suppose the correct answer is:

$$
42
$$

Then:

* Pass@5 succeeds because one sample is correct.
* Majority Voting fails because the most common answer is 17.

This example highlights the difference between the two metrics.

---

## Cons@64 Is Not the Same as Pass@64

This distinction is important.

Suppose we generate 64 answers for a problem.

### Cons@64

Cons@64 asks:

> What answer appears most often among the 64 samples?

If the most frequent answer is correct, Cons@64 succeeds.

### Pass@64

Pass@64 asks:

> Is at least one of the 64 samples correct?

If even one answer is correct, Pass@64 succeeds.

So Pass@64 is usually more optimistic than Cons@64 because it only requires one correct sample.

However, Pass@64 assumes you have a way to identify the correct answer.

That is why Pass@k is common in code generation.

For code, you can often run tests.

For math, unless you already know the answer, it is harder to automatically identify which sample is correct.

That is why Majority Voting is useful for math reasoning benchmarks.

---

## Why Researchers Report All Three Metrics

Each metric captures a different capability.

| Metric          | Question It Answers                     | Typical Use Case |
| --------------- | --------------------------------------- | ---------------- |
| Pass@1          | Is one answer correct?                  | Standard single-response evaluation |
| Majority Voting | What answer appears most often?         | Math reasoning with exact answers |
| Pass@k          | Is at least one answer correct?         | Code generation or verifiable tasks |

Together they provide a more complete picture of model performance.

---

## What the AIME 2024 Improvement Really Means

When researchers report:

$$
71.0\%
\rightarrow
86.7\%
$$

they are not showing that the model learned new mathematics during evaluation.

Instead, they are showing that:

* the model can generate multiple reasoning paths,
* many correct reasoning paths converge to the same answer,
* aggregating those paths improves reliability.

The model itself is unchanged.

The evaluation or inference strategy changed.

| Setting | What Happens |
| ------- | ------------ |
| Pass@1 | Ask once and score that answer |
| Cons@64 | Ask 64 times, vote, then score the majority answer |

This is why majority voting has become a common evaluation technique for reasoning models.

It turns multiple noisy reasoning attempts into a more reliable final prediction.

---

## Key Takeaways

* Pass@1 measures single-response accuracy.
* Pass@1 = 71.0% means one sampled answer is correct about 71% of the time.
* Majority Voting measures whether repeated reasoning converges on the correct answer.
* Cons@64 = 86.7% means 64 answers were sampled and the majority answer was correct 86.7% of the time.
* Pass@k measures whether at least one attempt is correct.
* Majority Voting and Pass@k answer different questions.
* Cons@64 is not the same as Pass@64.
* AIME 2024 is useful for evaluating mathematical reasoning models because answers are exact and objective.
* Improvements from Pass@1 to Cons@64 demonstrate better inference-time reliability, not a change in model weights.

---

## Quiz : Active Recall

<div id="reasoning-metrics-quiz"></div>
<script src="/assets/js/2026-06-14-pass-at-1-vs-majority-voting.js"></script>
