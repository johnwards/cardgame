# Requirements Document Template

## Instructions for LLM Agents

When generating a requirements document using this template, follow these guidelines:

### Document Structure Requirements
1. **Use exactly this markdown structure** with the same heading levels and sections
2. **Write from the user's perspective** - focus on what users want to accomplish, not technical implementation
3. **Keep requirements focused and specific** - each requirement should address one clear user need
4. **Use consistent formatting** for user stories and acceptance criteria
5. **Avoid technical jargon** in user stories - write in plain language that any stakeholder can understand

### User Story Guidelines
- **Format**: "As a [user type], I want to [action/goal], so that I can [benefit/reason]"
- **Focus on user value** - always explain the "why" behind what users want
- **Be specific about the user type** (e.g., "renter", "garage owner", "admin")
- **Describe the desired outcome** clearly without prescribing the technical solution

### Acceptance Criteria Guidelines
- **Use WHEN/THEN/SHALL format** for consistency and clarity
- **Be specific and testable** - each criterion should be verifiable
- **Cover both positive and edge cases** (normal flow and exceptions)
- **Include conditional logic** with IF/WHEN statements where appropriate
- **Focus on observable behavior** rather than internal system workings
- **Number each criterion** for easy reference during development

### Content Guidelines
- **Introduction section** should provide context and explain how this feature fits into the larger system
- **Each requirement** should be substantial enough to drive meaningful development work
- **Acceptance criteria** should be comprehensive but not overwhelming (aim for 4-6 criteria per requirement)
- **Use consistent terminology** throughout the document
- **Avoid implementation details** - focus on what the system should do, not how

### Quality Checklist
Before finalizing, ensure:
- [ ] All user stories follow the standard format
- [ ] Each acceptance criterion is testable and specific
- [ ] Requirements are written from user perspective, not technical perspective
- [ ] The document flows logically from simple to complex functionality
- [ ] Edge cases and error conditions are covered
- [ ] Terminology is consistent throughout
- [ ] Each requirement addresses a distinct user need

---

# Requirements Document

## Introduction

[Provide context for this feature/functionality. Explain how it fits into the larger system and what user problems it solves. Reference any dependencies on other features or systems. Keep this concise but informative - 2-3 paragraphs maximum.]

## Requirements

### Requirement 1

**User Story:** As a [user type], I want to [specific action/goal], so that I can [clear benefit/reason].

#### Acceptance Criteria

1. WHEN [specific condition/trigger] THEN the system SHALL [specific behavior/outcome]
2. WHEN [different condition] THEN the system SHALL [different behavior]
3. IF [conditional scenario] THEN the system SHALL [conditional behavior]
4. WHEN [edge case condition] THEN the system SHALL [edge case handling]
5. WHEN [another relevant scenario] THEN the system SHALL [expected behavior]
6. [Add more criteria as needed - aim for comprehensive coverage without being overwhelming]

### Requirement 2

**User Story:** As a [user type], I want to [specific action/goal], so that I can [clear benefit/reason].

#### Acceptance Criteria

1. WHEN [specific condition/trigger] THEN the system SHALL [specific behavior/outcome]
2. WHEN [different condition] THEN the system SHALL [different behavior]
3. IF [conditional scenario] THEN the system SHALL [conditional behavior]
4. WHEN [error condition] THEN the system SHALL [error handling behavior]
5. WHEN [validation scenario] THEN the system SHALL [validation behavior]
6. [Continue with additional relevant criteria]

### Requirement 3

**User Story:** As a [user type], I want to [specific action/goal], so that I can [clear benefit/reason].

#### Acceptance Criteria

1. WHEN [specific condition/trigger] THEN the system SHALL [specific behavior/outcome]
2. WHEN [user performs action] THEN the system SHALL [system response]
3. IF [special condition] THEN the system SHALL [special handling]
4. WHEN [integration scenario] THEN the system SHALL [integration behavior]
5. WHEN [performance scenario] THEN the system SHALL [performance requirement]

[Add more requirements as needed. Typically 3-5 requirements per document works well for focused feature development.]

## Template Usage Instructions

### For the Human User:
1. **Attach this template** to your conversation with the LLM
2. **Provide context** about your project, the feature you want specified, and any relevant background
3. **Describe the user scenarios** you want addressed
4. **Mention any constraints** or dependencies that should be considered
5. **Ask the LLM** to "Review this template and use it to produce a requirements document for [your feature]"

### Example Prompt:
```
Review this requirements template and use it to produce a requirements document for [feature name]. 

Context: [Brief description of your project and where this feature fits]

User Scenarios: [Describe the main user workflows or problems this feature should address]

Constraints: [Any technical or business constraints to consider]

Please follow the template structure exactly and ensure all user stories and acceptance criteria follow the specified formats.
```

### For the LLM Agent:
1. **Read the entire template** including all instructions and guidelines
2. **Follow the structure exactly** - don't deviate from the heading levels or section organization
3. **Apply the formatting rules consistently** throughout the document
4. **Focus on user value** in every requirement and acceptance criterion
5. **Ensure each requirement is distinct** and addresses a different aspect of the functionality
6. **Review your output** against the quality checklist before finalizing

## Common Pitfalls to Avoid

- **Don't write technical specifications** - focus on user-facing behavior
- **Don't prescribe implementation** - describe what the system should do, not how
- **Don't make acceptance criteria too vague** - each should be specific and testable
- **Don't overlap requirements** - keep each requirement focused on a distinct user need
- **Don't forget edge cases** - consider error conditions and unusual scenarios
- **Don't use inconsistent terminology** - establish terms early and stick to them