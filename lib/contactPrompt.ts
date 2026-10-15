// Automatic contact/newsletter prompts are disabled across all entry points.
// Keep this compatibility API for existing navigation/history callers.
export function claimContactPrompt(): { repeat: boolean } | null {
  return null
}

export function releaseContactPrompt(_dontShow = false) {}
