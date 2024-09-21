import { differenceInHours } from 'date-fns';
import { Stripe } from 'stripe';
import { config } from '../../config';
import { TBooking } from '../booking/booking.interface';
import { TUser } from '../user/user.interface';
import { TCar } from './car.interface';

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

type TMakeCarStripePayment = {
    startTime: string;
    endTime: string;
    booking: TBooking;
    car: TCar;
    user: TUser;
};

async function makeStripePayment({ startTime, endTime, car, user }: TMakeCarStripePayment) {
    try {
        const fullStartTime = `1970-01-01T${startTime}:00.000Z`;
        const fullEndTime = `1970-01-01T${endTime}:00.000Z`;
        const totalHours = Math.abs(differenceInHours(fullStartTime, fullEndTime));
        const totalCost = car.pricePerHour * totalHours;

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: car?.name,
                            images: car?.images?.map((img) => img?.secure_url),
                            description: `Please provide the total rental cost for your booking. Kindly enter the amount in the format of USD for the rental period.`,
                        },
                        unit_amount: totalCost * 100,
                    },
                    quantity: 1,
                },
            ],
            customer_email: user?.email,
            mode: 'payment',
            success_url: `${config.CORS_ORIGIN_URL}/checkout/success`,
            cancel_url: `${config.CORS_ORIGIN_URL}/checkout/canceled`,
        });

        return { id: session?.id };
    } catch (error) {
        throw new Error(error);
    }
}

export const CarUtils = {
    makeStripePayment,
};
