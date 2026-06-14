---
title: "Understanding Pass@1, Majority Voting, and Pass@k Through AIME 2024"
date: 2026-06-14 17:45:00 +0530

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

![Pass@1 vs Majority Voting](/assets/img/posts/pass-at-k-explained/pass-at-k-cover.png)
{: .shadow .rounded-10 }

When reading reasoning model papers, it is common to see numbers such as:

* Pass@1 = 71.0%
* Cons@64 = 86.7%

At first glance, this can be confusing.

How can the same model suddenly improve from 71% to 86.7% without changing the model itself?

The answer lies in understanding three closely related evaluation metrics:

* Pass@1
* Majority Voting (Cons@k)
* Pass@k

In this article, we'll walk through these metrics using examples from AIME 2024 and build intuition for what each metric is actually measuring.

> Evaluation metrics answer different questions about a model. Understanding those questions is often more important than understanding the formulas.
> {: .prompt-info }

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

---

## What Is AIME 2024?

AIME (American Invitational Mathematics Examination) is a challenging mathematics competition often used to evaluate reasoning models.

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

Then:

$$
\text{Pass@1}
=============

# \frac{7}{10}

70%
$$

Pass@1 measures ordinary single-shot reliability.

If a user asks a question once, Pass@1 reflects the expected success rate.

> Think of Pass@1 as asking one student for the answer.
> {: .prompt-tip }

---

## 2. Understanding Majority Voting (Cons@k)

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

### Why Majority Voting Works

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

---

## AIME 2024 Example

One result reported for reasoning models is:

| Metric  | Accuracy |
| ------- | -------: |
| Pass@1  |    71.0% |
| Cons@64 |    86.7% |

This does **not** mean the model became smarter.

It means:

* One random sample is correct 71% of the time.
* If we generate 64 samples and trust the most common answer, accuracy rises to 86.7%.

The improvement comes from aggregating multiple reasoning paths.

---

## 3. Understanding Pass@k

Pass@k answers a different question:

> If I get k attempts, what is the probability that at least one attempt is correct?

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

## Majority Voting vs Pass@k

These metrics often get confused.

### Majority Voting asks:

> What answer do the samples collectively agree on?

### Pass@k asks:

> Did at least one sample get the answer right?

Consider:

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

* Pass@5 succeeds
* Majority Voting fails

This example highlights the difference between the two metrics.

---

## Why Researchers Report All Three Metrics

Each metric captures a different capability.

| Metric          | Question                        |
| --------------- | ------------------------------- |
| Pass@1          | Is one answer correct?          |
| Majority Voting | What answer appears most often? |
| Pass@k          | Is at least one answer correct? |

Together they provide a more complete picture of model performance.

---

## What the AIME 2024 Improvement Really Means

When researchers report:

$$
71.0%
\rightarrow
86.7%
$$

they are not showing that the model learned new mathematics.

Instead, they are showing that:

* the model can generate multiple reasoning paths,
* many correct reasoning paths converge to the same answer,
* aggregating those paths improves reliability.

This is why majority voting has become a common evaluation technique for reasoning models.

---

## Key Takeaways

* Pass@1 measures single-response accuracy.
* Majority Voting measures whether repeated reasoning converges on the correct answer.
* Pass@k measures whether at least one attempt is correct.
* Majority Voting and Pass@k answer different questions.
* AIME 2024 is widely used to evaluate mathematical reasoning models.
* Improvements from Pass@1 to Cons@64 demonstrate reasoning consistency rather than changes to the model itself.

## Quiz : Active Recall

<div id="reasoning-metrics-quiz"></div>
<script src="/assets/js/reasoning-metrics-quiz.js"></script>
