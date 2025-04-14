export interface IUserManga {
  manga_id: string;
  image: string;
  referer: string;
  title: string;
  views: number;
  todayViews: {
    date: Date;
    count: number;
  };
  createdAt: Date;
}
