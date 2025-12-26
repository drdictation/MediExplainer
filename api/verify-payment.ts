import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { session_id } = req.query;

    if (!session_id) {
        return res.status(400).json({ error: 'Missing session_id' });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            return res.status(200).json({ verified: true });
        } else {
            return res.status(400).json({ verified: false, error: 'Payment not completed' });
        }
    } catch (err: any) {
        console.error('Stripe verification error:', err);
        return res.status(500).json({ error: 'Verification failed' });
    }
}
