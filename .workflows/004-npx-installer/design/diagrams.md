# Diagrams: npx installer

## Component Diagram

```mermaid
flowchart LR
    User[Contributor] --> NPX[npx / npm exec]
    NPX --> CLI[CLI entrypoint]
    CLI --> Engine[Install engine]
    CLI --> Output[Human or JSON output]
    Manifest[Distribution manifest] --> Engine
    Payload[plugin/skills payload] --> Engine
    Engine --> Target[Selected skills root]
    Engine --> Receipt[Installation receipt]
    PS[install.ps1] --> Manifest
    PS --> Source[.agents/skills source]
    SH[install.sh] --> Source
    Audits[Conformance audits] --> Manifest
    Audits --> Payload
    Audits --> PS
    Audits --> SH
```

## Install Data Flow

```mermaid
flowchart LR
    Args[CLI arguments] --> Resolve[Resolve preset or target]
    Resolve --> Validate[Validate root and manifest names]
    Validate --> Plan[Build immutable action plan]
    Plan --> Report[Display plan]
    Report --> Confirm{Destructive actions?}
    Confirm -->|no| Apply[Apply exact copy/skip actions]
    Confirm -->|yes and approved| Apply
    Confirm -->|yes and declined| Stop[Exit without mutation]
    Apply --> Verify[Verify installed SKILL.md files]
    Verify --> Receipt[Write receipt]
```

## Main Sequence

```mermaid
sequenceDiagram
    actor User
    participant Npx as npm exec
    participant CLI as praxis-skills CLI
    participant Engine as install engine
    participant FS as filesystem

    User->>Npx: npx praxis-skills install --user
    Npx->>CLI: execute cached package binary
    CLI->>Engine: resolve target and build plan
    Engine->>FS: inspect exact destinations
    FS-->>Engine: existing/missing state
    Engine-->>CLI: copy/skip plan
    CLI-->>User: display plan
    CLI->>Engine: apply approved plan
    Engine->>FS: copy payload and write receipt
    FS-->>Engine: completed
    Engine-->>CLI: structured result
    CLI-->>User: installed; invoke $praxis-init
```

## Destructive Operation Sequence

```mermaid
sequenceDiagram
    actor User
    participant CLI
    participant Engine
    participant FS as filesystem

    User->>CLI: uninstall --user
    CLI->>Engine: build exact removal plan
    Engine->>FS: inspect manifest-owned paths
    FS-->>Engine: present paths
    Engine-->>CLI: removal plan
    CLI-->>User: confirmation request
    alt approved or --yes
        CLI->>Engine: apply plan
        Engine->>FS: remove exact owned paths
        Engine-->>CLI: result
    else declined
        CLI-->>User: cancelled without changes
    end
```
