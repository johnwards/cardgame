# Design Document Template

## Instructions for LLM Agents

When creating a design document from requirements:

1. **Follow this exact structure** - use the same heading levels and sections
2. **Reference the requirements document** - address each requirement with specific technical solutions
3. **Include concrete implementation details** - use the project's established technology stack and patterns
4. **Design for the project context** - follow existing architectural patterns and coding standards
5. **Plan implementation phases** - break work into logical, achievable phases

---

# [Feature Name] Design Document

## Overview

[Provide a comprehensive overview of the feature being designed. Explain how it fits into the existing system architecture and what user problems it solves. Reference the requirements document and explain how this design addresses each requirement. Keep this section high-level but informative - 3-4 paragraphs that set the context for the entire design.]

[Include key design principles or constraints that guided the technical decisions. Mention any existing system components that will be leveraged or extended.]

## Architecture

### System Components

```mermaid
[Create appropriate diagram showing component relationships and data flow]
```

### Data Flow

1. **[Initial Action]**: [User interaction or system trigger]
2. **[Processing]**: [System processing and business logic]
3. **[Data Layer]**: [Database operations and transformations]
4. **[Response]**: [Results returned to user]

## Components and Interfaces

### [Primary Component Name]

[Component description and responsibilities]

#### Key Features

**[Feature 1]**: [Implementation approach and user interaction]

**[Feature 2]**: [Technical details and integration points]

**[Feature 3]**: [Performance and error handling considerations]

#### Design Rationale

[Explain key design decisions and trade-offs]

### [Secondary Component Name]

[Component description and integration approach]

#### Component Interface

```
[Component interface definition using project's established patterns and type system]
interface [ComponentInterface] {
  [property]: [Type];
  [method]: ([params]) => [ReturnType];
}

[Constants or configuration data following project conventions]
const [CONSTANTS]: [Type][] = [
  // Configuration data
];
```

### [Additional Components as needed]

## Data Models

## Data Models

### [Primary Data Model]

```
[Primary data model definition using project's data modeling approach]
interface [PrimaryModel] {
  id: [IdType];
  // Core properties
  [property]: [Type];
  // Relationships
  [relationship]: [RelatedType];
}
```

### [API Interfaces]

```
[API interface definitions using project's API patterns]
interface [RequestModel] {
  [param]?: [Type];
}

interface [ResponseModel] {
  success: [BooleanType];
  data?: [DataType];
  error?: [ErrorType];
}
```

### [Secondary Data Model]

```
[Secondary data model definition using project's conventions]
interface [SecondaryModel] {
  [property1]: [Type];
  [property2]: [Type];
  // Define all properties with appropriate types
}
```

### [API Request/Response Models]

```
[API interface definition using project's API patterns]
interface [RequestModel] {
  [param1]?: [Type];
  [param2]?: [Type];
  // Query parameters or request body structure
}

interface [ResponseModel] {
  [successField]: [BooleanType];
  [dataField]: [DataType];
  [metaField]?: {
    [metaProperty]: [Type];
  };
  [errorField]?: [ErrorType];
}
```

[Define all data models that will be used in the implementation using the project's established data modeling conventions and type system. Include both database models and API interfaces. Follow the project's naming conventions and data structure patterns.]

## Error Handling

### Graceful Degradation

1. **[Error Scenario]**: [Fallback behavior]
2. **[Data Unavailable]**: [Default state handling]
3. **[Service Failures]**: [Retry logic and user feedback]

### Error States

- **[Validation Errors]**: [User-facing error handling]
- **[System Errors]**: [Logging and recovery mechanisms]
- **[Network Issues]**: [Offline/connection handling]

## Testing Strategy

### [Testing Category 1]
- [Testing approach based on project requirements and established testing framework]
- [Test scenarios relevant to the feature being implemented]
- [Validation criteria following project testing standards]

### [Testing Category 2]
- [Additional testing considerations based on project context]
- [Integration or system testing as appropriate to requirements]
- [Quality assurance measures per project guidelines]

## Performance Considerations

