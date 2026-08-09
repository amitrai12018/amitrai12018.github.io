---

title: "Optimizing Stone Game II: Prefix Sums and Removing the Player From DP"
date: 2026-08-09 14:00:00 +0530

categories:

* Algorithms
* Dynamic Programming

tags:

* leetcode
* dynamic-programming
* minimax
* game-theory
* prefix-sum
* state-compression
* optimization

math: true
toc: true
mermaid: true

---

{: .shadow .rounded-10 }

Getting a working dynamic-programming solution is often only the beginning.

Once the solution works, two questions become extremely valuable:

> **Are we repeatedly doing unnecessary work?**

and

> **Is every part of our DP state actually necessary?**

That is exactly what happened while solving **Stone Game II**.

The first solution explicitly modeled both players:

```text
state = (player, index, M)
```

This makes the minimax logic easy to understand, but it also gives us two opportunities to simplify:

1. Replace repeated range sums with **prefix sums**.
2. Remove `player` from the DP state entirely using a **current-player perspective**.

The final result is a much cleaner recurrence:

$$
dp(i,M)
=======

\max_X
\left(
remaining(i)
------------

dp(i+X,\max(M,X))
\right)
$$

This article walks through how we arrive there.

> The goal of optimization is not always to make the code shorter. Often, the bigger win is finding a better definition of the state.
> {: .prompt-info }

---

# 1. The Working Solution

Let's start with the solution that makes the minimax logic explicit.

We define the state as:

```text
(player, ind, M)
```

where:

* `player` tells us whose turn it is.
* `ind` is the current index in `piles`.
* `M` determines how many piles can be taken.

The rules allow the current player to choose:

$$
1 \leq X \leq 2M
$$

After taking `X` piles:

$$
M' = \max(M,X)
$$

and the next player starts at:

$$
ind' = ind + X
$$

---

## 2. Explicit Minimax

If Alice is playing, she wants to maximize her score.

So:

```python
best = float("-inf")
```

and for every legal `X`:

```python
best = max(
    best,
    taken + optimise("Bob", ind + X, max(M, X))
)
```

If Bob is playing, Bob wants to minimize Alice's score.

So:

```python
best = float("inf")
```

and:

```python
best = min(
    best,
    -taken + optimise("Alice", ind + X, max(M, X))
)
```

This gives us the explicit minimax state:

```text
(player, ind, M)
```

It works.

But now we can ask:

> **Is there unnecessary work inside each transition?**

---

# 3. Optimization #1 — The Repeated `sum()`

Look at the transition:

```python
taken = sum(piles[ind:ind+x])
```

This looks harmless.

But it isn't an $O(1)$ operation.

If we take `X` piles, Python has to iterate over those `X` elements.

So this:

```python
sum(piles[ind:ind+x])
```

costs:

$$
O(X)
$$

for every transition.

And because the same calculation happens across many DP states, this can become expensive.

The transition itself should ideally be:

$$
O(1)
$$

---

# 4. Prefix Sums

This is a classic situation for prefix sums.

Define:

```python
prefix[i] = sum(piles[0:i])
```

For example:

```text
piles = [2, 7, 9, 4, 4]
```

we construct:

```text
index:   0   1   2   3   4   5
prefix:  0   2   9  18  22  26
```

The key property is:

$$
sum(piles[i:j])
===============

prefix[j] - prefix[i]
$$

So:

```python
sum(piles[ind:ind+x])
```

becomes:

```python
prefix[ind+x] - prefix[ind]
```

Now the range sum is:

$$
O(1)
$$

---

## 5. A Small Example

Suppose:

```text
piles = [2, 7, 9, 4, 4]
```

and:

```text
ind = 1
x = 3
```

We want:

```text
piles[1:4]
```

which is:

```text
[7, 9, 4]
```

and therefore:

$$
7+9+4=20
$$

Using the prefix array:

```text
prefix[4] - prefix[1]
```

gives:

$$
22-2=20
$$

No iteration is required.

This is the first optimization.

---

# 6. The Prefix-Sum Version

The original minimax solution now becomes:

