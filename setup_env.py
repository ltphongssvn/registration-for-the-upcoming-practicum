# File: setup_env.py
# Location: /registration-for-the-upcoming-practicum/setup_env.py
# Purpose: Automated Python virtual environment setup using uv
import subprocess
import sys


def run_command(cmd, description):
    """Execute shell command and handle errors"""
    print(f"\n{'='*60}")
    print(f"Step: {description}")
    print(f"Command: {' '.join(cmd)}")
    print(f"{'='*60}")

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)

    if result.returncode != 0:
        print(f"Error: {description} failed")
        sys.exit(1)

    print(f"Success: {description} completed")
    return result


def main():
    print("Starting virtual environment setup with uv...")

    # Create virtual environment with uv
    run_command(["uv", "venv", ".venv"], "Creating virtual environment")

    print("\n" + "=" * 60)
    print("Virtual environment created successfully!")
    print("To activate: source .venv/bin/activate")
    print("=" * 60)


if __name__ == "__main__":
    main()
