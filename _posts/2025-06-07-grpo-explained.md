---
title: "Understanding GRPO Through a Complete Numerical Example"
date: 2026-06-07 09:00:00 +0530
categories: [Reinforcement Learning, RL for LLMs, GRPO]
tags: [grpo, rlhf, llms]
toc: true
mermaid: false
---

# Understanding GRPO Through a Complete Numerical Example

When learning GRPO, the key idea is to understand how reward, advantage, PPO clipping, and KL divergence work together during policy updates.

## 1. Why GRPO uses multiple sampled responses

For one prompt, the model generates several candidate outputs. Each output gets a reward score.

Suppose the prompt is:

> Write a polite customer support reply.

The model generates three responses:

- \(o_1\)
- \(o_2\)
- \(o_3\)

Assume the reward model gives:

\[
R_1 = 0.9,\quad R_2 = 0.6,\quad R_3 = 0.2
\]

## 2. Compute the GRPO advantage

First compute the group mean reward:

\[
\mu = \frac{0.9 + 0.6 + 0.2}{3} = 0.5667
\]

Then the standard deviation:

\[
\sigma \approx 0.2867
\]

The GRPO advantage is:

\[
A_i = \frac{R_i - \mu}{\sigma}
\]

So we get:

\[
A_1 \approx 1.16,\quad A_2 \approx 0.12,\quad A_3 \approx -1.28
\]

Interpretation:

- \(o_1\) is better than average
- \(o_2\) is slightly better than average
- \(o_3\) is worse than average

## 3. Add the PPO policy ratio

Assume:

\[
\pi_{\text{old}}(o_1|q)=0.20,\quad \pi_{\text{old}}(o_2|q)=0.30,\quad \pi_{\text{old}}(o_3|q)=0.10
\]

\[
\pi_{\theta}(o_1|q)=0.25,\quad \pi_{\theta}(o_2|q)=0.25,\quad \pi_{\theta}(o_3|q)=0.05
\]

Then:

\[
\rho_i = \frac{\pi_\theta(o_i|q)}{\pi_{\text{old}}(o_i|q)}
\]

So:

\[
\rho_1 = 1.25,\quad \rho_2 = 0.83,\quad \rho_3 = 0.50
\]

The PPO term uses:

\[
\min(\rho A,\ \text{clip}(\rho, 1-\epsilon, 1+\epsilon)A)
\]

This keeps updates stable.

## 4. Why KL divergence is added

GRPO also penalizes large drift from the reference model.

Let:

\[
r = \frac{\pi_{\text{ref}}(o|q)}{\pi_{\theta}(o|q)}
\]

The per-sample KL estimator used in GRPO is:

\[
r - \log(r) - 1
\]

This gives a non-negative penalty and is computed from a sampled output rather than summing over all possible outputs.

## 5. Final GRPO objective

A simplified GRPO objective is:

\[
J_{\text{GRPO}} = \mathbb{E}\left[\min(\rho A,\ \text{clip}(\rho)A) - \beta(r-\log(r)-1)\right]
\]

- Advantage tells the model which sampled outputs were better or worse.
- KL keeps the policy close to the reference model.
- Clipping prevents unstable updates.

## 6. Summary

GRPO works by comparing multiple sampled responses for the same prompt, assigning relative advantages, and then updating the policy with both reward improvement and KL regularization.

That is why GRPO is stable and useful for post-training large language models.
