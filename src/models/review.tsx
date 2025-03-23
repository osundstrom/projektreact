export interface Review { //interface en recension
    
    _id: string;
    bookId: string;
    userId: string;
    title: string;
    username: string;
    content: string;
    grade: number;
    post_created: string;
  }