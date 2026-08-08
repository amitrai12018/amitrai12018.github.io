---

title: "Debugging the Lexicographically Smallest Valid Sequence"
date: 2026-08-08 19:00:00 +0530

categories:

- Algorithms
- Competitive Programming

tags:

- leetcode
- greedy
- strings
- subsequences
- debugging
- prefix-suffix

---

{: .shadow .rounded-10 }

When solving a difficult algorithmic problem, the final solution can sometimes look deceptively simple.

But the interesting part is often the journey:

* What did I initially think?
* Which assumptions were wrong?
* What testcase exposed the mistake?
* Which information was actually necessary?
* How did the final greedy strategy emerge?

This article is a debugging journey through **LeetCode 3302 — Find the Lexicographically Smallest Valid Sequence**.

The goal is not just to present the final implementation, but to understand how the solution evolved.

> Sometimes the most valuable part of solving an algorithmic problem is discovering which information you **don't** need.
> {: .prompt-info }

---

## 1. Understanding the Problem

We are given two strings:

```text
word1
word2
```

We need to select `len(word2)` indices from `word1`.

The selected characters must form a string that can be made equal to `word2` by changing **at most one character**.

The indices must be strictly increasing.

Most importantly, we want the:

> **lexicographically smallest sequence of indices.**

For example:

```text
word1 = "vbcca"
         01234

word2 = "abc"
```

We can choose:

```text
[0, 1, 2]
```

The selected characters are:

```text
v b c
```

which can become:

```text
a b c
```

by changing the first character.

So `[0,1,2]` is valid.

---

## 2. The Brute-Force Thought

The first obvious approach is to enumerate every subsequence of `word1` of length `len(word2)`.

The number of possibilities is:

$$
\binom{n}{m}
$$

where:

$$
n = |word1|,\qquad m = |word2|
$$

With:

$$
n \leq 3 \times 10^5
$$

this is obviously impossible.

So we need to exploit the structure of the problem.

---

## 3. What Does a Valid Sequence Look Like?

A valid sequence can differ from `word2` in at most one position.

Therefore, conceptually, it looks like:

```text
exact prefix
+
one character that may be changed
+
exact suffix
```

For example:

```text
word2 = a b c d e
             ↑
          mismatch
```

The selected sequence might look like:

```text
a b x d e
```

where `x` can be changed into `c`.

This led to my first important question:

> **If I choose some position as the one replacement, can I match everything before and after it exactly?**

---

## 4. The Prefix + Suffix Idea

Suppose we choose index `i` in `word1` as the position where the replacement happens.

Visually:

```text
word1:

[----------- prefix -----------] [i] [----------- suffix -----------]
                                  ↑
                            one replacement
```

Then we need:

```text
word2:

[----------- exact ------------] [x] [----------- exact -----------]
                                  ↑
                            replaced character
```

So I started thinking about two questions:

### From the left

> How much of `word2` can I match before position `i`?

### From the right

> How much of `word2` can I match after position `i`?

This naturally suggested building:

```text
prefix[]
suffix[]
```

arrays.

---

## 5. Building the Prefix Information

I initially scanned `word1` from left to right and tracked how far I could progress in `word2`.

For:

```text
word1 = b a c d c
         0 1 2 3 4

word2 = a b c
         0 1 2
```

we scan from the left.

At:

```text
word1[0] = b
```

we cannot match:

```text
word2[0] = a
```

Then:

```text
word1[1] = a
```

matches `word2[0]`.

So the prefix information tells us how far into `word2` we have progressed.

This seemed useful.

---

## 6. Building the Suffix Information

Then I did the same thing from the right.

Starting from the end of `word1`, I tried to match the end of `word2`.

For:

```text
word1 = b a c d c
         0 1 2 3 4

word2 = a b c
         0 1 2
```

the last character:

```text
word2[2] = c
```

can be matched by:

```text
word1[4] = c
```

