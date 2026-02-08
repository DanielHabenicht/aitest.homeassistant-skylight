# Contributing to Skylight Calendar

Thank you for your interest in contributing to Skylight Calendar!

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/DanielHabenicht/aitest.homeassistant-skylight/issues)
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Home Assistant version
   - Browser/environment details
   - Relevant logs

### Suggesting Enhancements

1. Check existing [Issues](https://github.com/DanielHabenicht/aitest.homeassistant-skylight/issues) and [Discussions](https://github.com/DanielHabenicht/aitest.homeassistant-skylight/discussions)
2. Create a new issue with:
   - Clear description of the enhancement
   - Use cases
   - Mockups or examples (if applicable)

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**:
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

4. **Test your changes**:
   ```bash
   ./test.sh
   ```

5. **Commit your changes**:
   ```bash
   git commit -m "Add feature: your feature description"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**:
   - Describe your changes
   - Reference any related issues
   - Include screenshots for UI changes

## Development Setup

### Prerequisites

- Docker (for testing with Home Assistant)
- Python 3.8+
- Git

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DanielHabenicht/aitest.homeassistant-skylight
   cd aitest.homeassistant-skylight
   ```

2. **Install dependencies**:
   ```bash
   pip3 install -r requirements.txt
   ```

3. **Run tests**:
   ```bash
   ./test.sh
   ```

4. **Start the development server**:
   ```bash
   cd rootfs/app
   export SUPERVISOR_TOKEN="test_token"
   export HASS_URL="http://localhost:8123"
   python3 server.py
   ```

## Code Style

### Python

- Follow PEP 8
- Use meaningful variable names
- Add docstrings to functions
- Keep functions focused and small
- Maximum line length: 120 characters

### JavaScript

- Use modern ES6+ syntax
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small
- Use consistent indentation (2 spaces)

### CSS

- Use BEM naming convention where appropriate
- Group related styles together
- Use CSS variables for colors and common values
- Comment complex selectors

## Testing

### Running Tests

```bash
cd rootfs/app
pytest tests/ -v
```

### Writing Tests

- Add tests for new features
- Test edge cases
- Test error handling
- Keep tests focused and isolated

### Test Structure

```python
def test_feature_name(client):
    """Test description."""
    # Setup
    # Execute
    # Assert
```

## Documentation

### README Updates

- Keep the README up to date
- Add new features to the feature list
- Update configuration options
- Add examples for new functionality

### Code Comments

- Comment complex algorithms
- Explain "why" not "what"
- Keep comments up to date
- Remove outdated comments

## Release Process

1. Update version in `config.yaml` and `config.json`
2. Update `CHANGELOG.md`
3. Create a new tag:
   ```bash
   git tag -a v1.1.0 -m "Release v1.1.0"
   git push origin v1.1.0
   ```
4. Create a GitHub release with release notes

## Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## Questions?

- Open a [Discussion](https://github.com/DanielHabenicht/aitest.homeassistant-skylight/discussions)
- Ask in the Home Assistant community
- Check existing documentation

Thank you for contributing! 🎉
