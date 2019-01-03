interface IDoubanSubjects {
  id: string;
  title: string;
  original_title: string;
  alt: string;
  images: any;
  rating: IDoubanRating;
  year: string;
  subtype: string;
}

interface IDoubanRating {
  min: number;
  max: number;
  stars: number;
  average: number;
}