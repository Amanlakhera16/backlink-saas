import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { stripe } from "../infrastructure/stripe/stripeClient";
import { UserModel } from "../infrastructure/database/UserModel";
import { env } from "../config/env";
import { AppError } from "../middlewares/errorHandler";

const planToPriceId = (planId: string) => {
  if (planId === "basic") return env.STRIPE_PRICE_BASIC;
  if (planId === "pro") return env.STRIPE_PRICE_PRO;
  if (planId === "enterprise" && env.STRIPE_PRICE_ENTERPRISE) return env.STRIPE_PRICE_ENTERPRISE;
  return "";
};

export const createCheckoutSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const planId = req.body.planId as string;
    const priceId = planToPriceId(planId);
    if (!priceId) throw new AppError(400, "Invalid planId");

    const user = await UserModel.findById(req.user!.id);
    if (!user) throw new AppError(404, "User not found");

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user._id.toString() }
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user._id.toString(),
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { userId: user._id.toString() }
      },
      success_url: env.STRIPE_SUCCESS_URL,
      cancel_url: env.STRIPE_CANCEL_URL
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

export const createPortalSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user || !user.stripeCustomerId) throw new AppError(404, "Customer not found");

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: env.STRIPE_SUCCESS_URL
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};
