---
title: "How Many Users Do You Need for an A/B Test? From 1/√N to Hoeffding, Bernstein, and Statistical Power"
date: 2026-08-12 09:00:00 +0530

categories:

- Statistics
- A/B Testing
- Machine Learning

tags:

- ab-testing
- experimentation
- statistics
- concentration-inequalities
- hoeffding
- bernstein
- statistical-power
- sample-size
- ecommerce

math: true
toc: true
mermaid: true
---

{: .shadow .rounded-10 }

When running an A/B test, one of the first questions is:

> **How many users do I need before I can trust the result?**

It is tempting to think that the answer is simply:

> "More users means more confidence."

But there is a precise mathematical relationship between **sample size, estimation error, variance, and confidence**.

In this article, we will build that relationship from first principles.

We will start with the simple observation that the standard error of a sample mean decreases as:

$$
\frac{1}{\sqrt{N}}
$$

Then we will derive this result, connect it to CTR estimation, and use **Hoeffding's inequality** and **Bernstein's inequality** to derive finite-sample guarantees.

Finally, we will connect these ideas to the more familiar **A/B-test power analysis** used to determine how many users an experiment actually needs.

> The key distinction throughout this article is between **estimating a metric accurately** and **detecting a difference between two treatments**. They are related problems, but they are not the same problem.
> {: .prompt-info }


# 1. The E-Commerce Problem

Suppose we are testing a new search-ranking model.

We have two variants:

| Variant | Description |
| --- | --- |
| A | Existing ranking model |
| B | New ranking model |

Suppose our primary metric is **click-through rate (CTR)**.

We observe:

$$
CTR_A = 10\%
$$

and we want to determine whether the new ranking model improves CTR.

For example, suppose the business considers a:

$$
0.5
$$

percentage-point improvement meaningful.

That means we want to detect:

$$
CTR_B - CTR_A = 0.005
$$

or:

$$
10.0\% \rightarrow 10.5\%
$$

The immediate question is:

> **How many users should we put into A and B?**

To answer this, we first need to understand how accurately we can estimate a population quantity from samples.


# 2. Estimating an Unknown Expectation

Suppose there is some random variable:

$$
X
$$

with unknown expectation:

$$
\mu = E[X].
$$

We observe $N$ independent samples:

$$
X_1,X_2,\ldots,X_N.
$$

The natural estimator of the expectation is the sample mean:

$$
\hat{\mu}
=
\frac{1}{N}
\sum_{i=1}^{N}X_i.
$$

For example, if we observe:

$$
10,\;12,\;8,\;11,\;9
$$

then:

$$
\hat{\mu}
=
\frac{10+12+8+11+9}{5}
=
10.
$$

The sample mean is our estimate of the unknown population mean.

The next question is much more interesting:

> **How far is $\hat{\mu}$ likely to be from $\mu$?**


# 3. Why Does the Error Decrease as $1/\sqrt{N}$?

Assume:

$$
E[X_i]=\mu
$$

and:

$$
Var(X_i)=\sigma^2.
$$

Our estimator is:

$$
\hat{\mu}
=
\frac{1}{N}
\sum_{i=1}^{N}X_i.
$$

The expectation of the estimator is:

$$
E[\hat{\mu}]
=
E\left[
\frac{1}{N}
\sum_{i=1}^{N}X_i
\right].
$$

Using linearity of expectation:

$$
E[\hat{\mu}]
=
\frac{1}{N}
\sum_{i=1}^{N}E[X_i].
$$

Since every sample has expectation $\mu$:

$$
E[\hat{\mu}]
=
\frac{1}{N}(N\mu)
=
\mu.
$$

So the sample mean is an **unbiased estimator**.

Now let's calculate its variance.

Because the samples are independent:

$$
Var\left(
\sum_{i=1}^{N}X_i
\right)
=
\sum_{i=1}^{N}Var(X_i).
$$

Therefore:

$$
Var(\hat{\mu})
=
Var\left(
\frac{1}{N}\sum_{i=1}^{N}X_i
\right)
$$

$$
=
\frac{1}{N^2}
\sum_{i=1}^{N}\sigma^2
$$

$$
=
\frac{N\sigma^2}{N^2}
$$

and therefore:

$$
\boxed{
Var(\hat{\mu})
=
\frac{\sigma^2}{N}
}
$$

The standard deviation of the estimator is therefore:

$$
\sqrt{Var(\hat{\mu})}
=
\sqrt{\frac{\sigma^2}{N}}
$$

which gives:

$$
\boxed{
SE(\hat{\mu})
=
\frac{\sigma}{\sqrt{N}}
}
$$

This is the origin of the famous:

