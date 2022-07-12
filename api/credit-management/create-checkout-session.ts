import { stripe } from '../../libs/stripe';
import { NextApiRequest, NextApiResponse } from 'next';

const createCheckoutSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    const { price, quantity = 1, metadata = {} } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        customer:"cus_LufzcZd0Z5wXdc",
        line_items: [
          {
            price: "price_1LCqfyG07afc4mHu34XY7sbS",
            quantity
          }
        ],
        mode: 'payment',
        allow_promotion_codes: true,
        success_url: `http://localhost:3000/credit-management`,
        cancel_url: `http://localhost:3000/credit-management`
      });
      
      return res.status(200).json({ sessionId: session.id });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default createCheckoutSession;