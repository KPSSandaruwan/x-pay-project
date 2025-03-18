const orderController = require('../api/controllers/orderController');
const { orders, orderQueue } = require('../api/models/orderModel');
const availableProducts = require('../api/models/productModel');
const orderStatus = require('../api/enums/orderStatus');

jest.mock('../api/models/orderModel', () => ({
  orders: [],
  orderQueue: [],
}));

jest.mock('../api/models/productModel', () => [
  { name: 'Product A', quantity: 10 },
  { name: 'Product B', quantity: 5 },
]);

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('orderController.createOrder', () => {
  beforeEach(() => {
    orders.length = 0;
    orderQueue.length = 0;
    jest.clearAllMocks();
  });

  it('should create a new order successfully', () => {
    const req = {
      body: {
        customer: 'Test Customer',
        requestProducts: [
          { name: 'Product A', quantity: 2 },
          { name: 'Product B', quantity: 1 },
        ],
      },
    };
    const res = mockResponse();

    orderController.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Order created successfully',
        order: expect.objectContaining({
          customer: 'Test Customer',
          status: orderStatus.PENDING,
        }),
      })
    );
    expect(orders.length).toBe(1);
    expect(orderQueue.length).toBe(1);
  });

  it('should return 400 for invalid order data (missing customer)', () => {
    const req = {
      body: {
        requestProducts: [{ name: 'Product A', quantity: 1 }],
      },
    };
    const res = mockResponse();

    orderController.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Invalid order data',
      })
    );
    expect(orders.length).toBe(0);
    expect(orderQueue.length).toBe(0);
  });

  it('should return 400 for insufficient stock', () => {
    const req = {
      body: {
        customer: 'Test Customer',
        requestProducts: [{ name: 'Product A', quantity: 15 }],
      },
    };
    const res = mockResponse();

    orderController.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Insufficient stock for Product A',
      })
    );
    expect(orders.length).toBe(0);
    expect(orderQueue.length).toBe(0);
  });

  it('should update product quantity after successful order', () => {
    const req = {
      body: {
        customer: 'Test Customer',
        requestProducts: [{ name: 'Product A', quantity: 2 }],
      },
    };
    const res = mockResponse();

    orderController.createOrder(req, res);

    expect(availableProducts.find(p => p.name === 'Product A').quantity).toBe(6);
  });

  it('should handle server error', () => {
    const req = {};
    const res = mockResponse();

    orderController.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Server error',
      })
    );
  });
});