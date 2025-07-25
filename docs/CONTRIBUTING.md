# Contributing to Developers Blog

Thank you for your interest in contributing to the Developers Blog platform! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)

## 🤝 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Git
- Supabase account (for database setup)
- Basic knowledge of TypeScript, React, and Next.js

### Fork the Repository

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/developers-blog.git
   cd developers-blog
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/original-owner/developers-blog.git
   ```

## 💻 Development Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with the following content:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Set up the database**:
   Follow the instructions in [DATABASE_SETUP.md](DATABASE_SETUP.md) to configure your Supabase database.

4. **Start the development server**:

   ```bash
   npm run dev
   ```

5. **Verify setup**:
   Open [http://localhost:3000](http://localhost:3000) and ensure the application loads correctly.

## 📁 Project Structure

Understanding the project structure will help you navigate and contribute effectively:

```
src/
├── app/                     # Next.js App Router pages
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── blog/               # Blog-specific components
│   ├── dashboard/          # Dashboard components
│   ├── layout/             # Layout components
│   ├── skeleton/           # Loading states
│   └── ui/                 # Reusable UI components
├── lib/                    # Utility libraries and types
└── utils/                  # Utility functions
```

### Key Guidelines

- **Pages**: Use the App Router in `src/app/`
- **Components**: Organize by feature/domain
- **Utilities**: Keep reusable functions in `src/lib/`
- **Types**: Define TypeScript types in `src/lib/types.ts`
- **Styles**: Use Tailwind CSS classes

## 🎨 Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper types for all props and state
- Avoid `any` type; use `unknown` when necessary
- Use type guards for runtime type checking

### React Components

- Use functional components with hooks
- Follow the naming convention: PascalCase for components
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Use Server Components by default, Client Components only when necessary

### Code Style

- Use tabs for indentation
- Use single quotes for strings
- No semicolons (unless required)
- Line length limit: 80 characters
- Use trailing commas in multiline arrays/objects

### Naming Conventions

- **Files**: kebab-case (e.g., `user-profile.tsx`)
- **Directories**: kebab-case (e.g., `auth-forms/`)
- **Components**: PascalCase (e.g., `UserProfile`)
- **Functions/Variables**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_CASE (e.g., `API_ENDPOINTS`)

### Example Component

```typescript
interface UserProfileProps {
  userId: string;
  showEditButton?: boolean;
}

export function UserProfile({
  userId,
  showEditButton = false,
}: UserProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(userId);
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return <div className="profile-container">{/* Component content */}</div>;
}
```

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Examples

```bash
feat(auth): add password reset functionality
fix(posts): resolve infinite scroll loading issue
docs: update API documentation
style(navigation): improve mobile menu styling
refactor(dashboard): extract analytics hooks
```

## 🔄 Pull Request Process

### Before Submitting

1. **Sync with upstream**:

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** following the coding standards

4. **Test your changes**:

   ```bash
   npm run lint
   npm run build
   ```

5. **Commit your changes** using conventional commit format

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Pull Request Checklist

- [ ] Code follows the project's coding standards
- [ ] Self-review of the code has been performed
- [ ] Code is properly commented, particularly in hard-to-understand areas
- [ ] Corresponding changes to documentation have been made
- [ ] Changes generate no new warnings
- [ ] Any dependent changes have been merged and published

### Pull Request Template

When creating a pull request, please include:

```markdown
## Description

Brief description of the changes made.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

Describe the tests that you ran to verify your changes.

## Screenshots (if applicable)

Add screenshots to help explain your changes.

## Additional Notes

Any additional information or context about the changes.
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Guidelines

- Write unit tests for utility functions
- Write integration tests for components
- Test error scenarios and edge cases
- Use React Testing Library for component testing
- Mock external dependencies appropriately

### Example Test

```typescript
import { render, screen } from '@testing-library/react';
import { UserProfile } from './user-profile';

describe('UserProfile', () => {
  it('should display user name when profile is loaded', () => {
    const mockProfile = {
      id: '1',
      display_name: 'John Doe',
      bio: 'Developer',
    };

    render(<UserProfile userId="1" />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## 📚 Documentation

### Code Documentation

- Use JSDoc comments for functions and components
- Document complex algorithms and business logic
- Include examples in documentation when helpful

### API Documentation

- Update API documentation for new endpoints
- Include request/response examples
- Document error responses

### README Updates

- Update feature lists when adding new functionality
- Update setup instructions if dependencies change
- Keep the changelog updated

## 🐛 Reporting Issues

### Before Reporting

1. Search existing issues to avoid duplicates
2. Try to reproduce the issue in a clean environment
3. Gather relevant information (browser, OS, Node.js version)

### Issue Template

```markdown
## Bug Description

A clear and concise description of the bug.

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Environment

- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Node.js version: [e.g., 18.0.0]
- Project version: [e.g., 1.0.0]

## Additional Context

Any other context about the problem.
```

## 🏷 Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists or is planned
2. Describe the use case and problem it solves
3. Provide mockups or examples if helpful
4. Be open to discussion about implementation

## 📞 Getting Help

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Report bugs and request features
- **Documentation**: Check the project documentation first
- **Community**: Join our community channels (if available)

## 🎉 Recognition

Contributors will be recognized in:

- The CONTRIBUTORS.md file
- Release notes for significant contributions
- Social media mentions for major features

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Developers Blog platform! 🚀
