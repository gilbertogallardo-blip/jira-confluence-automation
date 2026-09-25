# Module 12 Completion Report

## Instruction File
- Filename: use-compound-interest.agent.md

- Compound interest is interest calculated on both the original principal and the accumulated interest from prior periods, which makes savings or investments grow faster over time.
- Use this instruction for principal, annual rate, compounding frequency, and time-based growth calculations.
- Example: `python tools/compound_interest.py 1000 5 12 10` for monthly compounding over 10 years.
- Compare compounding frequencies by running the same values with different `compounds_per_year` inputs, such as 12 vs 1; more frequent compounding usually produces a higher final amount.
- If the user provides invalid values, stop and ask for corrected numeric inputs instead of guessing.
- Error example: `python tools/compound_interest.py 1000 -5 0 2` shows `Error: principal and annual rate must be non-negative, compounds per year must be positive, and years must be non-negative.`
- Use `python tools/compound_interest.py --help` to see the command syntax and examples.
- The arguments are: principal, annual rate, compounds per year, years.
- Output values are rounded to 2 decimal places and should be displayed as `Final Amount: ...` and `Interest Earned: ...`.
- Keep results brief, fact-based, and aligned with the real script output.

## Script File
- Filename: compound_interest.py
- Language: Python

import sys


def print_help():
    print("Usage: python tools/compound_interest.py <principal> <annual_rate> <compounds_per_year> <years>")
    print("Example: python tools/compound_interest.py 1000 5 4 2")
    print("Example: python tools/compound_interest.py 1000 5 12 10")
    print("Example: python tools/compound_interest.py 2500 4 365 5")
    print("Notes: annual_rate is entered as a percentage, compounds_per_year must be a positive integer, years must be >= 0, and output is rounded to 2 decimal places.")


def calculate_compound_interest(principal, annual_rate, compounds_per_year, years):
    amount = principal * (1 + (annual_rate / 100) / compounds_per_year) ** (compounds_per_year * years)
    interest_earned = amount - principal
    return amount, interest_earned


def main():
    if len(sys.argv) == 2 and sys.argv[1] in {"-h", "--help"}:
        print_help()
        return 0

    if len(sys.argv) != 5:
        print("Usage: python tools/compound_interest.py <principal> <annual_rate> <compounds_per_year> <years>")
        return 1

    try:
        principal = float(sys.argv[1])
        annual_rate = float(sys.argv[2])
        compounds_per_year = int(sys.argv[3])
        years = float(sys.argv[4])
    except ValueError:
        print("Error: all arguments must be numeric values, and compounds_per_year must be a whole number.")
        return 1

    if principal < 0 or annual_rate < 0 or compounds_per_year <= 0 or years < 0:
        print("Error: principal and annual rate must be non-negative, compounds per year must be positive, and years must be non-negative.")
        return 1

    amount, interest_earned = calculate_compound_interest(principal, annual_rate, compounds_per_year, years)

    print(f"Final Amount: {amount:.2f}")
    print(f"Interest Earned: {interest_earned:.2f}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

## Script Execution Output
Command: python tools/compound_interest.py --help

Usage: python tools/compound_interest.py <principal> <annual_rate> <compounds_per_year> <years>
Example: python tools/compound_interest.py 1000 5 4 2
Example: python tools/compound_interest.py 1000 5 12 10
Example: python tools/compound_interest.py 2500 4 365 5
Notes: annual_rate is entered as a percentage, compounds_per_year must be a positive integer, years must be >= 0, and output is rounded to 2 decimal places.

Command: python tools/compound_interest.py 1000 5 12 10

Final Amount: 1647.01
Interest Earned: 647.01

Command: python tools/compound_interest.py 1000 5 1 10

Final Amount: 1628.89
Interest Earned: 628.89

Command: python tools/compound_interest.py 1000 -5 0 2

Error: principal and annual rate must be non-negative, compounds per year must be positive, and years must be non-negative.

Command: python tools/compound_interest.py 1000 5 4 2

Final Amount: 1104.49
Interest Earned: 104.49
