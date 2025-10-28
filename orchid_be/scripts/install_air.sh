#!/bin/bash


echo "Installing Air..."

if ! command -v go &> /dev/null; then
    echo "Error: Go is not installed. Please install Go first."
    exit 1
fi

echo "Installing Air with go install..."
go install github.com/air-verse/air@latest

if command -v air &> /dev/null; then
    echo "✅ Air installed successfully!"
    echo "Air version: $(air -v)"
    echo ""
    echo "Using Air:"
    echo "  - Run 'air' in project directory to start live reload"
    echo "  - Or run 'air -c .air.toml' to use custom config file"
    echo ""
    echo "Config file .air.toml has been created in project directory."
else
    echo "❌ Air installation failed. Please check again."
    echo "You can try manual installation:"
    echo "  go install github.com/air-verse/air@latest"
    echo "  export PATH=\$PATH:~/go/bin"
    exit 1
fi