$$
\boxed{\frac{1}{\sqrt{N}}}
$$

relationship.


# 4. What Does $1/\sqrt{N}$ Actually Mean?

Suppose your standard error with $N$ users is:

$$
SE_N.
$$

Now suppose you increase the sample size by a factor of four:

$$
N' = 4N.
$$

Then:

$$
SE_{4N}
=
\frac{\sigma}{\sqrt{4N}}
$$

$$
=
\frac{\sigma}{2\sqrt{N}}
$$

Therefore:

$$
\boxed{
SE_{4N}
=
\frac{1}{2}SE_N
}
$$

So:

> **4× more samples gives approximately 2× better precision.**

Similarly:

$$
100\times\text{samples}
\Rightarrow
10\times\text{better precision}.
$$

This is why statistical experiments can become expensive very quickly when the effect we want to detect is small.

Since:

$$
SE\propto\frac{1}{\sqrt{N}},
$$

we can rearrange:

$$
\boxed{
N\propto\frac{1}{SE^2}
}
$$

So reducing the error by 2× requires approximately 4× as much data.


# 5. Applying This to CTR

For CTR, each user can be represented by a Bernoulli random variable:

$$
X_i =
\begin{cases}
1 & \text{if the user clicks} \\
0 & \text{otherwise}
\end{cases}
$$

If the true CTR is:

$$
p=P(X=1),
$$

then:

$$
X\sim Bernoulli(p).
$$

For a Bernoulli random variable:

$$
E[X]=p
$$

and:

$$
Var(X)=p(1-p).
$$

Therefore:

$$
SE(\hat p)
=
\sqrt{
\frac{p(1-p)}{N}
}.
$$

For example, suppose:

$$
p=0.10.
$$

Then:

$$
Var(X)
=
0.10(0.90)
=
0.09.
$$

So:

$$
SE(\hat p)
=
\sqrt{\frac{0.09}{N}}.
$$

For:

$$
N=10,000
$$

we get:

$$
SE(\hat p)
=
\sqrt{\frac{0.09}{10,000}}
=
0.003.
$$

So the standard error is:

$$
\boxed{0.3\text{ percentage points}}
$$

This is the first concrete connection between the $1/\sqrt{N}$ result and A/B testing.


# 6. Standard Error Is Not a Guarantee

There is an important distinction here.

If we say:

$$
SE=0.003
$$

we are describing the **typical scale of sampling variability**.

It does not literally mean:

> "The true CTR is guaranteed to be within 0.3 percentage points."

To make a probability statement such as:

> "I want to be 95% confident that my estimate is within $\epsilon$ of the true value."

we need a stronger tool.

This is where **concentration inequalities** enter.


# 7. Concentration Inequalities

A concentration inequality gives us a bound of the form:

$$
P(|\hat{\mu}-\mu|\geq\epsilon)
\leq
\text{small number}.
$$

In words:

> What is the probability that my estimate is at least $\epsilon$ away from the true expectation?

Two useful inequalities are:

- Hoeffding's inequality
- Bernstein's inequality


# 8. Hoeffding's Inequality

Suppose every observation is bounded:

$$
X_i\in[a,b].
$$

Hoeffding's inequality states:

$$
\boxed{
P(|\hat{\mu}-\mu|\geq\epsilon)
\leq
2\exp
\left(
-\frac{2N\epsilon^2}{(b-a)^2}
\right)
}
$$

Notice something important.

The bound decreases exponentially with:

$$
N\epsilon^2.
$$

This allows us to solve for the required number of samples.

Suppose we want:

$$
P(|\hat{\mu}-\mu|\geq\epsilon)
\leq\delta.
$$

Then:

$$
2\exp
\left(
-\frac{2N\epsilon^2}{(b-a)^2}
\right)
\leq\delta.
$$

Taking logarithms:

$$
-\frac{2N\epsilon^2}{(b-a)^2}
\leq
\log\left(\frac{\delta}{2}\right).
$$

Therefore:

$$
\boxed{
N
\geq
\frac{(b-a)^2}{2\epsilon^2}
\log\left(\frac{2}{\delta}\right)
}
$$


# 9. Example: How Many Users Do I Need to Estimate CTR?

Let's return to our search-ranking experiment.

Suppose CTR is represented by:

$$
X\in[0,1].
$$

Therefore:

$$
a=0,\qquad b=1.
$$

Suppose we want the estimated CTR to be within:

$$
\epsilon=0.005
$$

of the true CTR.

That means:

$$
\pm0.5
$$

percentage points.

We want:

$$
95\%
$$

confidence.

Therefore:

$$
\delta=0.05.
$$

