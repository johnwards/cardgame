# Tasks Document Template

## Instructions for LLM Agents

When generating a tasks document using this template, follow these guidelines:

### Document Structure Requirements
1. **Use exactly this markdown structure** with numbered phases and sub-tasks
2. **Break work into logical phases** that build incrementally toward the complete feature
3. **Create right-sized tasks** - substantial enough for meaningful progress, small enough to complete within context limits
4. **Ensure each task produces working code** without placeholders or TODO comments
5. **Reference requirements explicitly** - link each task to specific numbered acceptance criteria from requirements document
6. **Follow dependency order** - later tasks should build on earlier completed work

### Task Sizing Guidelines

#### ✅ Good Task Examples
- **API Enhancement**: "Modify listings API to include booking configuration data, add availability calculation logic, and update response format with tests"
- **Component Implementation**: "Create TimePeriodFilter component with predefined options, state management, and unit tests"
- **Integration Task**: "Integrate TimePeriodFilter with browse page, update URL state management, and coordinate with existing search"

#### ❌ Bad Task Examples
- **Too Small**: "Add import statement for new component" (trivial for AI agent)
- **Too Large**: "Implement entire search and browse system with all filters, components, and API changes" (exceeds context)
- **Vague**: "Improve the user interface" (lacks specific deliverables)
- **Placeholder-Heavy**: "Create component skeleton with TODO comments for later implementation" (non-functional)

### Technical Implementation Guidelines

#### Project Structure Considerations
- **Follow established workspace patterns**: Use the project's defined package management and build commands
- **Respect architectural layers**: Backend/API changes typically precede frontend/client consumption
- **Consider data layer dependencies**: Database schema changes before application logic that uses them
- **Coordinate shared interfaces**: Type definitions and contracts between system components

#### Technology Stack Alignment
- **Follow the design document**: Use the technologies and patterns specified in the design document
- **Adhere to project standards**: Follow coding conventions, testing frameworks, and architectural patterns from project documentation
- **Use established tooling**: Leverage the build system, package management, and development tools already configured
- **Maintain consistency**: Follow existing patterns for similar functionality in the codebase

### Quality Standards

#### Each Task Must Include
- **Specific deliverables** with clear completion criteria
- **Testing requirements** appropriate to the task scope
- **Requirements traceability** linking to specific numbered acceptance criteria from the requirements document
- **Working code standards** - no placeholders or incomplete implementations
- **Error handling** for the scope being implemented
- **Type safety** using project's type system and interface definitions

#### Avoid These Anti-Patterns
- **Refactoring existing working code** unless specifically required for new functionality
- **Breaking changes** to existing APIs without migration strategy
- **Incomplete implementations** that require follow-up tasks to function
- **Copy-paste patterns** - each task should be distinct and purposeful
- **Technical debt introduction** - maintain code quality standards throughout

### Phase Organization Guidelines

#### Logical Phase Progression
1. **Foundation Phase**: Data models, schemas, core interfaces, foundational utilities
2. **Core Logic Phase**: Business logic, algorithms, data processing, core functionality
3. **Integration Phase**: Service connections, API implementations, system integrations
4. **Interface Phase**: User interfaces, external APIs, or other system boundaries
5. **Optimization Phase**: Performance tuning, error handling, edge cases, monitoring

*Note: The specific phases should be adapted based on the system architecture defined in the design document. Not all projects will need all phases, and some may require different phase structures.*

#### Dependency Management
- **Data First**: Schema and model changes before logic that uses them
- **Core Before Interface**: Business logic before external interfaces that expose it
- **Contracts Early**: Shared interfaces and protocols before implementations that use them
- **Testing Concurrent**: Unit tests alongside implementation, integration tests after component integration

*Note: Follow the dependency patterns established in the design document and project architecture.*

### Success Criteria

#### Each Completed Task Should
- **Compile and run** without errors
- **Pass all tests** written as part of the task
- **Meet acceptance criteria** from the requirements document
- **Follow project coding standards** from copilot instructions
- **Include proper error handling** for the implemented scope
- **Work with existing code** without breaking changes

#### Phase Completion Should
- **Enable next phase** to proceed without waiting for other work
- **Provide demonstrable value** - working functionality that can be tested
- **Maintain system stability** - no broken states between phases
- **Include proper documentation** in code comments and interfaces

---

# [Feature Name] Implementation Plan

## Instructions for Implementation

This implementation plan breaks down the [feature name] feature into logical phases and specific tasks. Each task is designed to be completed by an AI agent within a single session while producing working, tested code.

**Prerequisites**: Review the requirements and design documents for this feature before beginning implementation.

**Project Context**: 
- **Technology Stack**: [Reference design document for specific technologies and frameworks]
- **Architecture Patterns**: [Reference project standards and existing architectural decisions]
- **Development Workflow**: [Follow established development and testing procedures]
- **Quality Standards**: [Adhere to project coding standards and quality requirements]

## Phase 1: [Phase Name Based on Design Document]

### 1.1 [Task Name Based on Requirements]
- [ ] **Deliverable**: [Specific deliverable determined from requirements and design]
- **Implementation Details**:
  - [Implementation approach following project patterns]
  - [Integration strategy with existing systems]
  - [Data handling or business logic as appropriate]
  - [Error handling per project standards]
- **Testing**: [Testing approach using project testing framework]
- **Requirements**: [Specific requirement numbers from requirements document]

