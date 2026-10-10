import mongoose, { Document, Schema } from 'mongoose';

export interface IReview {
  userName: string;
  rating: number;
  comment: string;
  city: string;
  date: string;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  mrp: number;
  discountPercent: number;
  rating: number;
  numReviews: number;
  images: string[];
  inStock: boolean;
  stockCount: number;
  brand: string;
  origin: string;
  tags: string[];
  highlights: string[];
  specifications: Map<string, string>;
  reviews: IReview[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  city: { type: String, default: 'India' },
  date: { type: String, default: () => new Date().toLocaleDateString('en-GB') }
});

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, required: true, min: 0 },
  discountPercent: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  images: { type: [String], required: true },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 25 },
  brand: { type: String, default: 'DesiKart Artisans' },
  origin: { type: String, default: 'India' },
  tags: [String],
  highlights: [String],
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  reviews: [ReviewSchema],
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

ProductSchema.pre('save', function () {
  if (this.mrp && this.price && this.mrp > this.price) {
    this.discountPercent = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  }
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
