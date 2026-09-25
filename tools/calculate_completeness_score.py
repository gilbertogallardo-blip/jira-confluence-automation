import argparse


def parse_csv(value):
    return {item.strip() for item in value.split(",") if item.strip()}


def calculate_completeness(required_fields, present_fields):
    required = parse_csv(required_fields)
    present = parse_csv(present_fields)
    missing = sorted(required - present)
    score = (len(required & present) / len(required) * 100) if required else 100.0
    return score, sorted(required & present), missing


def main():
    parser = argparse.ArgumentParser(description="Calculate percentage completeness for required business fields.")
    parser.add_argument("required_fields", help="Comma-separated required fields, e.g. id,title,status,owner")
    parser.add_argument("present_fields", help="Comma-separated fields present in the current record")
    args = parser.parse_args()

    score, present, missing = calculate_completeness(args.required_fields, args.present_fields)
    print(f"Completeness Score: {score:.2f}%")
    print(f"Present Fields: {', '.join(present) if present else 'None'}")
    print(f"Missing Fields: {', '.join(missing) if missing else 'None'}")


if __name__ == "__main__":
    main()
