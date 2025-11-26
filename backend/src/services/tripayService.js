const axios = require('axios');
const crypto = require('crypto');

class TripayService {
  constructor() {
    this.apiKey = process.env.TRIPAY_API_KEY;
    this.privateKey = process.env.TRIPAY_PRIVATE_KEY;
    this.merchantCode = process.env.TRIPAY_MERCHANT_CODE;
    this.mode = process.env.TRIPAY_MODE || 'sandbox';
    this.baseURL = this.mode === 'production' 
      ? 'https://tripay.co.id/api'
      : 'https://tripay.co.id/api-sandbox'
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      httpAgent: require('http').Agent({ keepAlive: true }),
      httpsAgent: require('https').Agent({ keepAlive: true })
    });

    console.log('[TRIPAY] Initialized:', {
      mode: this.mode,
      baseURL: this.baseURL,
      merchantCode: this.merchantCode
    });
  }

  // ✅ Retry wrapper for API calls
  async retryRequest(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        const isLastRetry = i === retries - 1;
        const shouldRetry = error.code === 'ECONNRESET' || 
                           error.code === 'ETIMEDOUT' ||
                           error.code === 'ENOTFOUND' ||
                           error.response?.status >= 500;

        if (isLastRetry || !shouldRetry) {
          throw error;
        }

        console.log(`[TRIPAY] Retry ${i + 1}/${retries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  async getPaymentChannels() {
    try {
      console.log('[TRIPAY] Fetching payment channels...');
      
      const response = await this.retryRequest(async () => {
        return await this.client.get('/merchant/payment-channel');
      });

      console.log('[TRIPAY] Channels fetched successfully:', response.data.data?.length || 0);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get payment channels');
      }

      return response.data.data;
    } catch (error) {
      console.error('[TRIPAY] Get channels error:', error.message);
      console.error('[TRIPAY] Error details:', {
        code: error.code,
        status: error.response?.status,
        message: error.response?.data?.message
      });
      
      // ✅ Return cached/fallback channels instead of throwing
      return this.getFallbackChannels();
    }
  }

  // ✅ Fallback payment channels (most common Indonesian methods)
  getFallbackChannels() {
    console.log('[TRIPAY] Using fallback payment channels');
    return [
      {
        code: 'BRIVA',
        name: 'BRI Virtual Account',
        group: 'Virtual Account',
        fee_merchant: { flat: 0, percent: 0 },
        fee_customer: { flat: 4000, percent: 0 },
        total_fee: { flat: 4000, percent: 0 },
        minimum_fee: 0,
        maximum_fee: 0,
        icon_url: 'https://tripay.co.id/images/payment_icon/BRIVA.png',
        active: true
      },
      {
        code: 'BNIVA',
        name: 'BNI Virtual Account',
        group: 'Virtual Account',
        fee_merchant: { flat: 0, percent: 0 },
        fee_customer: { flat: 4000, percent: 0 },
        total_fee: { flat: 4000, percent: 0 },
        minimum_fee: 0,
        maximum_fee: 0,
        icon_url: 'https://tripay.co.id/images/payment_icon/BNIVA.png',
        active: true
      },
      {
        code: 'MANDIRIVA',
        name: 'Mandiri Virtual Account',
        group: 'Virtual Account',
        fee_merchant: { flat: 0, percent: 0 },
        fee_customer: { flat: 4000, percent: 0 },
        total_fee: { flat: 4000, percent: 0 },
        minimum_fee: 0,
        maximum_fee: 0,
        icon_url: 'https://tripay.co.id/images/payment_icon/MANDIRIVA.png',
        active: true
      },
      {
        code: 'BCAVA',
        name: 'BCA Virtual Account',
        group: 'Virtual Account',
        fee_merchant: { flat: 0, percent: 0 },
        fee_customer: { flat: 4000, percent: 0 },
        total_fee: { flat: 4000, percent: 0 },
        minimum_fee: 0,
        maximum_fee: 0,
        icon_url: 'https://tripay.co.id/images/payment_icon/BCAVA.png',
        active: true
      },
      {
        code: 'PERMATAVA',
        name: 'Permata Virtual Account',
        group: 'Virtual Account',
        fee_merchant: { flat: 0, percent: 0 },
        fee_customer: { flat: 4000, percent: 0 },
        total_fee: { flat: 4000, percent: 0 },
        minimum_fee: 0,
        maximum_fee: 0,
        icon_url: 'https://tripay.co.id/images/payment_icon/PERMATAVA.png',
        active: true
      },
      {
        code: 'QRIS',
        name: 'QRIS',
        group: 'E-Wallet',
        fee_merchant: { flat: 0, percent: 0.7 },
        fee_customer: { flat: 0, percent: 0 },
        total_fee: { flat: 0, percent: 0.7 },
        minimum_fee: 0,
        maximum_fee: 0,
        icon_url: 'https://tripay.co.id/images/payment_icon/QRIS.png',
        active: true
      }
    ];
  }

  async createPayment(data) {
    try {
      const {
        orderId,
        orderCode,
        amount,
        customerName,
        customerEmail,
        customerPhone,
        paymentMethod
      } = data;

      const expiryTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours
      
      const signature = crypto
        .createHmac('sha256', this.privateKey)
        .update(`${this.merchantCode}${orderCode}${amount}`)
        .digest('hex');

      const payload = {
        method: paymentMethod,
        merchant_ref: orderCode,
        amount: amount,
        customer_name: customerName,
        customer_email: customerEmail || 'noreply@example.com',
        customer_phone: customerPhone || '081234567890',
        order_items: [
          {
            sku: orderId,
            name: `Order ${orderCode}`,
            price: amount,
            quantity: 1
          }
        ],
        return_url: `${process.env.FRONTEND_URL}/track/${orderCode}`,
        expired_time: expiryTime,
        signature: signature
      };

      console.log('[TRIPAY] Creating payment:', {
        method: paymentMethod,
        amount: amount,
        reference: orderCode
      });

      const response = await this.retryRequest(async () => {
        return await this.client.post('/transaction/create', payload);
      });

      console.log('[TRIPAY] Payment created:', {
        reference: response.data.data?.reference,
        checkout_url: response.data.data?.checkout_url
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create payment');
      }

      return response.data.data;
    } catch (error) {
      console.error('[TRIPAY] Create payment error:', error.message);
      console.error('[TRIPAY] Error details:', {
        code: error.code,
        status: error.response?.status,
        message: error.response?.data?.message,
        errors: error.response?.data?.errors
      });
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  async checkPaymentStatus(reference) {
    try {
      console.log('[TRIPAY] Checking payment status:', reference);
      
      const response = await this.retryRequest(async () => {
        return await this.client.get(`/transaction/detail`, {
          params: { reference }
        });
      });

      console.log('[TRIPAY] Payment status:', response.data.data?.status);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to check payment status');
      }

      return response.data.data;
    } catch (error) {
      console.error('[TRIPAY] Check status error:', error.message);
      throw new Error(`Failed to check payment status: ${error.message}`);
    }
  }

  validateCallbackSignature(receivedSignature, json) {
    const signature = crypto
      .createHmac('sha256', this.privateKey)
      .update(json)
      .digest('hex');

    return signature === receivedSignature;
  }
}

module.exports = new TripayService();
