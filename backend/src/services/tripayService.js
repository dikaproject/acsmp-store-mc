const axios = require('axios');
const crypto = require('crypto');

class TripayService {
  constructor() {
    this.apiKey = process.env.TRIPAY_API_KEY;
    this.privateKey = process.env.TRIPAY_PRIVATE_KEY;
    this.merchantCode = process.env.TRIPAY_MERCHANT_CODE;
    this.baseUrl = process.env.TRIPAY_MODE === 'production' 
      ? 'https://tripay.co.id/api' 
      : 'https://tripay.co.id/api-sandbox';
  }

  generateSignature(merchantRef, amount) {
    const string = `${this.merchantCode}${merchantRef}${amount}`;
    return crypto
      .createHmac('sha256', this.privateKey)
      .update(string)
      .digest('hex');
  }

  validateCallbackSignature(callbackSignature, json) {
    const calculatedSignature = crypto
      .createHmac('sha256', this.privateKey)
      .update(json)
      .digest('hex');
    
    return callbackSignature === calculatedSignature;
  }

  async getPaymentChannels() {
    try {
      const response = await axios.get(`${this.baseUrl}/merchant/payment-channel`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.data.data;
    } catch (error) {
      console.error('[TRIPAY] Get channels error:', error.response?.data || error.message);
      throw new Error(`Failed to get payment channels: ${error.message}`);
    }
  }

  async createPayment({ 
    orderId, 
    orderCode, 
    amount, 
    customerName, 
    customerEmail, 
    customerPhone, 
    paymentMethod 
  }) {
    try {
      const merchantRef = orderCode;
      const signature = this.generateSignature(merchantRef, amount);

      // ✅ Get URLs from env or use defaults
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

      console.log('[TRIPAY] Using URLs:', {
        callback: `${baseUrl}/api/orders/webhook`,
        return: `${frontendUrl}/track?code=${orderCode}`
      });

      // ✅ Ensure proper data formatting
      const payload = {
        method: paymentMethod,
        merchant_ref: merchantRef,
        amount: parseInt(amount),
        customer_name: customerName || 'Customer',
        customer_email: customerEmail || 'noreply@sssmc.com',
        customer_phone: customerPhone?.replace(/^0/, '62') || '628123456789', // ✅ Format to +62
        order_items: [
          {
            name: `Order ${orderCode}`,
            price: parseInt(amount),
            quantity: 1
          }
        ],
        callback_url: `${baseUrl}/api/orders/webhook`,
        return_url: `${frontendUrl}/track?code=${orderCode}`,
        expired_time: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
        signature: signature
      };

      console.log('[TRIPAY] Creating payment:', {
        method: paymentMethod,
        amount,
        merchant_ref: merchantRef,
        callback_url: payload.callback_url,
        return_url: payload.return_url
      });

      const response = await axios.post(
        `${this.baseUrl}/transaction/create`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log('[TRIPAY] Payment created:', response.data.data.reference);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create payment');
      }
    } catch (error) {
      console.error('[TRIPAY] Create payment error:', error.response?.data || error.message);
      if (error.response?.data) {
        const errorMsg = error.response.data.message || 'Failed to create payment';
        throw new Error(errorMsg);
      }
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  async checkPaymentStatus(reference) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/detail`,
        {
          params: { reference },
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('[TRIPAY] Check status error:', error.response?.data || error.message);
      throw new Error(`Failed to check payment status: ${error.message}`);
    }
  }
}

module.exports = new TripayService();
