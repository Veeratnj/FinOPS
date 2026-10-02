interface SubscriptionResponse {
  success: boolean;

  plan_name:
    | "free"
    | "platform"
    | "platform-plus"
    | "enterprise"
    | "datacenter";

  status:
    | "inactive"
    | "trial"
    | "active";

  trial_end_date: string | null;

  auto_renew: boolean;
}
import { ApiService } from "./apiService";

class SubscriptionService extends ApiService {

  async getCurrentSubscription():
  Promise<SubscriptionResponse> {

  return this.get(
    "/tenants/current-subscription"
  ) as Promise<SubscriptionResponse>;

}

  async cancelSubscription() {
    return this.post(
      "/tenants/cancel-subscription",
      {}
    );
  }

}

export const subscriptionService =
  new SubscriptionService();