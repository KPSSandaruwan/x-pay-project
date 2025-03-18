# Instructions to Run the Project

1. **Clone the Repository**  
  ```bash
  git clone <repository-url>
  cd e-commerce-order-management
  ```

2. **Install Dependencies**  
  Ensure you have [Node.js](https://nodejs.org/) installed. Then run:  
  ```bash
  npm install
  ```

3. **Set Up Environment Variables**  
  Create a `.env` file in the root directory and configure the required environment variables. Refer to `.env.example` for guidance.
  You can refer the .env example.


4. **Start the Development Server**  
  Run the following command to start the server:  
  ```bash
  npm start or npm run dev to start it in dev environment
  ```

5. **Run Tests (Optional)**  
  To ensure everything is working correctly, run the tests:  
  ```bash
  npm run test
  ```


6. **API Instructions**  

  **To get the all orders**

    URL: http://localhost:5000/api/orders
    Request Type: GET

  **Create a new orders**

    URL: http://localhost:5000/api/orders
    Request Type: POST

    Body: 
    {
      "customer": {
          "name": "Nimal",
          "address": "test address"
      },
      "requestProducts": [
          {
              "name": "product2",
              "quantity": 1
          },
          {
              "name": "product1",
              "quantity": 3
          }
      ]
    }

  **Get single order**

    URL: http://localhost:5000/api/orders/:(order id)
    Request Type: GET


  **Get single order**

    URL: http://localhost:5000/api/orders/:(order id)
    Request Type: DELETE


  **Proceed to the next order**

    URL: http://localhost:5000/api/process-next-order
    Request Type: POST



