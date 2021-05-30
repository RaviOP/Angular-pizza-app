const mongoose = require("mongoose")

const orderSchema = new mongoose
    .Schema({
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: {
            type: Object,
            required: true
        },
        phone: {
            type: String,
            required: true,
            validate: /^[0-9]{10}$/
        },
        address: {
            type: String,
            required: true
        },
        paymentType: {
            type: String,
            default: 'COD'
        },
        status: {
            type: String,
            default: 'Placed'
        }
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model("Order", orderSchema)

module.exports = Order