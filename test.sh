#!/bin/bash
# Test script for Skylight Calendar

set -e

echo "=========================================="
echo "Skylight Calendar - Test Suite"
echo "=========================================="
echo ""

# Check dependencies
echo "1. Checking dependencies..."
command -v python3 >/dev/null 2>&1 || { echo "Error: python3 is required"; exit 1; }
command -v pip3 >/dev/null 2>&1 || { echo "Error: pip3 is required"; exit 1; }
echo "✓ Dependencies found"
echo ""

# Install Python packages
echo "2. Installing Python packages..."
cd rootfs/app
pip3 install -q -r ../../requirements.txt
echo "✓ Packages installed"
echo ""

# Run Python syntax check
echo "3. Checking Python syntax..."
python3 -m py_compile server.py
echo "✓ server.py syntax valid"
echo ""

# Run tests
echo "4. Running unit tests..."
pytest tests/ -v
TEST_RESULT=$?
echo ""

# Run linting (if available)
echo "5. Running code quality checks..."
if command -v flake8 >/dev/null 2>&1; then
    flake8 server.py --max-line-length=120 --ignore=E402 || echo "⚠ Linting warnings (non-critical)"
else
    echo "⚠ flake8 not installed, skipping linting"
fi
echo ""

# Check file structure
echo "6. Verifying file structure..."
cd ../..
for file in config.yaml Dockerfile build.yaml README.md; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "✗ $file missing"
        exit 1
    fi
done

for file in rootfs/app/server.py rootfs/app/static/index.html rootfs/app/static/app.js rootfs/app/static/styles.css; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "✗ $file missing"
        exit 1
    fi
done
echo ""

echo "=========================================="
if [ $TEST_RESULT -eq 0 ]; then
    echo "✓ All tests passed!"
    echo "=========================================="
    exit 0
else
    echo "✗ Some tests failed"
    echo "=========================================="
    exit 1
fi
