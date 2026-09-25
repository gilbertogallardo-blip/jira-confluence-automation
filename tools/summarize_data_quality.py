import argparse


def summarize_quality(total_records, missing_values, uncertain_records, required_fields):
    total_checks = total_records * required_fields
    if total_checks <= 0:
        quality_score = 100.0
    else:
        quality_score = max(0.0, 100.0 * (1 - ((missing_values + uncertain_records) / total_checks)))
    return quality_score, missing_values, uncertain_records, total_checks


def main():
    parser = argparse.ArgumentParser(description="Summarize record quality using missing and uncertain values.")
    parser.add_argument("total_records", type=int, help="Total number of records evaluated")
    parser.add_argument("missing_values", type=int, help="Count of missing values")
    parser.add_argument("uncertain_records", type=int, help="Count of uncertain or flagged records")
    parser.add_argument("required_fields", type=int, help="Number of required fields checked per record")
    args = parser.parse_args()

    quality_score, missing_values, uncertain_records, total_checks = summarize_quality(
        args.total_records,
        args.missing_values,
        args.uncertain_records,
        args.required_fields,
    )

    print(f"Total Records: {args.total_records}")
    print(f"Missing Values: {missing_values}")
    print(f"Uncertain Records: {uncertain_records}")
    print(f"Required Fields per Record: {args.required_fields}")
    print(f"Total Checks: {total_checks}")
    print(f"Quality Score: {quality_score:.2f}%")


if __name__ == "__main__":
    main()
