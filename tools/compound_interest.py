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