The suffix information tells us how much of the end of `word2` can be matched after a given position.

At this point I had:

```text
prefix → information from the left
suffix → information from the right
```

And I thought:

> Maybe these two arrays together are enough to identify the position where the replacement should happen.

---

## 7. But Then I Realized Something Important

The prefix array was useful for **understanding the structure**, but it wasn't actually necessary for the final algorithm.

Why?

Because when we scan `word1` from left to right, we are already constructing the prefix.

Suppose:

```text
i = current position in word1
j = current position in word2
```

If:

```text
word1[i] == word2[j]
```

we simply take `i`.

Then:

```text
j += 1
```

So `j` itself tells us:

> **How much of `word2` has already been matched.**

There is no need to separately precompute a prefix array.

This was an important simplification.

### The prefix is implicit.

The left-to-right scan itself maintains it.

---

## 8. Why Do We Still Need the Suffix?

Now consider the interesting case.

Suppose:

```text
word1[i] != word2[j]
```

We have two choices:

1. Skip `i`.
2. Use `i` as our one allowed replacement.

If we use `i`, then:

```text
word1[i] → word2[j]
```

and our one replacement is consumed.

Therefore the only question is:

> **Can the remaining `word2[j+1:]` be matched exactly after `i`?**

This is information about the **future**.

Our left-to-right scan cannot know that directly.

That's why the suffix array is useful.

So the final structure became:

```text
left-to-right scan
        +
suffix preprocessing
```

rather than:

```text
prefix preprocessing
        +
suffix preprocessing
```

---

## 9. My First Greedy Mistake

At this point I made another assumption.

I thought:

> If position `i` can be used as the replacement, then the earliest such `i` must be optimal.

That sounds reasonable because we want the lexicographically smallest indices.

So I tried to find the earliest feasible replacement position.

But this was wrong.

---

## 10. The Counterexample

The testcase that exposed the mistake was:

```text
word1 = "ghhgghhhhhh"
word2 = "gg"
```

My earlier approach produced:

```text
[0, 3]
```

but the correct answer is:

```text
[0, 1]
```

Why?

Look at index `0`:

```text
word1[0] = g
word2[0] = g
```

They already match.

Therefore we should **take index `0` normally**.

We don't need to spend our one replacement there.

So:

```text
answer = [0]
```

Now we need:

```text
word2[1] = g
```

At index `1`:

```text
word1[1] = h
word2[1] = g
```

Now there is a mismatch.

We can use our one replacement:

```text
h → g
```

Therefore:

```text
answer = [0, 1]
```

This is lexicographically smaller than:

```text
[0, 3]
```

because:

$$
[0,1] < [0,3]
$$

---

## 11. The Important Correction

This counterexample changed the greedy strategy.

The wrong strategy was:

```text
Find the earliest position that can be the mismatch.
```

The correct strategy is:

> **Scan `word1` from left to right and ask whether the current index can be the next index in our answer.**

At every index `i`, there are three possibilities.

### Case 1 — Exact match

```text
word1[i] == word2[j]
```

Take it.

```text
ans.append(i)
j += 1
```

We do not consume the replacement.

---

### Case 2 — Mismatch, but replacement is available

```text
word1[i] != word2[j]
```

We can potentially use `i` as the one replacement.

But first we must ask:

> Can the remaining suffix of `word2` be matched after `i`?

If yes:

```text
ans.append(i)
j += 1
changed = True
```

---

### Case 3 — Cannot use `i`

Skip it.

```text
i += 1
```

This is the actual greedy algorithm.

---

## 12. The Final Mental Model

The whole algorithm can now be visualized as:

```mermaid
flowchart TD
    A[Current word1 index i] --> B{word1[i] == word2[j]?}

    B -->|Yes| C[Take i]
    C --> D[j += 1]

    B -->|No| E{Replacement unused?}

    E -->|No| F[Skip i]

    E -->|Yes| G{Can suffix finish word2?}

    G -->|Yes| H[Take i as replacement]
    H --> I[replacement_used = True]
    I --> D

    G -->|No| F
```