Using Hoeffding:

$$
N
\geq
\frac{1}{2(0.005)^2}
\log\left(\frac{2}{0.05}\right).
$$

This gives approximately:

$$
\boxed{
N\approx73,800
}
$$

So a Hoeffding-based calculation says:

> We need roughly **74,000 users** to guarantee, under the assumptions of the bound, that the estimated CTR is within ±0.5 percentage points of the true CTR with at least 95% probability.

Notice that this is a **finite-sample guarantee**.

It does not rely on saying:

> "The estimate is probably close because $N$ is large."

It gives an explicit probability bound.


# 10. Why Hoeffding Can Be Conservative

Hoeffding knows only that:

$$
0\leq X\leq1.
$$

It does not use the actual variance of the metric.

For a CTR of 10%:

$$
p=0.1
$$

the variance is:

$$
p(1-p)=0.09.
$$

But Hoeffding does not exploit that information.

This motivates a stronger inequality when variance information is available.

That is where **Bernstein's inequality** becomes useful.


# 11. Bernstein's Inequality

A common form of Bernstein's inequality for bounded observations is:

$$
\boxed{
P(|\hat{\mu}-\mu|\geq\epsilon)
\leq
2\exp
\left(
-\frac{N\epsilon^2}
{2\sigma^2+\frac{2(b-a)\epsilon}{3}}
\right)
}
$$

Compare this with Hoeffding.

### Hoeffding

Uses:

$$
b-a
$$

### Bernstein

Uses:

$$
b-a
$$

and also:

$$
\sigma^2.
$$

So Bernstein can take advantage of a metric having relatively low variance.


# 12. Bernstein Sample Size Example

Again suppose:

$$
p=0.10.
$$

For a Bernoulli variable:

$$
\sigma^2=p(1-p)=0.09.
$$

We want:

$$
\epsilon=0.005
$$

and:

$$
\delta=0.05.
$$

Using:

$$
2\exp
\left(
-\frac{N\epsilon^2}
{2\sigma^2+\frac{2\epsilon}{3}}
\right)
\leq0.05,
$$

we obtain:

$$
N
\geq
\frac{
\log(2/0.05)
\left(
2(0.09)+\frac{2(0.005)}{3}
\right)
}
{(0.005)^2}.
$$

This gives approximately:

$$
\boxed{
N\approx27,100
}
$$

So in this example:

| Method | Approx. users |
| --- | ---: |
| Hoeffding | 73,800 |
| Bernstein | 27,100 |

The difference is substantial.

> This illustrates why variance-aware concentration bounds can be much tighter than worst-case boundedness-only bounds.
> {: .prompt-tip }

However, the Bernstein result depends on having a valid variance bound. In practice, if the variance is estimated from data rather than known in advance, that introduces additional statistical considerations.


# 13. But We Have Two Arms — A and B

So far, we've considered one arm.

An A/B test has two populations:

$$
p_A
$$

and:

$$
p_B.
$$

We estimate:

$$
\hat p_A
$$

and:

$$
\hat p_B.
$$

But the quantity we actually care about is:

$$
\boxed{
\Delta=p_B-p_A
}
$$

and its estimator:

$$
\boxed{
\hat\Delta
=
\hat p_B-\hat p_A
}
$$

For example:

$$
\hat p_A=0.100
$$

and:

$$
\hat p_B=0.105.
$$

Then:

$$
\hat\Delta=0.005.
$$

So the estimated improvement is:

$$
\boxed{0.5\text{ percentage points}}
$$


# 14. Why Estimating A and B Separately Is Not the Same as Testing Their Difference

This is an important conceptual distinction.

Suppose we estimate:

$$
p_A
$$

very accurately.

And we estimate:

$$
p_B
$$

very accurately.

That does not automatically mean we have sufficient statistical evidence that:

$$
p_A\neq p_B.
$$

Why?

Because the uncertainty of the difference depends on the uncertainty in **both** estimates.

If:

$$
\hat\Delta
=
\hat p_B-\hat p_A,
$$

then for independent arms:

$$
Var(\hat\Delta)
=
Var(\hat p_A)+Var(\hat p_B).
$$

For Bernoulli metrics:

$$
\boxed{
Var(\hat\Delta)
=
\frac{p_A(1-p_A)}{N_A}
+
\frac{p_B(1-p_B)}{N_B}
}
$$

Therefore:

$$
SE(\hat\Delta)
=
\sqrt{
\frac{p_A(1-p_A)}{N_A}
+
\frac{p_B(1-p_B)}{N_B}
}.
$$

This is the quantity that matters when comparing the two arms.


# 15. The Problem We Actually Care About in an A/B Test

