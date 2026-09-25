- Validate walkthrough files against the project rules for content completeness and structure.
- Task definition:
  + Target files: all `modules/**/walkthrough.md` files in the repository.
  + Validation rule set: read `./validation-rules.md` before evaluating each file.
  + Required checks: confirm the file contains a `## Summary` section and a `## Quiz` section; flag missing, empty, or placeholder sections.
  + Output format: produce a Markdown report with one section per file and a clear pass/fail result.
- Processing steps:
  + Step 1: read `./validation-rules.md`.
  + Step 2: find each `walkthrough.md` file under `modules/`.
  + Step 3: read the file contents one at a time.
  + Step 4: check the file against each rule.
  + Step 5: report issues in a Markdown summary for that file.
  + Step 6: move to the next file and repeat the workflow.
  + Step 7: if no files are found, record that status in the report instead of failing silently.
- Output format:
  + Use a heading such as `# Walkthrough Validation Report`.
  + For each file, include the file path, status (`Pass` or `Fail`), and `Issues` list.
  + If a file passes, note `No issues found`.
  + If a file fails, list each missing or invalid section exactly as detected.
- Constraints:
  + Validate each file individually rather than batching the checks into a single pass.
  + Keep the analysis consistent, repeatable, and based only on the validation rules.
  + Do not infer missing sections or create content that is not present in the file.
  + If the repository has no matching walkthrough files, record the absence explicitly as a valid result.
