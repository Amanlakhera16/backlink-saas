import { Request, Response } from "express";
import { stripe } from "../infrastructure/stripe/stripeClient";
import { env } from "../config/env";
import { SubscriptionModel } from "../infrastructure/database/SubscriptionModel";
import { priceIdToPlanId } from "../config/plans";

const upsertSubscription = async (subscription: any, userId: string, customerId: string) => {
  const priceId = subscription.items?.data?.[0]?.price?.id || "";
  const planId = priceIdToPlanId(priceId);

  await SubscriptionModel.findOneAndUpdate(
    { userId },
    {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      planId,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    },
    { upsert: true, new: true }
  );
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig) return res.status(400).send("Missing Stripe signature");

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.subscription && session.customer && session.client_reference_id) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await upsertSubscription(subscription, session.client_reference_id, session.customer);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const userId = subscription.metadata?.userId;
        if (userId && customerId) {
          await upsertSubscription(subscription, userId, customerId);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await SubscriptionModel.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          { status: subscription.status, cancelAtPeriodEnd: subscription.cancel_at_period_end }
        );
        break;
      }
      default:
        break;
    }

    res.json({ received: true });
  } catch (err: any) {
    res.status(500).json({ message: "Webhook processing failed" });
  }
};