Suppose:

$$
p_A=10\%.
$$

We want to know whether:

$$
p_B=10.5\%
$$

rather than:

$$
p_B=10.0\%.
$$

So the minimum effect we care about is:

$$
\boxed{
\Delta=0.005
}
$$

This is called the **Minimum Detectable Effect (MDE)**.

The question is no longer:

> "Can I estimate CTR accurately?"

It becomes:

> **"How many users do I need so that a true effect of size $\Delta$ can be detected reliably?"**

This leads us to statistical power.


# 16. Statistical Hypothesis Testing

We can formulate:

$$
H_0:p_A=p_B
$$

versus:

$$
H_1:p_A\neq p_B.
$$

The null hypothesis says:

> There is no treatment effect.

The alternative says:

> There is a difference.

We choose a significance level, commonly:

$$
\alpha=0.05.
$$

This controls the probability of a false positive under the assumptions of the statistical test.


# 17. What Is Statistical Power?

Suppose the true treatment effect is actually:

$$
\Delta=0.005.
$$

If we design an experiment with:

$$
80\%
$$

power, then:

$$
\boxed{
P(\text{detect the effect}\mid\text{true effect}=0.005)
=0.80
}
$$

approximately, under the specified testing procedure and assumptions.

This means:

> If the true improvement really is 0.5 percentage points, an experiment with 80% power will detect it about 80% of the time.

It does **not** mean:

> "There is an 80% probability that the effect is 0.5 percentage points."

That distinction is extremely important.


# 18. Approximate Sample Size for a Two-Arm A/B Test

For an equal-sized two-arm test with a binary metric, a commonly used approximation is:

$$
\boxed{
n
\approx
\frac{
2p(1-p)
\left(
z_{1-\alpha/2}+z_{1-\beta}
\right)^2
}
{\Delta^2}
}
$$

where:

- $p$ = baseline conversion rate
- $\Delta$ = minimum detectable effect
- $\alpha$ = significance level
- $1-\beta$ = desired power
- $n$ = users per arm

For:

$$
\alpha=0.05
$$

we have:

$$
z_{1-\alpha/2}\approx1.96.
$$

For:

$$
80\%
$$

power:

$$
z_{1-\beta}\approx0.84.
$$


# 19. Complete A/B Test Example

Suppose:

$$
p=0.10
$$

and we want to detect:

$$
\Delta=0.005.
$$

We choose:

$$
\alpha=0.05
$$

and:

$$
1-\beta=0.80.
$$

Then:

$$
n
\approx
\frac{
2(0.10)(0.90)(1.96+0.84)^2
}
{(0.005)^2}.
$$

Therefore:

$$
n\approx56,400.
$$

So we need approximately:

$$
\boxed{
56,400\text{ users per arm}
}
$$

or:

$$
\boxed{
112,800\text{ total users}
}
$$

for this approximate calculation.


# 20. Why Is This Different From Hoeffding?

This is one of the most important takeaways.

### Hoeffding asks:

> How many samples do I need so that my estimate is within $\epsilon$ of the true mean with probability at least $1-\delta$?

For example:

$$
P(|\hat p-p|\leq0.005)\geq0.95.
$$

### Power analysis asks:

> How many users do I need to detect a difference of $\Delta=0.005$ with a specified significance level and power?

These are different questions.

| Method | Main question |
| --- | --- |
| $1/\sqrt N$ | How does estimation error shrink? |
| Hoeffding | How many samples give a distribution-free error guarantee? |
| Bernstein | Same, but exploit variance information |
| Power analysis | How many users are needed to detect a specified treatment effect? |

This distinction prevents a common mistake:

> **Accurately estimating each arm is not automatically equivalent to having enough statistical power to compare the arms.**


# 21. The $1/\sqrt N$ Relationship Is Still Behind Everything

Although the methods answer different questions, the same fundamental relationship keeps appearing.

We have:

$$
SE\propto\frac{1}{\sqrt N}.
$$

Therefore:

$$
N\propto\frac{1}{SE^2}.
$$

And since the smallest detectable effect is related to the uncertainty of the estimated difference:

$$
N\propto\frac{1}{\Delta^2}.
$$

This explains an extremely important practical property of A/B testing:

> **Detecting an effect that is 10× smaller can require roughly 100× more data.**

For example:

$$
\Delta=1\%
$$

versus:

$$
\Delta=0.1\%.
$$

Since:

$$
\frac{1}{(0.1\%)^2}
=
100
\frac{1}{(1\%)^2},
$$

the sample-size requirement can increase by roughly two orders of magnitude.


# 22. What Does This Mean for E-Commerce?

