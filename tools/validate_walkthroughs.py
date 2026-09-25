import argparse
import re
from pathlib import Path


def find_walkthrough_files(base_dir: Path):
    modules_dir = base_dir / "modules"
    if not modules_dir.exists():
        return []
    return sorted(modules_dir.rglob("walkthrough.md"))


def has_heading(content: str, heading_name: str) -> bool:
    pattern = rf"^#+\s*{re.escape(heading_name)}\b"
    return re.search(pattern, content, flags=re.IGNORECASE | re.MULTILINE) is not None


def validate_file(path: Path):
    text = path.read_text(encoding="utf-8")
    issues = []

    if not has_heading(text, "Summary"):
        issues.append("Missing Summary section")
    if not has_heading(text, "Quiz"):
        issues.append("Missing Quiz section")

    # Additional structure issues based on the shared validation rules.
    if not text.strip():
        issues.append("File is empty")
    if "TODO" in text or "TBD" in text:
        issues.append("Contains placeholder content")

    return {
        "path": str(path),
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

    files = find_walkthrough_files(args.root)
    results = [validate_file(path) for path in files]
    args.output.parent.mkdir(parents=True, exist_ok=True)
    write_report(results, args.output)

    if not files:
        print("No walkthrough.md files found under modules/.")
    else:
        print(f"Validated {len(files)} walkthrough file(s).")
        for item in results:
            print(f"- {item['path']}: {item['status']}")

    print(f"Report written to {args.output}")


if __name__ == "__main__":
    main()
