const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    image: {
      type: String // Assuming the image will be stored as a file path or URL
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });
  

const Product = mongoose.model('Product', productSchema);

// Create 20 product instances
const products = [
  {
    productId: '123',
    name: 'Product 1',
    price: 10.99,
    description: 'Description for Product 1',
    category: 'Category 1'
  },
  {
    productId: '456',
    name: 'Product 2',
    price: 19.99,
    description: 'Description for Product 2',
    category: 'Category 1'
  },
  {
    productId: '457',
    name: 'Product 3',
    price: 19.99,
    description: 'Description for Product 2',
    category: 'Category 2'
  },
  {
    productId: '458',
    name: 'Product 4',
    price: 19.99,
    description: 'Description for Product 2',
    category: 'Category 2'
  },
  {
    productId: '459',
    name: 'Product 5',
    price: 19.99,
    description: 'Description for Product 2',
    category: 'Category 2'
  },
  {
    productId: '460',
    name: 'Product 6',
    price: 19.99,
    description: 'Description for Product 2',
    category: 'Category 2'
  },
  {
    productId: '461',
    name: 'Product 7',
    price: 19.99,
    description: 'Description for Product 2',
    category: 'Category 2'
  },
  {
    productId: '462',
    name: 'Product 8',
    price: 19.99,
    description: 'Description for Product 2',
    category: 'Category 1'
  },
  {
    productId: '463',
    name: 'Product 9',
    price: 189.55,
    description: 'Description for Product 2',
    category: 'Category 1'
  },
  {
    productId: '464',
    name: 'Product 10',
    price: 166.9,
    description: 'Description for Product 2',
    category: 'Category 1'

  },
  {
    productId: '465',
    name: 'Product 11',
    price: 114.30,
    description: 'Description for Product 2',
    category: 'Category 1'

  },
  {
    productId: '466',
    name: 'Product 12',
    price: 599,
    description: 'Description for Product 20',
    category: 'Category 2'

  }
];

// Update or insert the products into the database
const updateOrCreateProduct = async (product) => {
    const filter = { productId: product.productId };
  
    try {
      const updatedProduct = await Product.findOneAndUpdate(filter, product, {
        upsert: true,
        new: true
      });
  
      if (updatedProduct && !updatedProduct._id.equals(product._id)) {
        console.log(`Product "${product.name}" updated successfully!`);
      } else {
        console.log(`Product "${product.name}" inserted successfully!`);
      }
    } catch (err) {
      console.error(`Failed to insert or update product "${product.name}":`, err);
    }
  };
  

// Iterate over the products and update or insert them
const updateOrCreateProducts = async () => {
  for (const product of products) {
    await updateOrCreateProduct(product);
  }
};

updateOrCreateProducts();

module.exports = Product;
