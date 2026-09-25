- Generate quiz questions from the provided source material.
- Input format:
  + Accept a topic, learning objective, or source text and the target difficulty level.
  + Define the number of questions to generate and the expected knowledge area.
  + For this workflow, the target topic must be procurement processes only.
- Processing steps:
  + Extract the key facts, concepts, and decision points from the source material.
  + Keep every question anchored to procurement processes and procurement-related business steps only.
  + Do not shift to non-procurement SAP workflows such as order-to-cash, warehouse execution, inventory, or finance unless the user explicitly requests them.
  + If the user mentions another SAP process family, reject it and stay within procurement scope.
  + Draft one clear question for each concept that can be answered without guessing.
  + Write exactly 3 answer options for each question: A, B, and C.
  + Ensure only one option is correct and the other two are plausible distractors.
  + Keep wording concise, unambiguous, and aligned to the source content.
  + If the source is incomplete, mark the question as needing clarification instead of inventing unsupported facts.
- Output format:
  + Present each question as a numbered item.
  + Include the question text, then the three options in the form `A. ...`, `B. ...`, and `C. ...`.
  + Add the correct answer at the end using a clear label such as `Correct answer: B`.
- Constraints:
  + Every question must contain exactly 3 answer options, no more and no fewer.
  + Do not generate a fifth option, multiple-choice variant, or true/false alternative.
  + Keep all options distinct and comparable in length and difficulty.
  + Do not include unsupported or speculative answers.
  + Keep every question strictly within the assigned procurement topic and process scope; do not drift to adjacent or unrelated workflows.
  + Explicitly exclude order-to-cash, warehouse, inventory, and non-procurement process flows unless the user states otherwise.
  + Keep the final quiz concise, reviewable, and suitable for direct use in a training or assessment workflow.
