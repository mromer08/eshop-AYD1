export interface Category {
    _id:    string;
    name:   string;
}

export interface Product {
    _id:            string;
    name:           string;
    price:          number;
    stock:          number;
    image_url:      string;
    categories:     Category[];
    description:    string;
    availability:   boolean;
}