export interface Order {
  _id?: string;
  name: string;
  email: string;
  status:{
    type: string;
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"];
    default: "pending";
  }

  products: {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  
  }[];
  isOrder: boolean;
  createdAt?: Date;
}