```python
class Solution:
    def stoneGameII(self, piles: List[int]) -> int:

        n = len(piles)

        prefix = [0] * (n + 1)

        for i in range(n):
            prefix[i + 1] = prefix[i] + piles[i]

        dp = {}

        def optimise(player, ind, M):

            if ind >= n:
                return 0

            if (player, ind, M) in dp:
                return dp[(player, ind, M)]

            if player == "Alice":

                best = float("-inf")

                for x in range(
                    1,
                    min(2 * M, n - ind) + 1
                ):

                    taken = prefix[ind + x] - prefix[ind]

                    best = max(
                        best,
                        taken + optimise(
                            "Bob",
                            ind + x,
                            max(M, x)
                        )
                    )

            else:

                best = float("inf")

                for x in range(
                    1,
                    min(2 * M, n - ind) + 1
                ):

                    taken = prefix[ind + x] - prefix[ind]

                    best = min(
                        best,
                        -taken + optimise(
                            "Alice",
                            ind + x,
                            max(M, x)
                        )
                    )

            dp[(player, ind, M)] = best
            return best
```

The important change is simply:

```python
taken = prefix[ind + x] - prefix[ind]
```

instead of:

```python
taken = sum(piles[ind:ind+x])
```

So we have optimized the **transition cost**.

But there is still another question.

---

# 7. Do We Really Need `player`?

Our DP state is currently:

```text
(player, ind, M)
```

This means we can have states like:

```text
Alice(3, 2)
Bob(3, 2)
```

But look carefully at what the game actually cares about.

Does it matter whether the person playing is named Alice or Bob?

Not really.

What matters is:

> **Who is playing right now?**

That suggests a different definition of the state.

Instead of:

```text
(player, ind, M)
```

define:

```text
dp(ind, M)
```

as:

> **The maximum number of stones that the current player can obtain from `ind` onward when the current value of `M` is `M`.**

This is a much more powerful definition.

---

# 8. Why This Removes `player`

Suppose Alice calls:

```text
dp(ind, M)
```

The result means:

> How many stones can Alice optimally obtain from this state?

Now suppose Bob calls:

```text
dp(ind, M)
```

The result means:

> How many stones can Bob optimally obtain from this state?

The function doesn't need to know whether the current player is Alice or Bob.

It simply answers:

> **What can the player whose turn it is obtain?**

Therefore:

```text
player
```

is no longer part of the state.

This removes an entire dimension from the DP.

---

# 9. But How Do We Handle Minimax?

This is the part that initially looks tricky.

Previously we had:

```text
Alice → maximize
Bob   → minimize
```

Now we only have:

```text
dp(ind, M)
```

So how do we represent the opponent?

The answer comes from thinking about **scores from the current player's perspective**.

Suppose we are at:

```text
dp(ind, M)
```

and choose `X` piles.

The current player takes those `X` piles.

Then the opponent receives the state:

```text
dp(
    ind + X,
    max(M, X)
)
```

By definition, that recursive call tells us:

> **How many stones can the opponent optimally obtain from the remaining piles?**

And this gives us a very useful relationship.

---

# 10. The Total Remaining Stones

Let:

```text
remaining = sum(piles[ind:])
```

All of these stones will eventually be divided between:

```text
current player
+
opponent
```

Therefore:

$$
current_player_score
+
opponent_score
==============

remaining
$$

Rearranging:

$$
current_player_score
====================

## remaining

opponent_score
$$

But we already know what the opponent's optimal score is:

$$
dp(ind+X,\max(M,X))
$$

Therefore:

$$
current_player_score
====================

## remaining

dp(ind+X,\max(M,X))
$$

And because the current player wants to maximize their score:

$$
dp(ind,M)
=========

\max_X
\left[
remaining
---------

dp(ind+X,\max(M,X))
\right]
$$

This completely replaces the explicit minimax logic.

---

# 11. The New Recurrence

The recurrence is:

$$
dp(i,M)
=======

\max_X
\left[
remaining(i)
------------

dp(i+X,\max(M,X))
\right]
$$

where:

$$
1 \leq X \leq \min(2M,n-i)
$$

and:

$$
remaining(i)=\sum_{k=i}^{n-1}piles[k]
$$

This is the key optimization.

---

# 12. Why the Subtraction Works

This deserves special attention because it is the core conceptual trick.

