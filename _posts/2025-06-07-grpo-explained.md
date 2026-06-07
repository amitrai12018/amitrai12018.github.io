---

title: "Understanding GRPO Through a Complete Numerical Example"
date: 2025-06-07 09:00:00 +0530

categories:

* Reinforcement Learning
* RL for LLMs

tags:

* grpo
* rlhf
* llms
* kl-divergence

math: true
toc: true
---------

When reading papers about **GRPO (Group Relative Policy Optimization)**, it is easy to get lost in the equations and implementation details.

The best way to understand GRPO is to see how all the components—**reward, advantage, PPO clipping, and KL divergence**—work together in a concrete example.

In this article, we'll walk through a complete GRPO update step by step.

> GRPO is the algorithm used to optimize LLMs using reinforcement learning while avoiding the need for a separate value model.
> {: .prompt-info }

## Why GRPO Generates Multiple Responses

Consider the prompt:

> Write a polite customer support reply.

Instead of generating a single response, GRPO samples multiple responses from the model:

* (o_1)
* (o_2)
* (o_3)

Each response is evaluated by a reward model.

Suppose the rewards are:

$$
R_1 = 0.9,\quad R_2 = 0.6,\quad R_3 = 0.2
$$

At this point we know which response performed better, but we still need a learning signal that tells the model **how much better** one response was compared to the others.

That signal is called the **advantage**.

---

## Computing the GRPO Advantage

GRPO computes advantages relative to other responses generated for the same prompt.

First compute the group mean reward:

$$
\mu
===

# \frac{0.9 + 0.6 + 0.2}{3}

0.5667
$$

Then compute the standard deviation:

$$
\sigma \approx 0.2867
$$

The GRPO advantage is:

$$
A_i
===

\frac{R_i - \mu}{\sigma}
$$

Applying the formula:

$$
A_1 \approx 1.16
$$

$$
A_2 \approx 0.12
$$

$$
A_3 \approx -1.28
$$

### Interpretation

| Response | Reward | Advantage |
| -------- | ------ | --------- |
| (o_1)    | 0.9    | +1.16     |
| (o_2)    | 0.6    | +0.12     |
| (o_3)    | 0.2    | -1.28     |

This tells the model:

* (o_1) is significantly better than average
* (o_2) is slightly better than average
* (o_3) is worse than average

> Positive advantages increase probability.
>
> Negative advantages decrease probability.
> {: .prompt-tip }

---

## Computing the PPO Policy Ratio

Next we compare the current policy with the policy used to generate the samples.

Assume:

$$
\pi_{old}(o_1|q)=0.20
$$

$$
\pi_{old}(o_2|q)=0.30
$$

$$
\pi_{old}(o_3|q)=0.10
$$

and

$$
\pi_{\theta}(o_1|q)=0.25
$$

$$
\pi_{\theta}(o_2|q)=0.25
$$

$$
\pi_{\theta}(o_3|q)=0.05
$$

The PPO ratio is:

$$
\rho_i
======

\frac{\pi_\theta(o_i|q)}
{\pi_{old}(o_i|q)}
$$

Therefore:

$$
\rho_1 = 1.25
$$

$$
\rho_2 = 0.83
$$

$$
\rho_3 = 0.50
$$

PPO then optimizes:

$$
\min
\Big(
\rho A,
\text{clip}(\rho,1-\epsilon,1+\epsilon)A
\Big)
$$

The clipping term prevents excessively large policy updates.

---

## Why GRPO Adds KL Divergence

If we optimize only for reward, the model may:

* Drift away from pretrained behavior
* Learn reward-hacking strategies
* Forget useful capabilities

To prevent this, GRPO keeps the policy close to a reference model.

Let:

$$
r
=

\frac{\pi_{ref}(o|q)}
{\pi_\theta(o|q)}
$$

GRPO uses the per-sample KL estimator:

$$
r - \log(r) - 1
$$

This estimator has several useful properties:

* Always non-negative
* Equals zero when both policies are identical
* Computable from a single sampled response
* Unbiased with respect to the true KL divergence

> The KL term acts like a safety rail that prevents the model from drifting too far from the reference policy.
> {: .prompt-info }

---

## Putting Everything Together

The complete GRPO objective is:

$$
J_{GRPO}
========

\mathbb{E}
\left[
\min
\Big(
\rho A,
\text{clip}(\rho,1-\epsilon,1+\epsilon)A
\Big)
-----

\beta
\Big(
r-\log(r)-1
\Big)
\right]
$$

This objective combines three important ideas:

### 1. Advantage

Advantage determines whether a response is better or worse than other responses generated for the same prompt.

### 2. PPO Clipping

Clipping prevents unstable policy updates.

### 3. KL Regularization

KL divergence prevents the policy from drifting too far away from the reference model.

---

## Intuition

Think of GRPO as balancing two competing forces.

### Reward Improvement

The advantage term says:

> "Generate more responses like the successful ones."

### Stability

The KL term says:

> "Do not forget what the model already knows."

The result is a learning process that improves behavior while maintaining stability.

---

## Key Takeaways

* GRPO generates multiple responses for each prompt.
* Rewards are normalized into group-relative advantages.
* PPO clipping stabilizes policy updates.
* KL divergence keeps the model close to a reference policy.
* Together, these components enable stable reinforcement learning for large language models.

Understanding this interaction between **reward**, **advantage**, **PPO**, and **KL divergence** is the key to understanding how modern RL-based post-training methods improve large language models.