### [Optimization Category 1]
- [Performance optimization strategies using project's established patterns]
- [Caching approaches following project conventions]
- [Resource optimization techniques]

### [Optimization Category 2]
- [Loading and rendering strategies]
- [Client-side performance considerations]
- [System resource management]

## Security & Accessibility

### Security
- [Data protection measures following project security standards]
- [Input validation using project validation patterns]
- [Authorization requirements per project security guidelines]

### Accessibility
- [Screen reader support following project accessibility standards]
- [Keyboard navigation per project interaction guidelines]
- [Visual design standards following project design system]

## Implementation Phases

### Phase 1: [Foundation Phase Name]
- [Foundation deliverables based on requirements]
- [Core dependencies and prerequisites]
- [Success criteria for foundational work]

### Phase 2: [Core Implementation Phase Name]
- [Primary feature deliverables]
- [Integration requirements]
- [Success criteria for core functionality]

### Phase 3: [Integration/Enhancement Phase Name]
- [Integration deliverables]
- [Testing and validation]
- [Success criteria for complete feature]

*Note: Phase structure should be adapted based on project architecture and requirements. Some features may need fewer phases, others may need additional phases for complex integrations.*

## Success Metrics

### User Engagement
- [Measurable user interaction metrics]

### Technical Performance
- [Performance benchmarks]
- [Error rate targets]

### Business Impact
- [Conversion or satisfaction metrics]

[Break the implementation into logical, achievable phases that deliver value incrementally.]

## Success Metrics

### User Engagement

- [Specific engagement metrics to track]
- [Measurement methods and tools]
- [Success thresholds]

### Conversion Metrics

- [Business conversion metrics]
- [User satisfaction measurements]
- [Feature adoption rates]

### Technical Metrics

- [Performance benchmarks]
- [Error rate targets]
- [System reliability metrics]

[Define measurable success criteria that align with business and user goals.]

## Migration Strategy

[If applicable, include migration strategy for existing data or features]

### Data Migration

- [Migration approach for existing data]
- [Rollback strategies]
- [Data integrity validation]

### Feature Migration

- [Gradual rollout strategy]
- [A/B testing approach]
- [Fallback mechanisms]

[Include migration considerations when the feature affects existing functionality.]

## Monitoring and Observability

### Application Monitoring

- [Key metrics to monitor]
- [Alerting strategies]
- [Dashboard requirements]

### User Analytics

- [User behavior tracking]
- [Conversion funnel monitoring]
- [Performance impact measurement]

### Error Tracking

- [Error logging strategies]
- [Error categorization]
- [Escalation procedures]

[Plan for comprehensive monitoring from day one.]

---

## Template Usage Instructions

### For the Human User:
1. **Attach this template** to your conversation with the LLM
2. **Attach the completed requirements document** for the feature
3. **Ask the LLM** to "Produce a design document based on these requirements and this template"

### Example Prompt:
```
Produce a design document based on these requirements and this template.
```

### For the LLM Agent:
1. **Read the requirements document thoroughly** - understand all user stories and acceptance criteria
2. **Study the copilot instructions completely** - understand the project's technology stack, patterns, and conventions
3. **Follow the template structure exactly** - don't skip sections or change the organization
4. **Connect every design decision to user requirements** - explain how technical choices serve user needs
5. **Use ONLY the project's established technologies and patterns** from the copilot instructions
6. **Include concrete, implementable interfaces** using the project's specific type system and conventions
7. **Follow ALL project coding standards** including naming conventions, architectural patterns, and style guides
8. **Consider the full system lifecycle** - from development to production monitoring
9. **Balance technical depth with accessibility** - technical enough for implementation, clear enough for all stakeholders
10. **Validate every technical choice** against the established copilot instructions and project standards

## Common Pitfalls to Avoid

- **Don't create overly abstract designs** - include concrete interfaces and component structures using the project's specific technologies
- **Don't ignore error handling** - plan for failure scenarios using the project's established error handling patterns
- **Don't skip performance considerations** - address scalability and optimization using project-appropriate strategies
- **Don't forget accessibility** - follow the project's accessibility standards and implementation approaches
- **Don't violate established architectural patterns** - maintain consistency with existing project structure
- **Don't ignore testing strategy** - plan for testing using the project's specific testing framework and approaches
- **Don't overlook migration needs** - consider impact on existing data and features using project migration patterns
- **Don't forget monitoring** - plan for observability using the project's established monitoring and logging approaches
- **Don't deviate from project tech stack** - use only the technologies, frameworks, and libraries established in copilot instructions

## Integration with Project Standards

This template is designed to work seamlessly with any project's copilot instructions. When using this template:

1. **Reference the project's complete technology stack** from copilot instructions
2. **Follow ALL established architectural patterns** outlined in the project's guidelines
3. **Use the project's specific design system, frameworks, and libraries** as specified in copilot instructions
4. **Apply the project's security, testing, and performance practices** exactly as established
5. **Maintain consistency** with existing API patterns, data structures, and coding conventions
6. **Respect project-specific constraints** such as deployment targets, browser support, or regulatory requirements

The combination of **project copilot instructions + this design template + requirements document** should enable AI agents to produce comprehensive, implementable technical designs that perfectly align with project standards with minimal feedback loops.

**Critical**: The AI agent must thoroughly study and apply the copilot instructions before generating any design decisions. Every technical choice must be validated against the established project standards.