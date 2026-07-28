# Praxis Clear Speech Policy

Praxis Clear Speech is an independent writing policy. It uses principles from ASD-STE100 Issue 9.

It does not reproduce the official standard or its dictionary. It does not imply approval or certification by ASD.

## Precedence

Apply instructions in this order:

1. The current user request.
2. Legal text, external contracts, and exact quoted content.
3. Repository instructions and confirmed project terminology.
4. The `clear_speech` mode in `.praxis/project.md`.
5. Praxis Clear Speech defaults.

An explicit style request can replace this policy. Examples include marketing, creative, literary, legal, academic, or brand-specific styles.

## Level 1: Core

Apply Core to eligible text in every language:

- Put the result or primary point first.
- Keep one primary idea in each sentence.
- Use short sentences and short paragraphs.
- Prefer the active voice when the agent is known.
- Give information gradually.
- Put a condition before the related action.
- Use a vertical list for complex information.
- Use one term for one concept.
- Prefer concrete and familiar words.
- Remove slang, filler, and unclear jargon.
- Do not omit words when the omission can cause ambiguity.
- Replace an unclear pronoun with its noun.
- Keep warnings, limits, and required actions outside optional notes.
- State the action, risk, and possible result in safety text.

Core controls clarity. It does not control the vocabulary of a language other than English.

## Level 2: English Technical Profile

Apply this level to eligible English technical text in `default` mode. Apply it to all eligible English prose in `strict` mode.

- Use the 53 writing rules in ASD-STE100 Issue 9.
- Use approved words only with their approved meaning and part of speech.
- Use authorized project terms as technical nouns and technical verbs.
- Keep the same term for the same item or concept.
- Use American English spelling unless a higher-priority directive requires a different spelling.
- Use no more than 20 words in a procedural sentence.
- Use no more than 25 words in a descriptive sentence.
- Keep one instruction in each procedural sentence.
- Use the imperative form for instructions.
- Use only simple approved verb forms.
- Do not use complex verb constructions when a simple construction is sufficient.
- Do not use a semicolon.
- Do not use contractions.
- Do not create unapproved phrasal verbs.
- Keep a multi-word noun to three words when an authorized technical term does not require more words.
- Keep one topic in each paragraph.
- Keep no more than six sentences in each paragraph.

Use the official standard and an authorized dictionary source for a complete lexical review. Use a project glossary for subject-field terms.

Do not describe an automated result as certified or officially compliant. Use these result labels:

- `pass`: No checked violation was found.
- `exception`: Protected content or an approved project rule requires different wording.
- `violation`: The text breaks a deterministic rule.
- `review`: Meaning, voice, terminology, or grammar needs human review.
- `not-checked`: The required lexical source or context was not available.

## Level 3: Surface Rules

### LLM Replies

- Give the answer before background information.
- Make actions and decisions explicit.
- Separate facts, assumptions, risks, and open questions.
- Keep the language requested by the user.
- Do not force English vocabulary rules on another language.

### Code

Apply Core to:

- Comments and docstrings.
- Error and validation messages.
- Log messages.
- Command help and developer documentation.
- User-visible strings.

Do not rewrite:

- Identifiers and language syntax.
- API names, fields, routes, and protocol values.
- Third-party names and generated code.
- Test fixtures that reproduce exact external text.

### User Interfaces

- Use one stable term for each action and concept.
- Make labels and buttons describe the action.
- Put the recovery action in an error message.
- Keep help text close to the related control.
- Preserve accessibility meaning and localization constraints.
- Use the project voice when the user requests a marketing, creative, or brand style.

### Documentation

- Separate procedures from descriptions.
- Use numbered steps for ordered actions.
- Use notes only for supporting information.
- Put limits and required results next to the related action.
- Define abbreviations before repeated use.

## Project Modes

| Mode | Automatic behavior |
|------|--------------------|
| `default` | Apply Core everywhere. Apply the English Technical Profile to English technical text. |
| `strict` | Apply Core everywhere. Apply the English Technical Profile to all eligible English prose. |
| `off` | Do not load or apply Praxis Clear Speech or its audits automatically. |

The current user can override the project mode for the active task.
