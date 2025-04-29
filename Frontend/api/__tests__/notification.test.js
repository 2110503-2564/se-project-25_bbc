import { sendNoti, sendPromoCode } from "../noti"; // Adjust the import path

describe("API Functions", () => {
  const URL = process.env.NEXT_PUBLIC_API_URL;

  beforeAll(() => {
    global.fetch = jest.fn(); // Mock fetch
  });

  afterEach(() => {
    fetch.mockClear();  // Clear mocks after each test
  });

  it("should successfully send a notification", async () => {
    const token = "token123";
    const head = "Test Notification";
    const detail = "This is a test notification.";
    const type = "emergency";
    const mockResponse = { success: true, message: "Notification sent" };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const data = await sendNoti(token, head, detail, type);

    expect(data).toEqual(mockResponse);

  });

  it("should handle errors when sending a notification", async () => {
    const token = "token"
    const head = "Error Notification";
    const detail = "This is an error notification.";
    const type = "info";
    const mockErrorMessage = "Failed to send notification";

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: mockErrorMessage }),
    });

    const data = await sendNoti(token, head, detail, type);
    expect(data).toBeNull(); // Expect null on error, as per your function
  });

  it("should handle missing parameters when sending a notification", async () => {
      const token = "testToken";
      const data = await sendNoti(token, null, null, null);
      expect(data).toBeNull();
  });

  it("should successfully send a promo code", async () => {
    const token = "toekn"
    const hotel_id = "hotel123";
    const detail = "20% off";
    const type = "discount";
    const expire = "2024-12-31";
    const code = "PROMOCODE20";
    const discountType = "percentage";
    const limit = 100;
    const discountValue = 20;


    const mockResponse = { success: true, message: "Promo code created" };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const data = await sendPromoCode(token, hotel_id, detail, type, expire, code, discountType, limit, discountValue);

    expect(data).toEqual(mockResponse);
  });


  it("should handle errors when sending a promo code", async () => {
      const token = "token"
      const hotel_id = "hotel123";
      const detail = "20% off";
      const type = "discount";
      const expire = "2024-12-31";
      const code = "PROMOCODE20";
      const discountType = "percentage";
      const limit = 100;
      const discountValue = 20;
       const mockErrorMessage = "Failed to create promo code";

      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: mockErrorMessage }),
      });

      const data = await sendPromoCode(token, hotel_id, detail, type, expire, code, discountType, limit, discountValue); // Include all parameters

      expect(data).toBeNull();

  });

it("should handle missing parameters when sending a promo code", async () => {
  const token = "testToken";
  const data = await sendPromoCode(token, null, null, null, null, null, null, null, null);
  expect(data).toBeNull();
});

});