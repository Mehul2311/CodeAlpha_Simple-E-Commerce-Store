import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query: any = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const term = search.trim();
      const regex = new RegExp(term, 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { brand: regex },
        { tags: regex },
        { origin: regex }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1, numReviews: -1 };
    } else if (sort === 'discount') {
      sortOption = { discountPercent: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total, categoriesAggregate, priceStats] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(query),
      Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Product.aggregate([
        {
          $group: {
            _id: null,
            min: { $min: '$price' },
            max: { $max: '$price' }
          }
        }
      ])
    ]);

    const categories = categoriesAggregate.map(c => ({ name: c._id, count: c.count }));
    const minPossiblePrice = priceStats[0]?.min || 0;
    const maxPossiblePrice = priceStats[0]?.max || 50000;

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasMore: skip + products.length < total
      },
      categories,
      priceBounds: {
        min: minPossiblePrice,
        max: maxPossiblePrice
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching products' });
  }
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    let product;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // Fetch up to 4 related products in the same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.json({
      success: true,
      product,
      related
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching product' });
  }
}

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          image: { $first: { $arrayElemAt: ['$images', 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      categories: categories.map(c => ({
        name: c._id,
        count: c.count,
        image: c.image
      }))
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching categories' });
  }
}

export async function getFeaturedProducts(req: Request, res: Response): Promise<void> {
  try {
    const featured = await Product.find({ featured: true }).limit(8);
    const topRated = await Product.find({ rating: { $gte: 4.6 } }).sort({ rating: -1, numReviews: -1 }).limit(8);
    const bestDiscounts = await Product.find({ discountPercent: { $gte: 35 } }).sort({ discountPercent: -1 }).limit(8);

    res.json({
      success: true,
      featured,
      topRated,
      bestDiscounts
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching featured products' });
  }
}

export async function addReview(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { rating, comment, userName, city } = req.body;

    if (!rating || !comment) {
      res.status(400).json({ success: false, message: 'Rating and comment are required.' });
      return;
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    const reviewerName = req.user?.name || userName?.trim() || 'Desi Shopper';
    const reviewerCity = city?.trim() || 'India';

    product.reviews.unshift({
      userName: reviewerName,
      rating: Number(rating),
      comment: comment.trim(),
      city: reviewerCity,
      date: new Date().toLocaleDateString('en-GB')
    });

    product.numReviews = product.reviews.length;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = Number((sum / product.reviews.length).toFixed(1));

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review posted successfully! Dhanyavaad 🙏',
      product
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error posting review' });
  }
}
