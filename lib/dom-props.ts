/** Prevent Grammarly and similar extensions from mutating inputs (causes hydration errors). */
export const blockGrammarlyProps = {
  "data-gramm": "false",
  "data-gramm_editor": "false",
  "data-enable-grammarly": "false",
} as const;
