export interface Product {
  _id:          string;
  name:         string;
  description:  string;
  image_url:    string;
  price:        number;
  categories:   Categories[];
  availability: boolean;
  created_at:   Date;
  stock:        number;
}

export interface Categories {
  _id:         string;
  name:        string;
}