The important point is:

> **We are greedily constructing the answer itself, not greedily choosing the replacement position.**

---

## 13. The Role of the Suffix Array

Let's make the suffix question concrete.

Suppose:

```text
word1[i] != word2[j]
```

and we want to use `i` as the replacement.

After replacing:

```text
word1[i] → word2[j]
```

we have already handled `word2[j]`.

So we need:

```text
word2[j+1:]
```

to be matched using:

```text
word1[i+1:]
```

The suffix array lets us answer this efficiently.

If the remaining suffix can be matched, then `i` is safe to take.

Otherwise, we skip `i`.

---

## 14. Constructing the Suffix Array

We scan `word1` from right to left.

Define:

```python
suffix[i]
```

as:

> The number of characters from the end of `word2` that can be matched using `word1[i:]`.

For example:

```text
word1 = ...
word2 = a b c
             ↑
```

If the suffix `"c"` can be matched after position `i`, then:

```text
suffix[i]
```

will reflect that.

The construction is:

```python
suffix = [0] * (n + 1)

j = m - 1

for i in range(n - 1, -1, -1):
    suffix[i] = suffix[i + 1]

    if j >= 0 and word1[i] == word2[j]:
        suffix[i] += 1
        j -= 1
```

The extra `suffix[n] = 0` represents the empty suffix.

---

## 15. The Final Greedy Scan

Now scan from left to right.

Maintain:

```python
j = 0
changed = False
```

where:

* `j` = next character of `word2` we need
* `changed` = whether we have already used our one replacement

At each `i`:

### Exact match

```python
if word1[i] == word2[j]:
    ans.append(i)
    j += 1
```

### Mismatch

If the replacement hasn't been used:

```python
elif not changed:
```

we check whether:

```python
suffix[i + 1] >= m - j - 1
```

Why?

Because after using `i` as the replacement, we still need:

```text
word2[j+1:]
```

whose length is:

$$
m-j-1
$$

If the suffix can match at least that many characters, we can safely take `i`.

---

## 16. Walking Through the Counterexample Again

Consider:

```text
word1 = g h h g g h h h h h h
         0 1 2 3 4 ...

word2 = g g
         0 1
```

Initially:

```text
j = 0
changed = False
ans = []
```

### i = 0

```text
word1[0] = g
word2[0] = g
```

Exact match.

Take it:

```text
ans = [0]
j = 1
```

---

### i = 1

```text
word1[1] = h
word2[1] = g
```

Mismatch.

We haven't used the replacement.

The remaining suffix is:

```text
word2[2:] = ""
```

There is nothing left to match.

Therefore index `1` is safe to use as the replacement.

```text
ans = [0, 1]
changed = True
j = 2
```

We're done.

Final answer:

```text
[0, 1]
```

---

## 17. Why the Greedy Choice Is Correct

Suppose we're currently at index `i`.

If:

```text
word1[i] == word2[j]
```

and we can take `i`, taking it is always preferable to skipping it.

Why?

Because every future valid solution that skips `i` has a later index at this position.

For example:

```text
[i, ...]
```

is always lexicographically smaller than:

```text
[k, ...]
```

when:

$$
i < k
$$

If the current character doesn't match, we only take it as a replacement when the suffix proves that doing so still allows a complete valid solution.

Therefore, at every step, we choose the earliest index that can safely participate in a valid answer.

That is exactly what lexicographical minimization requires.

---

## 18. The Final Algorithm

The entire solution can now be summarized in two phases.

### Phase 1 — Precompute the future

Build:

```python
suffix[]
```

so we can quickly answer:

> Can the remaining `word2` be matched after this position?

### Phase 2 — Greedily construct the answer

Scan `word1` from left to right.