Suppose there are:

```text
20 stones remaining
```

After the current player makes a move, the opponent is going to optimally obtain:

```text
12 stones
```

Then the current player must eventually obtain:

```text
20 - 12 = 8
```

There is no need to explicitly model:

```text
Alice's score
Bob's score
```

because the total score is fixed.

If we know the opponent's best possible score, our score is automatically determined.

This is a classic zero-sum DP transformation.

---

# 13. Combining Prefix Sums With the New State

Now we can combine both optimizations.

We already have prefix sums:

```python
prefix[i] = sum(piles[:i])
```

So:

```python
remaining
```

can be calculated in $O(1)$:

```python
remaining = prefix[n] - prefix[ind]
```

Then the recurrence becomes:

```python
dp(ind, M) =
    max(
        remaining
        - dp(ind + x, max(M, x))
    )
```

for every legal `x`.

---

# 14. Final Optimized Solution

The final implementation becomes:

```python
class Solution:
    def stoneGameII(self, piles: List[int]) -> int:

        n = len(piles)

        prefix = [0] * (n + 1)

        for i in range(n):
            prefix[i + 1] = prefix[i] + piles[i]

        dp = {}

        def solve(ind, M):

            if ind >= n:
                return 0

            if (ind, M) in dp:
                return dp[(ind, M)]

            remaining = prefix[n] - prefix[ind]

            best = 0

            for x in range(
                1,
                min(2 * M, n - ind) + 1
            ):

                opponent = solve(
                    ind + x,
                    max(M, x)
                )

                current_player = remaining - opponent

                best = max(
                    best,
                    current_player
                )

            dp[(ind, M)] = best

            return best

        return solve(0, 1)
```

This is the version I would keep as the final reference implementation.

---

# 15. Let's Understand the Recurrence With an Example

Consider:

```text
piles = [2, 7, 9, 4, 4]
```

The total is:

$$
26
$$

Initially:

```text
dp(0,1)
```

Since:

$$
M=1
$$

the current player can take:

$$
X \in {1,2}
$$

So there are two choices.

---

## Choice 1: X = 1

The current player takes:

```text
2
```

The opponent gets:

```text
dp(1,1)
```

The total remaining from index `0` was:

$$
26
$$

Therefore the current player's eventual score is:

$$
26-dp(1,1)
$$

Notice how we don't need to explicitly calculate:

```text
2 + something
```

The entire game is represented by the total remaining score minus the opponent's optimal score.

---

## Choice 2: X = 2

The current player takes:

```text
2 + 7 = 9
```

The opponent gets:

```text
dp(2,2)
```

So the current player's eventual score is:

$$
26-dp(2,2)
$$

Therefore:

$$
dp(0,1)
=======

\max
\left(
26-dp(1,1),
26-dp(2,2)
\right)
$$

This is the central simplification.

We don't separately model Alice and Bob.

We simply ask:

> **How much can the current player guarantee for themselves?**

---

# 16. The Final Mental Model

At this point, the entire problem can be remembered using just three ideas.

## 1. State

```text
dp(i, M)
```

means:

> Maximum stones the current player can obtain from index `i` onward with the current `M`.

---

## 2. Choice

The current player can take:

$$
1 \leq X \leq \min(2M,n-i)
$$

After taking `X`:

```text
next state = (i + X, max(M, X))
```

---

## 3. Recurrence

The opponent gets the next state.

Therefore:

$$
dp(i,M)
=======

\max_X
\left[
remaining(i)
------------

dp(i+X,\max(M,X))
\right]
$$

The subtraction comes from:

$$
my\ score + opponent\ score
===========================

remaining\ stones
$$

---

# 17. What Changed From the First Solution?

It is useful to see the evolution explicitly.

### Initial formulation

```text
state = (player, ind, M)

Alice → maximize
Bob   → minimize
```

This formulation was useful because it made the minimax structure explicit.

---

### Optimization 1: Prefix Sums

We originally had:

```python
sum(piles[ind:ind+x])
```

which repeatedly iterated over the selected range.

We changed it to:

```python
prefix[ind+x] - prefix[ind]
```

Now each range sum is $O(1)$.

---

