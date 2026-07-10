# Diagrams: Mandatory Praxis project context

## Component Diagram

The project profile sits between project evidence/user intent and every project-scoped Praxis workflow.

```mermaid
flowchart LR
    U["User"] --> I["praxis-init"]
    R["Repository evidence"] --> I
    I --> P[".praxis/project.md"]
    I --> B["Managed AGENTS.md bootstrap"]
    B --> P
    P --> G["Project Context Gate"]
    G --> F["Feature Flow"]
    G --> D["Design and Plan"]
    G --> M["Implement and PR"]
    G --> X["Docs and System Workflows"]
    A["Package audit"] --> I
    A --> G
```

## Data Flow

```mermaid
flowchart LR
    Q["Project request"] --> C{"Profile exists?"}
    C -->|"no"| T{"New or existing?"}
    T -->|"new"| N["Focused interview"]
    T -->|"existing"| E["Evidence audit"]
    N --> W["Write needs-confirmation profile"]
    E --> W
    W --> H["User confirmation"]
    H -->|"correct"| P["Mark confirmed"]
    H -->|"changes"| W
    C -->|"confirmed"| P
    P --> F["Continue Praxis workflow"]
```

## Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Workflow as Praxis workflow
    participant Init as praxis-init
    participant Repo as Repository evidence
    participant Profile as .praxis/project.md
    participant Bootstrap as AGENTS.md bootstrap

    User->>Workflow: Request project work
    Workflow->>Profile: Check existence and status
    Profile-->>Workflow: Missing or needs-confirmation
    Workflow->>Init: Invoke Project Context Gate
    Init->>Repo: Audit evidence or detect new project
    Repo-->>Init: Context and constraints
    Init->>Profile: Write needs-confirmation draft
    Init->>Bootstrap: Insert mandatory profile pointer
    Init-->>User: Present inferred direction and ask confirmation
    User->>Init: Confirm or correct
    Init->>Profile: Mark confirmed
    Init-->>Workflow: Gate passed
    Workflow-->>User: Resume requested work
```

## Error Flow

```mermaid
flowchart LR
    A["Profile draft"] --> B{"Contradicts AGENTS or user intent?"}
    B -->|"yes"| C["Pause and surface conflict"]
    C --> D["User resolves direction"]
    D --> E["Update draft"]
    E --> F["Confirm profile"]
    B -->|"no"| F
```
