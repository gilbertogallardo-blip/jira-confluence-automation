# Module 15 Completion Report

## Script Metadata
- Filename: validate_walkthroughs.py
- Language: Python
- Purpose: Scans for walkthrough.md files under modules/ and validates each file for required Summary and Quiz sections, writing a Markdown report of the results.

## Script Contents
```python
import argparse
import re
from pathlib import Path


def display_path(path: Path, root: Path) -> str:
    try:
        return str(path.resolve().relative_to(root.resolve()).as_posix())
    except ValueError:
        return str(path)


def find_walkthrough_files(base_dir: Path):
    modules_dir = base_dir / "modules"
    if not modules_dir.exists():
        return []
    return sorted(modules_dir.rglob("walkthrough.md"))


def has_heading(content: str, heading_name: str) -> bool:
    pattern = rf"^#+\s*{re.escape(heading_name)}\b"
    return re.search(pattern, content, flags=re.IGNORECASE | re.MULTILINE) is not None


def validate_file(path: Path, root: Path):
    text = path.read_text(encoding="utf-8")
    issues = []

    if not has_heading(text, "Summary"):
        issues.append("Missing Summary section")
    if not has_heading(text, "Quiz"):
        issues.append("Missing Quiz section")

    if not text.strip():
        issues.append("File is empty")
    if "TODO" in text or "TBD" in text:
        issues.append("Contains placeholder content")

    return {
        "path": display_path(path, root),
        "status": "Pass" if not issues else "Fail",
        "issues": issues if issues else ["No issues found"],
    }


def write_report(results, report_path: Path):
    lines = [
        "# Walkthrough Validation Report",
        "",
        f"Checked files: {len(results)}",
        "",
    ]

    if not results:
        lines.append("No walkthrough.md files were found under the modules/ directory.")
    else:
        for item in results:
            lines.append(f"## {item['path']}")
            lines.append(f"Status: {item['status']}")
            lines.append("Issues:")
            for issue in item["issues"]:
                lines.append(f"- {issue}")
            lines.append("")

    report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Validate walkthrough files for Summary and Quiz sections.")
    parser.add_argument("--root", type=Path, default=Path("."), help="Repository root to scan")
    parser.add_argument("--output", type=Path, default=Path("work/walkthrough-validation-results.md"), help="Path for the markdown report")
    args = parser.parse_args()

    root = args.root.resolve()
    files = find_walkthrough_files(root)
    results = [validate_file(path, root) for path in files]
    output_path = args.output if args.output.is_absolute() else root / args.output
    output_path.parent.mkdir(parents=True, exist_ok=True)
    write_report(results, output_path)

    if not files:
        print("No walkthrough.md files found under modules/.")
    else:
        print(f"Validated {len(files)} walkthrough file(s).")
        for item in results:
            details = "; ".join(issue for issue in item["issues"] if issue != "No issues found")
            if details:
                print(f"- {item['path']}: {item['status']} | Issues: {details}")
            else:
                print(f"- {item['path']}: {item['status']} | No issues found")

    print(f"Report written to {display_path(output_path, root)}")


if __name__ == "__main__":
    main()
```

## Parameters
| Parameter | Description | Default |
|-----------|-------------|---------|
| --root | Repository root directory to scan for modules/ | . |
| --output | Output path for the Markdown validation report | work/walkthrough-validation-results.md |

## Test Run Output
Validated 3 walkthrough file(s).
- modules/module-01/subdir/walkthrough.md: Pass | No issues found
- modules/module-02/walkthrough.md: Pass | No issues found
- modules/module-03/walkthrough.md: Fail | Issues: Missing Summary section; Missing Quiz section
Report written to work/walkthrough-validation-results.md