### Optimization 2: Remove `player`

We originally had:

```text
(player, ind, M)
```

We realized that the player identity doesn't matter.

Only the **current player's perspective** matters.

So the state becomes:

```text
(ind, M)
```

---

### Final formulation

We now have:

$$
dp(i,M)
=======

\max_X
\left[
remaining(i)
------------

dp(i+X,\max(M,X))
\right]
$$

This is both shorter and conceptually cleaner.

---

# 18. Why State Compression Is Powerful

The second optimization is more than a coding trick.

It changes how we think about the DP.

The original state says:

> "Tell me who is playing, and I'll tell you whether to maximize or minimize."

The new state says:

> "I don't care who is playing. Tell me whose turn it is, and I'll tell you how much that player can get."

This is a much more natural state definition.

The minimax behavior is now encoded in the recurrence itself.

We no longer need:

```python
if player == "Alice":
    max(...)
else:
    min(...)
```

Instead, every state has the same meaning:

> **Maximum score available to the player whose turn it is.**

---

# 19. A General DP Pattern

This idea is useful far beyond Stone Game II.

Whenever you encounter a two-player game, consider defining:

```text
dp(state)
```

as:

> **The maximum score the player whose turn it is can obtain from this state.**

Then ask:

> If I make a move and give the opponent the next state, what can the opponent obtain?

If the game is zero-sum and the total remaining value is known:

$$
my\ score
=========

## total\ remaining

opponent\ score
$$

This can eliminate an explicit:

```text
player
```

dimension.

It is a powerful state-compression technique for minimax DP.

---

# 20. The Final Checklist

Before coding, I can now reconstruct the entire solution by asking a few questions.

### What does the state mean?

```text
dp(i, M)
```

> Maximum stones the current player can obtain.

### What can I choose?

$$
1 \leq X \leq \min(2M,n-i)
$$

### What is the next state?

```text
(i + X, max(M, X))
```

### What can the opponent obtain?

```text
dp(i + X, max(M, X))
```

### What can I obtain?

```text
remaining - opponent
```

### How do I calculate `remaining`?

Using prefix sums:

```text
prefix[n] - prefix[i]
```

### What is the recurrence?

$$
dp(i,M)
=======

\max_X
\left(
prefix[n]-prefix[i]
-------------------

dp(i+X,\max(M,X))
\right)
$$

### What is the base case?

```text
i >= n → 0
```

At this point, the implementation is almost a direct translation of the mathematical definition.

---

# 21. The Bigger Lesson

The first working solution wasn't wasted effort.

It gave us the correct minimax structure:

```text
(player, index, M)
```

Then, instead of immediately trying to invent a completely different solution, we asked:

```text
What work are we repeating?
```

That gave us prefix sums.

Then:

```text
Is every state variable actually necessary?
```

That gave us the current-player formulation.

So the evolution was:

```text
Working minimax solution
        ↓
Identify repeated range sums
        ↓
Prefix sums
        ↓
Identify unnecessary player dimension
        ↓
Current-player DP
        ↓
Combine both optimizations
        ↓
Clean O(n)-per-state DP
```

The important habit is:

> **Once a solution works, don't immediately rewrite it. First inspect what information is repeated and what information is actually necessary.**

That is often where the cleanest optimization comes from.

---

# 22. Final Takeaway

The final solution rests on two independent optimizations.

### Optimization 1 — Prefix Sums

Replace:

```python
sum(piles[i:j])
```

with:

```python
prefix[j] - prefix[i]
```

so range sums become $O(1)$.

### Optimization 2 — Remove the Player

Replace:

```text
(player, i, M)
```

with:

```text
(i, M)
```

by defining the state from the perspective of the **current player**.

Then the opponent's score naturally gives us:

$$
my\ score
=========

## remaining

opponent\ score
$$

leading to:

$$
\boxed{
dp(i,M)
=======

\max_X
\left[
remaining(i)
------------

dp(i+X,\max(M,X))
\right]
}
$$

The final insight is not merely:

> "Use prefix sums."

It is:

> **A good DP state should contain exactly the information needed to define the future—not information that only describes who happens to be looking at the state.**

That is what turns the original explicit minimax formulation into the cleaner current-player DP.
