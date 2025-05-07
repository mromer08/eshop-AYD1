import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const getTopSellingProducts = async (req, res) => {
    try {
        // Aggregate orders to get the total quantity sold for each product
        const topProducts = await Order.aggregate([
            {
                $unwind: "$products" // Deconstructs the products array to separate documents
            },
            {
                $group: {
                    _id: "$products.product", // Group by product ID
                    totalSold: { $sum: "$products.quantity" } // Sum the quantity sold
                }
            },
            {
                $sort: { totalSold: -1 } // Sort by total quantity sold in descending order
            },
            {
                $limit: 5 // Limit to top 5 products
            }
        ]);

        // Populate the product details (name) for each product in the topProducts array
        const populatedProducts = await Product.find({ _id: { $in: topProducts.map(p => p._id) } })
            .select('name') // Only return the name field
            .lean();

        // Combine the product details with the totalSold for each product and format the result
        const result = topProducts.map((topProduct) => {
            const productDetails = populatedProducts.find(p => p._id.toString() === topProduct._id.toString());
            return {
                name: productDetails?.name || 'Unknown Product', // In case the product is not found
                value: topProduct.totalSold
            };
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top-selling products', error: error.message });
    }
};

const getTopActiveUsers = async (req, res) => {
    try {
        // Aggregate to count orders by user and sort by most active users
        const topUsers = await Order.aggregate([
            { $group: { _id: '$user', orderCount: { $sum: 1 } } }, // Group by user and count orders
            { $sort: { orderCount: -1 } }, // Sort by order count in descending order
            { $limit: 5 }, // Limit to top 5 users
        ]);

        // Populate the user information
        const usersWithDetails = await User.find({ _id: { $in: topUsers.map(user => user._id) } })
            .select('name lastname');

        // Format the result with name and value
        const result = topUsers.map(user => {
            const userInfo = usersWithDetails.find(u => u._id.equals(user._id));
            return {
                name: `${userInfo.name} ${userInfo.lastname}`,
                value: user.orderCount
            };
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top active users', error: error.message });
    }
};

const getTopSpendingUsers = async (req, res) => {
    try {
        // Aggregate to sum total spent by each user and sort by highest spending
        const topSpendingUsers = await Order.aggregate([
            { $group: { _id: '$user', totalSpent: { $sum: '$total' } } }, // Group by user and sum total spent
            { $sort: { totalSpent: -1 } }, // Sort by total spent in descending order
            { $limit: 5 }, // Limit to top 5 users
        ]);

        // Populate the user information
        const usersWithDetails = await User.find({ _id: { $in: topSpendingUsers.map(user => user._id) } })
            .select('name lastname');

        // Format the result with name and value
        const result = topSpendingUsers.map(user => {
            const userInfo = usersWithDetails.find(u => u._id.equals(user._id));
            return {
                name: `${userInfo.name} ${userInfo.lastname}`,
                value: user.totalSpent
            };
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top spending users', error: error.message });
    }
};

const getOrderCountByField = async (req, res) => {
    const { groupBy } = req.query; // Query param: 'status', 'payment_method', 'shipping_method'
    
    if (!groupBy || !['status', 'payment_method', 'shipping_method'].includes(groupBy)) {
        return res.status(400).json({ message: 'Invalid groupBy parameter. Must be one of: status, payment_method, shipping_method.' });
    }

    try {
        // Aggregate orders by the field provided in query
        const orderCountByField = await Order.aggregate([
            { $group: { _id: `$${groupBy}`, count: { $sum: 1 } } }, // Group by the selected field and count
            { $sort: { count: -1 } } // Optional: Sort by count in descending order
        ]);

        // Format the result with name (grouped field) and value (count)
        const result = orderCountByField.map(order => ({
            name: order._id, // The field value (status, payment_method, or shipping_method)
            value: order.count // The count of orders with that field value
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order counts', error: error.message });
    }
};

export { getTopSellingProducts,
    getTopActiveUsers,
    getTopSpendingUsers,
    getOrderCountByField
};