```text
If it matches:
    take it.

If it doesn't match:
    use it as the replacement only if
    the suffix can still finish.

Otherwise:
    skip it.
```

Notice what is **not** present anymore:

```text
prefix[]
```

We initially thought we needed it.

We don't.

The variable:

```python
j
```

already tells us how much of `word2` has been matched.

> **The left-to-right greedy scan maintains the prefix implicitly. The suffix array is the only preprocessing we need because it tells us about the future.**

---

## 19. Final Implementation

```python
from typing import List

class Solution:
    def validSequence(self, word1: str, word2: str) -> List[int]:
        n = len(word1)
        m = len(word2)

        if m > n:
            return []

        # suffix[i] = number of characters from the END of word2
        # that can be matched using word1[i:].
        suffix = [0] * (n + 1)

        j = m - 1

        for i in range(n - 1, -1, -1):
            suffix[i] = suffix[i + 1]

            if j >= 0 and word1[i] == word2[j]:
                suffix[i] += 1
                j -= 1

        ans = []
        j = 0
        changed = False

        for i in range(n):

            if j == m:
                break

            # Prefer an exact match.
            if word1[i] == word2[j]:
                ans.append(i)
                j += 1

            # Otherwise, use the one allowed replacement
            # only if the remaining suffix can be matched.
            elif not changed and suffix[i + 1] >= m - j - 1:
                ans.append(i)
                j += 1
                changed = True

        return ans if j == m else []
```

---

## 20. Complexity

We scan `word1` once to construct the suffix information:

$$
O(n)
$$

Then scan it once more to construct the answer:

$$
O(n)
$$

Therefore:

$$
\boxed{O(n)}
$$

time complexity.

The suffix array requires:

$$
\boxed{O(n)}
$$

additional space.

---

## 21. The Debugging Journey in One Picture

```mermaid
flowchart TD
    A[Brute force all subsequences] --> B[Too many possibilities]

    B --> C[Valid sequence = exact prefix + at most one mismatch + exact suffix]

    C --> D[Initial idea: maintain prefix + suffix]

    D --> E[Use prefix/suffix to find feasible replacement]

    E --> F[Wrong assumption: earliest feasible replacement is optimal]

    F --> G["Counterexample: g h h g g ... / g g"]

    G --> H[Why did [0,3] lose to [0,1]?]

    H --> I[Exact matches must be preferred]

    I --> J[Left-to-right greedy construction]

    J --> K[Prefix is implicit in j]

    K --> L[Only suffix preprocessing is necessary]

    L --> M[Final O(n) greedy algorithm]
```

---

## 22. What I Learned

The most important lesson from this problem wasn't the suffix array.

It was learning to distinguish:

### Feasibility

> **Can this position be used as the one replacement?**

from:

### Greedy choice

> **Can this position be the next index of my lexicographically smallest answer?**

Those are not the same question.

The first version focused too much on finding a replacement position.

The counterexample forced a better question:

> **At every position in `word1`, can I safely take this index now?**

That led to the final strategy:

```text
Exact match?
    ↓
Take it.

Mismatch?
    ↓
Can the suffix finish if I use my replacement?
    ↓
Yes → take it.
No  → skip it.
```

And one final simplification emerged from the debugging:

> **We don't need to explicitly maintain the prefix. The greedy scan is already maintaining it for us.**

That was the final step that turned the original prefix/suffix idea into a clean linear-time solution.

---

## 23. Final Takeaway

The path to the solution was:

```text
Brute force
    ↓
Understand the one-mismatch structure
    ↓
Think prefix + suffix
    ↓
Build prefix + suffix
    ↓
Question the greedy choice
    ↓
Find counterexample
    ↓
Prefer exact matches
    ↓
Realize prefix is implicit
    ↓
Keep only suffix preprocessing
    ↓
Greedy left-to-right scan
```

The final insight is simple:

> **Build just enough information about the future to make a greedy decision about the current index.**
> {: .prompt-tip }
