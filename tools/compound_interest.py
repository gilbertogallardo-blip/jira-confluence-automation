import sys


def calculate_compound_interest(principal, annual_rate, compounds_per_year, years):
    amount = principal * (1 + (annual_rate / 100) / compounds_per_year) ** (compounds_per_year * years)
    interest_earned = amount - principal
    return amount, interest_earned


def main():
    if len(sys.argv) != 5:
        print("Usage: python tools/compound_interest.py <principal> <annual_rate> <compounds_per_year> <years>")
        sys.exit(1)

    try:
        principal = float(sys.argv[1])
        annual_rate = float(sys.argv[2])
        compounds_per_year = float(sys.argv[3])
        years = float(sys.argv[4])
    except ValueError:
        print("Error: all arguments must be numeric values.")
        sys.exit(1)

    if principal < 0 or annual_rate < 0 or compounds_per_year <= 0 or years < 0:
        print("Error: principal and annual rate must be non-negative, compounds per year must be positive, and years must be non-negative.")
        sys.exit(1)

    amount, interest_earned = calculate_compound_interest(principal, annual_rate, compounds_per_year, years)

    print(f"Final Amount: {amount:.2f}")
    print(f"Interest Earned: {interest_earned:.2f}")


if __name__ == "__main__":
    main()
