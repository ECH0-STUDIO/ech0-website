import { Resend } from 'resend';
import type { APIRoute } from 'astro';

// This explicitly marks this file to be Server-Side Rendered (not statically generated)
export const prerender = false;

// Initialize Resend SDK with the environment variable
// We fall back to a dummy string to avoid crashing at build time if env is not set yet
const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();

    // Extract form fields matching the "name" attributes in contact.astro
    const firstName = data.get('First-name') || '';
    const lastName = data.get('Last-name') || '';
    const email = data.get('Email') || 'No email provided';
    const pricingModel = data.get('Pricing-model') || 'Not selected';
    const fixedDetails = data.get('Fixed-project-details') || 'None';
    const selectedPackage = data.get('Selected-package') || 'None';
    const subscriptionDetails = data.get('Subscription-project-details') || 'None';
    const contactChannel = data.get('Contact-channel') || '';
    const contactLink = data.get('Contact-link') || '';

    // Create the HTML content for the email
    const htmlBody = `
      <h2>New Contact Form Submission from ech0.work</h2>
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <br />
      <h3>Project Details</h3>
      <p><strong>Pricing Model:</strong> ${pricingModel}</p>
      <p><strong>Fixed Project Details:</strong><br/> ${fixedDetails}</p>
      <p><strong>Selected Package:</strong> ${selectedPackage}</p>
      <p><strong>Subscription Details:</strong><br/> ${subscriptionDetails}</p>
      <br />
      <h3>Contact Preferences</h3>
      <p><strong>Channel:</strong> ${contactChannel}</p>
      <p><strong>Link/Phone:</strong> ${contactLink}</p>
    `;

    // Send the email via Resend
    const { data: resendData, error } = await resend.emails.send({
      from: 'ECH0 STUDIO <no-reply@ech0.work>',
      to: ['hello@ech0.work'],
      reply_to: email,
      subject: `New Lead: ${firstName} ${lastName}`,
      html: htmlBody,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Return a success JSON. Webflow's frontend script typically accepts a 200 JSON/Text response as success.
    return new Response(JSON.stringify({ success: true, data: resendData }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (err) {
    console.error("Server Error parsing form:", err);
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
