import { ContentPage, ProseList, ProseSection } from "@/components/shared/content-page";

export default function Terms() {
  return (
    <ContentPage
      label="Legal"
      title="Terms of Service"
      description="The rules of the road for customers, refill businesses, staff and the platform. Plain English, because contracts should read like people talking."
      updated="21 September 2026"
    >
      <ProseSection title="1. Who is who">
        <p>
          MajiFlow is a technology platform operated by MajiFlow Kenya Ltd (Nairobi). It connects
          customers who want drinking water with independent refill businesses that sell and
          deliver it. <strong>MajiFlow is not a water supplier.</strong> Each refill business on the
          platform owns, filters and delivers its own water, sets its own prices, and is solely
          responsible for the quality and safety of its products.
        </p>
      </ProseSection>

      <ProseSection title="2. Using the platform">
        <p>You agree to use MajiFlow lawfully and not to misuse it, including by:</p>
        <ProseList
          items={[
            "Placing orders on behalf of others without their consent",
            "Posting false reviews or manipulating ratings on any business",
            "Impersonating customers, businesses, staff or platform staff",
            "Attempting to disrupt, scrape or reverse engineer the service",
          ]}
        />
      </ProseSection>

      <ProseSection title="3. Orders & payments">
        <p>
          When you place an order, payment (M-Pesa or card) is authorised before the order is sent
          to the business. Payment is transferred to the business when it confirms the order is
          accepted. If an order is rejected or cannot be fulfilled, the payment is refunded to your
          original payment method within 3–5 business days.
        </p>
        <p>
          Refill businesses are responsible for their own M-Pesa till or Paybill settings and for
          reconciling their own payments. The platform provides reconciliation tools but remains an
          intermediary.
        </p>
      </ProseSection>

      <ProseSection title="4. SaaS subscription">
        <p>
          Business plans are billed in KES monthly or annually in advance. All plans begin with a
          14-day free trial — no card is required. You may upgrade, downgrade or cancel from the
          Billing page at any time. Cancellation takes effect at the end of the paid period. No
          commission is charged on orders, and there are no setup fees.
        </p>
      </ProseSection>

      <ProseSection title="5. Delivery">
        <p>
          Delivery times, fees and free-delivery minimums are set by each business and shown on its
          profile. Where a delivery window is promised, the business commits to honouring it. Late
          or failed deliveries are between you and the business; MajiFlow's support desk will
          facilitate resolution and may remove persistently underperforming businesses.
        </p>
      </ProseSection>

      <ProseSection title="6. Liability">
        <p>
          To the maximum extent permitted by law, MajiFlow is not liable for the quality, safety or
          delivery of water supplied by independent businesses. Nothing here limits liability that
          cannot lawfully be limited, including liability for fraud or personal injury caused by
          negligence.
        </p>
      </ProseSection>

      <ProseSection title="7. Changes">
        <p>
          We may update these Terms with reasonable notice. Continued use after changes take effect
          means you accept them. The latest version is always on this page.
        </p>
      </ProseSection>
    </ContentPage>
  );
}