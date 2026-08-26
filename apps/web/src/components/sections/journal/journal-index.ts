export const JOURNAL_SLOT_INDEX_PAD = 2;

export function formatJournalSlotIndex(index: number): string {
  return String(index).padStart(JOURNAL_SLOT_INDEX_PAD, "0");
}
