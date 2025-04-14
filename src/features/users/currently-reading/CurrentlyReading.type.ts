export interface ICurrentlyReading {
  manga_id: string;
  user_id: string;
  current_chapter: string;
  finished_chapters: string[];
  createdAt: Date;
}