### 1.2 [Task Name Based on Requirements]
- [ ] **Deliverable**: [Specific deliverable determined from requirements and design]
- **Implementation Details**:
  - [Implementation approach following project patterns]
  - [Integration strategy with existing systems]
  - [Data handling or business logic as appropriate]
  - [Error handling per project standards]
- **Testing**: [Testing approach using project testing framework]
- **Requirements**: [Specific requirement numbers from requirements document]

### 1.3 [Task Name Based on Requirements]
- [ ] **Deliverable**: [Specific deliverable determined from requirements and design]
- **Implementation Details**:
  - [Implementation approach following project patterns]
  - [Integration strategy with existing systems]
  - [Data handling or business logic as appropriate]
  - [Error handling per project standards]
- **Testing**: [Testing approach using project testing framework]
- **Requirements**: [Specific requirement numbers from requirements document]

## Phase 2: [Phase Name Based on Design Document]

### 2.1 [Task Name Based on Requirements]
- [ ] **Deliverable**: [Specific deliverable determined from requirements and design]
- **Implementation Details**:
  - [Implementation approach following project patterns]
  - [Integration strategy with existing systems]
  - [Business logic or system integration as appropriate]
  - [Performance considerations per project standards]
- **Testing**: [Testing approach using project testing framework]
- **Requirements**: [Specific requirement numbers from requirements document]

### 2.2 [Task Name Based on Requirements]
- [ ] **Deliverable**: [Specific deliverable determined from requirements and design]
- **Implementation Details**:
  - [Implementation approach following project patterns]
  - [Integration strategy with existing systems]
  - [Business logic or system integration as appropriate]
  - [Performance considerations per project standards]
- **Testing**: [Testing approach using project testing framework]
- **Requirements**: [Specific requirement numbers from requirements document]

## Phase 3: [Phase Name Based on Design Document]

### 3.1 [Task Name Based on Requirements]
- [ ] **Deliverable**: [Specific deliverable determined from requirements and design]
- **Implementation Details**:
  - [Implementation approach following project patterns]
  - [Integration strategy with existing systems]
  - [Interface or presentation logic as appropriate]
  - [User experience considerations per project standards]
- **Testing**: [Testing approach using project testing framework]
- **Requirements**: [Specific requirement numbers from requirements document]

### 3.2 [Task Name Based on Requirements]
- [ ] **Deliverable**: [Specific deliverable determined from requirements and design]
- **Implementation Details**:
  - [Implementation approach following project patterns]
  - [Integration strategy with existing systems]
  - [Interface or presentation logic as appropriate]
  - [User experience considerations per project standards]
- **Testing**: [Testing approach using project testing framework]
- **Requirements**: [Specific requirement numbers from requirements document]

### 3.3 [Task Name Based on Requirements]
- [ ] **Deliverable**: [Specific deliverable determined from requirements and design]
- **Implementation Details**:
  - [Implementation approach following project patterns]
  - [Integration strategy with existing systems]
  - [Interface or presentation logic as appropriate]
  - [User experience considerations per project standards]
- **Testing**: [Testing approach using project testing framework]
- **Requirements**: [Specific requirement numbers from requirements document]

## Additional Phases as Needed

*Note: Add additional phases based on the complexity and architecture defined in the design document. Not all features will require the same number of phases.*

## Implementation Notes

### Development Workflow
1. **Setup**: Ensure development environment is running using project's established development commands
2. **Foundation**: Apply any foundational changes (schemas, core models) using project's management tools
3. **Dependencies First**: Implement lower-level components before higher-level components that depend on them
4. **Integration**: Connect components and test interactions between system parts
5. **Testing**: Run appropriate test suites between phases using project's testing commands
6. **Verification**: Test complete workflows manually before moving to next phase

### Common Commands
```bash
# Replace these with actual project commands from build scripts, package.json, or documentation
[project-specific-dev-command]          # Start development environment
[project-specific-test-command]         # Run test suite
[project-specific-build-command]        # Build project
[project-specific-data-migration]       # Apply data changes
[project-specific-dependency-install]   # Install dependencies
```

*Note: Consult project documentation, build scripts, or established development procedures for actual commands.*

### Quality Checklist

Before marking any task complete, ensure:
- [ ] Code compiles without errors or warnings using project build tools
- [ ] All new tests pass using project testing framework
- [ ] Existing tests continue to pass
- [ ] Code follows project conventions from established coding standards
- [ ] Type definitions are properly implemented using project's type system
- [ ] Error handling is implemented following project error handling patterns
- [ ] No placeholder code or TODO comments remain
- [ ] Changes integrate smoothly with existing codebase
- [ ] Performance impact has been considered per project performance guidelines
- [ ] Accessibility standards are met following project accessibility requirements

---

## Template Usage Instructions

### For the LLM Agent:
1. **Study the requirements and design documents** thoroughly before creating tasks
2. **Follow the template structure exactly** - don't deviate from the established patterns
3. **Size tasks appropriately** - substantial work but achievable in one session
4. **Ensure logical dependencies** - each task should build on previous completed work
5. **Include comprehensive testing** at each stage
6. **Reference requirements explicitly** to ensure traceability
7. **Plan for working code** at each step - no placeholder implementations

### Quality Validation

Before finalizing the task document:
- [ ] Each task has clear, measurable deliverables
- [ ] Tasks build logically toward the complete feature
- [ ] Testing requirements are specified for each task
- [ ] Requirements traceability is maintained throughout
- [ ] Technology stack alignment is correct
- [ ] Monorepo workspace patterns are followed
- [ ] No task requires refactoring working code unnecessarily
- [ ] Each task will produce working, tested functionality