// emailService.js

const nodemailer = require("nodemailer");
const { User } = require("../models/User");
const Product = require("../models/Product");

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // Or use a different service
  auth: {
    user: process.env.MAIL,
    pass: process.env.APP_PASS,
  },
});

// Function to send an email
const sendEmail = (to, subject, htmlContent) => {
  return transporter.sendMail({
    from: process.env.MAIL, // Sender email
    to, // Recipient email
    subject, // Subject line
    html: htmlContent, // HTML body of the email
  });
};

const adminEmailTemplate = (orderDetails) => {
  const userName = User.findById(orderDetails.userId).populate("store");
  const product = Product.findById(orderDetails.productId);
  return `
      <h1>New Order Placed!</h1>
      <p>An order has been placed with the following details:</p>
      <ul>
        <li>Order Invoice: ${orderDetails.invoice}</li>
        <li>Orderer: ${userName.name}</li>
        <li>Store Name: ${userName.store.storeName}</li>
        <ul>
          <li>Product Name:${product.name}</li>
          <li>Order Quantity: ${orderDetails.quantity}</li>
          <li>Product PackSize ${product.packSize}</li>
          <li>Product Group: ${product.group}</li>
          <li>Product MRP: ${product.price}</li>
        </ul>
        <hr>
        <li>Total Amount: ${orderDetails.price}</li>
      </ul>
      <p>Check the admin dashboard for more details.</p>
    `;
};

const ordererEmailTemplate = (orderDetails) => {
  const userName = User.findById(orderDetails.userId).populate("store");
  const product = Product.findById(orderDetails.productId);
  return `
      <h1>Thank You for Your Order, ${userName.username}!</h1>
      <p>We've received your order with the following details:</p>
      <ul>
        <li>Order ID: ${orderDetails.invoice}</li>
        <li>Store Name: ${userName.store.storeName}</li>
        <li>Products:</li>
        <ul>
          <li>Product Name:${product.name}</li>
          <li>Order Quantity: ${orderDetails.quantity}</li>
          <li>Product PackSize ${product.packSize}</li>
          <li>Product Group: ${product.group}</li>
          <li>Product MRP: ${product.price}</li>
        </ul>
        <hr>
        <li>Total Amount: ${orderDetails.price}</li>
      </ul>
      <p>We will soon contact you and talk further about payment details and the order shipment.</p>
    `;
};

module.exports = { sendEmail, adminEmailTemplate, ordererEmailTemplate };