Consider a search-ranking experiment.

Suppose:

$$
CTR_A=10\%.
$$

You propose a new ranking model B.

There are three possible questions you might ask.

### Question 1: How accurately do I know CTR_A?

Use:

- standard error,
- confidence intervals,
- Hoeffding,
- Bernstein,
- or other estimation tools.

### Question 2: How accurately do I know CTR_B?

Same idea.

### Question 3: Can I reliably determine whether B is better than A?

Now the central quantity is:

$$
\Delta=p_B-p_A
$$

and the experiment should generally be designed using:

- baseline metric,
- MDE,
- significance level,
- desired power.

This is why practical A/B-test planning generally starts with **power analysis** rather than simply applying Hoeffding to each arm independently.


# 23. A Practical Experiment-Design Recipe

Before launching an e-commerce A/B test, define:

### Step 1 — Choose the primary metric

For example:

$$
CTR
$$

or:

$$
Conversion\ Rate.
$$

### Step 2 — Estimate the baseline

Suppose:

$$
p_A=0.10.
$$

### Step 3 — Decide the MDE

Suppose:

$$
\Delta=0.005.
$$

Ask:

> Is a 0.5 percentage-point improvement actually meaningful to the business?

### Step 4 — Choose significance level

Commonly:

$$
\alpha=0.05.
$$

### Step 5 — Choose power

Commonly:

$$
80\%
$$

or:

$$
90\%.
$$

### Step 6 — Calculate sample size

Use an appropriate power calculation.

### Step 7 — Check the result against concentration intuition

Use:

$$
SE\sim\frac{1}{\sqrt N}
$$

and, when appropriate, Hoeffding/Bernstein to understand the finite-sample behavior.

### Step 8 — Determine experiment duration

If you have:

$$
50,000
$$

eligible users per day, and require:

$$
100,000
$$

total users:

$$
\text{duration}
\approx
\frac{100,000}{50,000}
=
2\text{ days}.
$$

In practice, experiment duration also needs to account for business cycles, seasonality, weekday effects, and other operational considerations.


# 24. An Important Real-World Issue: Are Users Independent?

The mathematics above often assumes independent observations.

But e-commerce data frequently violates the naive version of this assumption.

Consider one user generating:

$$
q_1,q_2,q_3,\ldots,q_{20}
$$

search queries.

Those 20 observations are not necessarily independent.

The user's preferences, device, shopping intent, and session context can correlate the observations.

Therefore:

> **100,000 queries do not necessarily contain the same amount of information as 100,000 independent users.**

This is one reason the **unit of randomization** matters.

For example, an experiment might randomize at:

- user level,
- session level,
- query level.

The choice affects both the experiment design and the statistical analysis.


# 25. Another Practical Issue: Multiple Metrics

Suppose your ranking experiment tracks:

- CTR
- conversion rate
- add-to-cart rate
- revenue per user
- dwell time

If you keep checking many metrics and many variants, the probability of observing something statistically significant by chance increases.

This is why real experimentation systems also need to consider:

- multiple hypothesis testing,
- sequential testing,
- experiment peeking,
- primary vs secondary metrics.

The simple sample-size calculation is only one part of a robust experimentation framework.


# 26. The Big Picture

We can now connect the entire mathematical story.

Start with an unknown expectation:

$$
\mu=E[X].
$$

Estimate it using samples:

$$
\hat\mu
=
\frac1N\sum_iX_i.
$$

The variance of the estimator is:

$$
Var(\hat\mu)
=
\frac{\sigma^2}{N}.
$$

Therefore:

$$
\boxed{
SE(\hat\mu)
=
\frac{\sigma}{\sqrt N}
}
$$

For finite-sample guarantees, we can use concentration inequalities:

$$
\boxed{
\text{Hoeffding}
}
$$

or:

$$
\boxed{
\text{Bernstein}
}
$$

When comparing two treatments, we instead care about:

$$
\Delta=p_B-p_A.
$$

And experiment design becomes a question of:

$$
\boxed{
\text{MDE}
+
\alpha
+
\text{power}
\rightarrow
\text{sample size}
}
$$


# 27. Final Mental Model

The entire topic can be summarized as:

```text
Unknown population quantity
          ↓
       Sampling
          ↓
    Sample average
          ↓
  ┌───────┴────────┐
  ↓                ↓
1 / √N         Concentration
  ↓                ↓
Typical        Finite-sample
error scale      guarantee
                   ↓
             Hoeffding / Bernstein
                   
          A/B Experiment
               ↓
        Compare A and B
               ↓
        Difference Δ
               ↓
       MDE + α + Power
               ↓
        Required sample
